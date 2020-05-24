function showNotification(from, align) {
    color = 'primary';

    $.notify({
        icon: "nc-icon nc-bell-55",
        message: "test test test"

    }, {
        type: color,
        timer: 8000,
        placement: {
            from: from,
            align: align
        }
    });
}

const Atrament = require('atrament');

$(document).ready(function () {
    /* BIG SETUP */
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    var _word;
    let _time = {
        limit: 100,
        seconds: 0,
    };
    var _timeinterval = null;

    var _chatlog = [];
    var _strokelog = [];
    var _roundInProgress = false;

    var _usrs = [];
    var _guessed = [];
    var _thisUser;
    var _isDrawing = false;
    var _alreadyGuessed = false;
    var _location = new URL(window.location);
    var _urlspname = new URLSearchParams(_location.search); //can be removed but i find it clearer like this
    if (_urlspname.has('username') && window.location.pathname == '/') {
        _thisUser = _urlspname.get('username');
        window.location.pathname = '/gameRoom';
    }
    else if (_urlspname.has('username') && _location.pathname == '/gameRoom') {
        _thisUser = _urlspname.get('username');
        _usrs.push(_thisUser);
    }

    if (window.location.pathname === '/gameRoom') {
        $.ajax({
            type: "post",
            url: _location.origin + "/gameRoom/joined",
            data: { name: _thisUser },
            complete: function () {
                setTimeout(() => {
                    if (_usrs.length == 1) {
                        $('#round').html('Start')
                        _isDrawing = true;
                    }
                    else
                        $('#round').html('Waiting');
                    // should disable buttons
                }, 5000)
            }
        });
    }

    // BEJGfAGejKPRGTy6VZ9aN85L

    let sketchpad;
    $('#sketchpad').width($('#sketchpadParent').width() - 20);
    $(window).resize(function () {
        $('#sketchpad').width($('#sketchpadParent').width() - 20);
    });
    const canvas = document.querySelector('#sketchpad');
    if (canvas) {
        sketchpad = new Atrament(canvas, {
            width: $('#sketchpad').width(),
            height: $('#sketchpad').height()
        });
        sketchpad.smoothing = 1.5;
        sketchpad.adaptiveStroke = false;
        sketchpad.recordStrokes = true;
        sketchpad.addEventListener('clean', () => {
            if (_isDrawing)
                sendClear();
        });
        sketchpad.addEventListener('fillstart', (stroke/* { x, y } */) => {
            if (_isDrawing)
                sendFill(stroke)
        });
        sketchpad.addEventListener('strokerecorded', function ({ stroke }) {
            if (_isDrawing)
                sendLine(stroke)
        });
    } // sketchpad doesn't resize very well


    /* DEBUGGING CONLOGS */
    var socketId = Echo.socketId();
    // console.log('Socket ID: ', socketId);
    // console.log(_location);
    // setInterval(() => {
    //     // console.log("usrs: ", _usrs);
    //     console.log("isdrawing: ", _isDrawing);
    //     // console.log("sketchpad: ", sketchpad);
    // }, 10000);

    /* SERVER CHANNELS AND EVENT HANDLERS */
    Echo.channel('laravel_database_room')
        .listen(".UpdateChat", (e) => {
            // console.log('UPDATECHAT: ', e);
            $('#chatTextArea').html($('#chatTextArea').html() + e.name + ': ' + e.message + '\n')
        }).listen('.UpdateCanvas', (e) => { //breaks if 2 people somehow end up drawing at the same time ?...
            // console.log("UPDATECANVAS: ", e);
            switch (e['type']) {
                case 'clear':
                    sketchpad.clear();
                    break;
                case 'fill':
                    if (socketId !== e.socket && _isDrawing == false) {
                        stroke = e['data'];
                        sketchpad.mode = 'fill';
                        sketchpad.color = stroke.color;
                        /* sketchpad.weight = 10;
                        sketchpad.smoothing = 1.5; 
                        sketchpad.adaptiveStroke = false; */

                        sketchpad.fill(stroke.x, stroke.y);
                    }
                    break;
                case 'line':
                    if (socketId !== e.socket && _isDrawing == false) {
                        stroke = e['data'];
                        sketchpad.mode = 'draw';
                        sketchpad.color = stroke.color;
                        /* sketchpad.weight = parseFloat(stroke.weight);
                        sketchpad.smoothing = parseFloat(stroke.smoothing);
                        sketchpad.adaptiveStroke = !!(stroke.adaptiveStroke); */

                        const points = stroke.points.slice();
                        const firstPoint = points.shift();
                        let prevPoint = firstPoint;
                        sketchpad.beginStroke(firstPoint.x, firstPoint.y);
                        while (points.length > 0) {
                            const point = points.shift();
                            const { x, y } = sketchpad.draw(point.x, point.y, prevPoint.x, prevPoint.y)
                            prevPoint = { x, y };
                        }
                        sketchpad.endStroke(prevPoint.x, prevPoint.y);
                    }
                    break;
                default:
                    break;
            }
        }).listen('.AskSync', (e) => {
            sync();
        }).listen('.SomeoneJoined', (e) => {
            // console.log('SOMEONEJOINED: ', e);
            if (socketId !== e.socket) {
                _usrs.push(e.name);
                cleanUsrs();
                $('#round').attr('disabled', false);
                $('#chatTextArea').html($('#chatTextArea').html() + e.name + ' joined\n')
                sync();
            }
        }).listen('.SomeoneLeft', (e) => {
            // console.log('SOMEONELEFT: ', e);
            _usrs = _usrs.filter(function (val) {
                return val !== e.name;
            });
            if (_usrs.length == 1) {
                $('#round').attr('disabled', true);
            }
            $('#chatTextArea').html($('#chatTextArea').html() + e.name + ' left\n')
            sync();
        }).listen('.SomeoneGuessed', (e) => {
            // console.log('SOMEONEGUESSED: ', e);
            $('#chatTextArea').html($('#chatTextArea').html() + e.name + ' guessed the word\n')
            if (e.name != _thisUser && _isDrawing) {
                _guessed.push(e.name);
                if (_guessed.length == _usrs.length - 1) {
                    timeUp();
                }
            }
        }).listen('.TimeUp', (e) => {
            // console.log('TIMEUP: ', e);
            clearInterval(_timeinterval);
            _timeinterval = null;
            if (e.winners) {
                if (e.winners.length = _usrs.length - 1)
                    $('#chatTextArea').html($('#chatTextArea').html() + 'EVERYBODY WON\n');
                else {
                    $('#chatTextArea').html($('#chatTextArea').html() + 'WINNERS:\n');
                    e.winners.forEach((el) => {
                        $('#chatTextArea').html($('#chatTextArea').html() + el + '\n');
                    });
                }
            }
            else
                $('#chatTextArea').html($('#chatTextArea').html() + 'Nobody won last round\n');

            _guessed = [];
            _isDrawing = _thisUser == _usrs[e.next];

            _alreadyGuessed = false;
            _roundInProgress = false;

            disableSketch();

            _isDrawing ? $('#round').html('START') : $('#round').html('WAITING');

        }).listen('.Round', (e) => {
            _roundInProgress = true;
            resetInterval();
            _timeinterval = setInterval(intervalfun, 1000);
            $('#clear').click();
        }).listen('.Word', (e) => {
            _word = e.word;
            $('#clear').click();
        }).listen('.Sync', (e) => {
            if (_isDrawing == false) {
                _usrs = e.data._usrs;
                _time.seconds = e.data._time.seconds;
                _time.limit = e.data._time.limit;
                _word = e.data._word;
            }
        });

    window.onbeforeunload = function () {
        $.ajax({
            type: "post",
            url: _location.origin + "/gameRoom/left",
            data: { name: _thisUser },
            dataType: "json",
        });
        if (_isDrawing) {
            timeUp();
        }
    }; //doesn't catch all cases

    /* SERVER EVENT TRIGGERS */
    $('#sendText').click(function (e) {
        e.preventDefault();
        $('#chat_form').submit();
    });

    $('#chat_form').on('submit', function (e) {
        e.preventDefault();
        sendText();
    });

    $('#chatTextArea').focus(function () {
        $('#textToSend').focus();
    })

    $('#play').click(function (e) {
        e.preventDefault();
        if ($('#userName').val().trim().length >= 2) { //big validation...
            //should check for name availability
            _urlspname.append('username', $('#userName').val().trim())
            window.location = _location.origin + '/gameRoom?' + _urlspname.toString();
        }
        else {
            $('#userName').addClass('is-invalid');
            $('#userNameParent').append('<span id="nameError" class="invalid-feedback" style="display: block;" role="alert"> <strong> Name is Invalid </strong></span>')
        }
    });

    $('#userName').click(function (e) {
        $('#userName').removeClass('is-invalid');
        $('#nameError').remove();
    });

    $('#round').click(() => {
        if (_roundInProgress == false && _isDrawing)
            round()
        else timeUp();
    })

    $('#clear').click(() => {
        if (_isDrawing)
            sketchpad.clear();
    })

    $('#fill').click(() => {
        if (_isDrawing)
            sketchpad.mode = "fill";
    })

    $('#erase').click(() => {
        if (_isDrawing){
            // sketchpad.mode = "erase";
            sketchpad.color = "#fff";
            sketchpad.mode = "draw";
        }
    })

    $('#pencil').click(() => {
        if (_isDrawing)
            sketchpad.mode = "draw";
    })

    colorWell = document.querySelector("#html5colorpicker");
    colorWell.addEventListener("change", changesketcpadcolor, false);

    /* REUSABLE FUNCS */
    function sendText() {
        if ($('#textToSend').val().trim().length >= 1) {
            checkGuess();
        }
    }

    function sendLine(stroke) {
        $.ajax({
            type: "post",
            url: _location.origin + "/gameRoom/line",
            data: { type: 'line', data: stroke, name: _thisUser },
            dataType: "json"
        });
    }

    function sendFill(stroke) {
        $.ajax({
            type: "post",
            url: _location.origin + "/gameRoom/line",
            data: { type: 'fill', data: { x: stroke.x, y: stroke.y, color: sketchpad.color }, name: _thisUser },
            dataType: "json"
        });
    }

    function sendClear() {
        $.ajax({
            type: "post",
            url: _location.origin + "/gameRoom/line",
            data: { type: 'clear', data: null, name: _thisUser },
            dataType: "json"
        });
    }

    function checkGuess() {
        if ($('#textToSend').val().trim().toLowerCase() == _word.toLowerCase() && _isDrawing == false) {
            if (_alreadyGuessed == false) {
                _alreadyGuessed = true;
                $.ajax({
                    type: "post",
                    url: _location.origin + "/gameRoom/guessed",
                    data: { name: _thisUser },
                    dataType: "json",
                });
            }
        }
        else if (_isDrawing == false)
            $.ajax({
                type: "post",
                url: _location.origin + "/gameRoom/chat",
                data: { message: $('#textToSend').val(), name: _thisUser },
                dataType: "json",
            });
        $('#textToSend').val('');
    }

    function getWord() {
        if (_isDrawing)
            $.ajax({
                type: "get",
                url: _location.origin + "/gameRoom/word", //@TODO: CHECK IF IT WORKS
                success: function (response) {
                    // console.log(response);
                    _word = response;
                }
            });
    }

    function sync() {
        if (_isDrawing) {
            $.ajax({
                type: "post",
                url: _location.origin + "/gameRoom/toSync",
                data: {
                    data: {
                        _usrs: _usrs,
                        _word: _word,
                        _time: { seconds: _time.seconds, limit: _time.limit }
                    }
                },
                dataType: "json"
            });
        }
    }

    function cleanUsrs() {
        var uniqueNames = [];
        $.each(_usrs, function (i, el) {
            if ($.inArray(el, uniqueNames) === -1) uniqueNames.push(el);
        });
        _usrs = uniqueNames;
    }

    function askSync() {
        if (_isDrawing == false)
            $.ajax({
                type: "post",
                url: _location.origin + "/gameRoom/askSync"
            })
    }

    function intervalfun() {
        _time.seconds = _time.seconds - 1;
        updateTimer();
        if (_time.seconds == 0) {
            timeUp();
            resetInterval();
        }
    }

    function updateTimer() {
        $('#timer').html(_time.seconds);
        if (_isDrawing)
            $('#word').html(_word);
        else {
            var word = '';
            i = 0;
            while (i < _word.length) {
                word = word + ' _';
                i++;
            }
            $('#word').html(word);
        }
    }

    /* function resetTimer(desired = _time.limit) {
        _time.seconds = desired
        updateTimer();
        resetInterval();
    } */

    function resetInterval() {
        _time.seconds = _time.limit
    }

    function timeUp() {
        if (_isDrawing)
            $.ajax({
                type: "post",
                url: _location.origin + "/gameRoom/timeUp",
                data: {
                    next: (_usrs.indexOf(_thisUser) + 1) < _usrs.length ? _usrs.indexOf(_thisUser) + 1 : 0,
                    guessed: _guessed
                },
                dataType: "json"
            });
    }

    function round() {
        if (_isDrawing) {
            $('#round').html('STOP');
            getWord();
            sync();
            enableSketch();
            $.ajax({
                type: "post",
                url: _location.origin + "/gameRoom/round",
                dataType: "json"
            });
        }
    }

    function enableSketch() {
        $("#sketchpadParent").attr('style', 'max-height:686px; height:686px;');
        $('#clear').attr('disabled', false);
        $('#pencil').attr('disabled', false);
        $('#erase').attr('disabled', false);
        $('#fill').attr('disabled', false);
        $('#html5colorpicker').attr('disabled', false);
    }

    function disableSketch() {
        $("#sketchpadParent").attr('style', 'max-height:686px; height:686px; pointer-events: none;');
        $('#round').html('START');
        $('#timer').html('TIME');
        $('#word').html('WORD');
        $('#clear').attr('disabled', true);
        $('#pencil').attr('disabled', true);
        $('#erase').attr('disabled', true);
        $('#fill').attr('disabled', true);
        $('#html5colorpicker').attr('disabled', true);
    }

    function changesketcpadcolor(event) {
        console.log(event.target.value);
        if (_isDrawing) {
            sketchpad.color = event.target.value;
        }
    }
});


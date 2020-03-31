function initPickColor() {
    $('.pick-class-label').click(function () {
        var new_class = $(this).attr('new-class');
        var old_class = $('#display-buttons').attr('data-class');
        var display_div = $('#display-buttons');
        if (display_div.length) {
            var display_buttons = display_div.find('.btn');
            display_buttons.removeClass(old_class);
            display_buttons.addClass(new_class);
            display_div.attr('data-class', new_class);
        }
    });
}

/* function checkFullPageBackgroundImage() {
    $page = $('.full-page');
    image_src = $page.data('image');

    if (image_src !== undefined) {
        image_container = '<div class="full-page-background" style="background-image: url(' + image_src + ') "/>';
        $page.append(image_container);
    }
} */

/* function showNotification(from, align) {
    color = 'primary';

    $.notify({
        icon: "nc-icon nc-bell-55",
        message: "Welcome to <b>Paper Dashboard</b> - a beautiful bootstrap dashboard for every web developer."

    }, {
        type: color,
        timer: 8000,
        placement: {
            from: from,
            align: align
        }
    });
} */

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
    var _timeinterval = setInterval(() => {
        _time.seconds = _time.seconds - 1;
        updateTimer();
        if (_time.seconds == 0) {
            timeUp();
            resetInterval();
        }
    }, 1000)

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

    $.ajax({
        type: "post",
        url: _location.origin + "/gameRoom/joined",
        data: { name: _thisUser },
        complete: function () {
            setTimeout(() => {
                if (window.location.pathname === '/gameRoom') {
                    if (_usrs.length == 1) {
                        _isDrawing = true;
                        getWord();
                        resetTimer();
                    }
                }
            }, 5000)
        }
    });

    // BEJGfAGejKPRGTy6VZ9aN85L

    let sketchpad;
    const canvas = document.querySelector('#sketchpad');
    if (canvas) {
        sketchpad = new Atrament(canvas);
        sketchpad.smoothing = 1.3;
        sketchpad.adaptiveStroke = true;
        sketchpad.recordStrokes = true;
        sketchpad.addEventListener('clean', () => {
            if (_isDrawing)
                sendClear();
        });
        sketchpad.addEventListener('fillstart', ({ x, y }) => {
            if (_isDrawing)
                sendFill(x.y)
        });
        sketchpad.addEventListener('strokerecorded', function ({ stroke }) {
            if (_isDrawing)
                sendLine(stroke)
        });
    }

    /* DEBUGGING CONLOGS */
    var socketId = Echo.socketId();
    console.log('Socket ID: ', socketId);
    console.log(_location);
    setInterval(() => {
        console.log("usrs: ", _usrs);
        console.log("isdrawing: ", _isDrawing);
    }, 10000);

    /* SERVER CHANNELS AND EVENT HANDLERS */
    Echo.channel('laravel_database_room')
        .listen(".UpdateChat", (e) => {
            console.log(e);
            $('#chatTextArea').html($('#chatTextArea').html() + e.name + ': ' + e.message + '\n')
        }).listen('.UpdateCanvas', (e) => {
            console.log("Updatecanvas: ", e);
            if (socketId !== e.socket && _isDrawing == false) {
                stroke = e[0];
                sketchpad.mode = stroke.mode; //should rememeber old sketchpad settings
                sketchpad.weight = parseFloat(stroke.weight);
                sketchpad.smoothing = parseFloat(stroke.smoothing);
                sketchpad.color = stroke.color;
                sketchpad.adaptiveStroke = !!(stroke.adaptiveStroke);

                const points = stroke.points.slice();
                const firstPoint = points.shift();
                sketchpad.beginStroke(firstPoint.x, firstPoint.y);

                let prevPoint = firstPoint;
                while (points.length > 0) {
                    const point = points.shift();
                    const { x, y } = sketchpad.draw(point.x, point.y, prevPoint.x, prevPoint.y)
                    prevPoint = { x, y };
                }

                sketchpad.endStroke(prevPoint.x, prevPoint.y);
            }
        }).listen('.AskSync', (e) => {
            sync();
        }).listen('.SomeoneJoined', (e) => {
            _usrs.push(e.name);
            cleanUsrs();
            sync();
        }).listen('.SomeoneLeft', (e) => { //don't know if i can make this work
            _usrs = _usrs.filter(function (val, index) {
                return val !== e.name;
            });
            sync();
        }).listen('.SomeoneGuessed', (e) => {
            if (e.name == _thisUser) _alreadyGuessed = true;
            if (_isDrawing) {
                _guessed.push(e.name);
                if (_guessed.length == _usrs.length) {
                    timeUp();
                }
            }
        }).listen('.TimeUp', (e) => {
            _guessed = [];
            _isDrawing = _thisUser == _usrs[e.next];
            _alreadyGuessed = false;
            resetTimer();
            if (_isDrawing) {
                getWord();
                sync();
            }
        }).listen('.Word', (e) => {
            console.log('word: ', e);
            _word = e.word;
        }).listen('.Sync', (e) => {
            if (_isDrawing == false) {
                _usrs = e.data._usrs;
                _time.seconds = e.data._time.seconds;
                _time.limit = e.data._time.limit;
                _word = e.data._word;
            }
        });

    /* SERVER EVENT TRIGGERS */
    $('#sendText').click(function (e) {
        e.preventDefault();
        _isDrawing = !_isDrawing;
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

    /* REUSABLE FUNCS */
    function sendText() {
        if ($('#textToSend').val().length >= 1 && $('#textToSend').val().substr(0, 1) !== ' ') {
            checkGuess();
        }
    }

    function sendLine(stroke) {
        $.ajax({
            type: "post",
            url: _location.origin + "/gameRoom/line",
            data: { line: stroke, name: _thisUser },
            dataType: "json"
        });
    }

    function checkGuess() {
        if ($('#textToSend').val() == _word)
            $.ajax({
                type: "post",
                url: _location.origin + "/gameRoom/guessed",
                data: { name: _thisUser },
                dataType: "json",
            });
        else
            $.ajax({
                type: "post",
                url: _location.origin + "/gameRoom/chat",
                data: { message: $('#textToSend').val(), name: _thisUser },
                dataType: "json",
            });
    }

    function getWord() {
        if (_isDrawing)
            $.ajax({
                type: "get",
                url: _location.origin + "/gameRoom/word", //@TODO: CHECK IF IT WORKS
                success: function (response) {
                    console.log(response);
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

    function updateTimer() {
        $('#timerWord').html(_time.seconds + ' ' + _word)
    }

    function resetTimer(desired = _time.limit) {
        _time.seconds = desired
        updateTimer();
        resetInterval();
    }

    function resetInterval() {
        _time.seconds = _time.limit
    }

    function timeUp() {
        _isDrawing = false;
        _alreadyGuessed = false;
        $.ajax({
            type: "post",
            url: _location.origin + "/gameRoom/timeUp",
            data: {
                next: _usrs.indexOf(_thisUser) < _usrs.length ? _usrs.indexOf(_thisUser) : 0
            },
            dataType: "json"
        });
    }
});
@extends('layouts.app', [
'class' => '',
// 'backgroundImagePath' => 'img/bg/fabio-mangione.jpg'
])
@section('content')
<div class="content" style="height: calc(100vh - 93px)">
  <div class="row">
    <div class="col-8">
      <div class="card card-nav-tabs text-center">
        <div id="timerWord" class="card-header card-header-primary">
          <button id="round" class="btn btn-primary btn-round mt-0" disabled="true">Loading</button>
          <button id="timer" class="btn btn-primary btn-round mt-0" disabled="true">Time</button>
          <button id="word" class="btn btn-primary btn-round mt-0" disabled="true">Word</button>
          <button id="clear" class="mt-0 btn btn-primary btn-fab btn-icon btn-round" disabled="true">
            <i class="fa fa-recycle"></i>
          </button>
          <button id="pencil" class="mt-0 btn btn-primary btn-fab btn-icon btn-round" disabled="true">
            <i class="fa fa-pencil"></i>
          </button>
          <button id="erase" class="mt-0 btn btn-primary btn-fab btn-icon btn-round" disabled="true">
            <i class="fa fa-eraser"></i>
          </button>
          <button id="fill" class="mt-0 btn btn-primary btn-fab btn-icon btn-round" disabled="true">
            <i class="fa fa-tint"></i>
          </button>
          <input class="mt-0 btn btn-primary btn-fab btn-round" type="color" id="html5colorpicker"
            style="height:38px; " disabled="true">
        </div>
        <div class="card-body">
          <div id="sketchpadParent" class="col-12" style="max-height:686px; height:686px; pointer-events:none;">
            <canvas id="sketchpad" style="max-height:666px; height:666px;"></canvas>
          </div>
        </div>
        {{-- <div class="card-footer text-muted">
          
        </div> --}}
      </div>
    </div>
    <div class="col-4" id="chat">
      <div class="card card-nav-tabs">
        <div class="card-body">
          {{-- <blockquote class="blockquote mb-0">
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
                <footer class="blockquote-footer">Someone famous in <cite title="Source Title">Source Title</cite></footer>
              </blockquote> --}}
          <div class="form-group">
            <label for="chatTextArea">Chat</label>
            <textarea class="form-control disabledTextArea" id="chatTextArea"
              style="max-height:664px; height:664px;"></textarea>
          </div>
          <form id="chat_form" action="">
            <div class="row">
              <div class="col-10">
                <div class="input-group">
                  <div class="input-group-prepend">
                    <div class="input-group-text"><i class="fa fa-commenting-o"></i></div>
                  </div>
                  <input id="textToSend" type="text" class="form-control" placeholder="Type Here...">
                </div>
              </div>
              <button type="submit" id="sendText" class="mt-0 btn btn-primary btn-fab btn-icon btn-round">
                <i class="fa fa-paper-plane-o" style="margin-left: -1px;"></i>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</div>
@endsection
@extends('layouts.app', [
    'class' => '',
    // 'backgroundImagePath' => 'img/bg/fabio-mangione.jpg'
])

@section('content')
    <div class="content">
        <div class="container" >
            <div class="col-lg-4 col-md-6 ml-auto mr-auto">
                <form class="form" method="POST" action="{{-- {{ route('login') }} --}}">
                    @csrf
                    <div class="card card-login">
                        <div class="card-header ">
                            <div class="card-header ">
                                <h3 class="header text-center">Forger.io</h3>
                            </div>
                        </div>
                        <div class="card-body ">

                            <div class="input-group" id="userNameParent">
                                <div class="input-group-prepend">
                                    <span class="input-group-text">
                                        <i class="nc-icon nc-single-02"></i>
                                    </span>
                                </div>
                                <input id="userName" class="form-control{{ $errors->has('name') ? ' is-invalid' : '' }}" placeholder="{{ __('Name') }}" type="name" name="name" value="{{ old('name') }}" required autofocus>
                                
                                @if ($errors->has('name'))
                                    <span class="invalid-feedback" style="display: block;" role="alert">
                                        <strong>{{ $errors->first('name') }}</strong>
                                    </span>
                                @endif
                            </div>

                            {{-- <div class="input-group">
                                <div class="input-group-prepend">
                                    <span class="input-group-text">
                                        <i class="nc-icon nc-single-02"></i>
                                    </span>
                                </div>
                                <input id="roomID" class="form-control{{ $errors->has('roomID') ? ' is-invalid' : '' }}" name="roomID" placeholder="{{ __('Room ID') }}">
                                
                                @if ($errors->has('roomID'))
                                    <span class="invalid-feedback" style="display: block;" role="alert">
                                        <strong>{{ $errors->first('roomID') }}</strong>
                                    </span>
                                @endif
                            </div> --}}

                            {{-- <div class="form-group">
                                <div class="form-check">
                                     <label class="form-check-label">
                                        <input class="form-check-input" name="remember" type="checkbox" value="" {{ old('remember') ? 'checked' : '' }}>
                                        <span class="form-check-sign"></span>
                                        {{ __('Remember me') }}
                                    </label>
                                </div>
                            </div> --}}
                        </div>

                        <div class="card-footer">
                            <div class="text-center">
                                <button id="play" type="submit" class="btn btn-warning btn-round mb-3">{{ __('Play') }}</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
@endsection
{{-- 
@push('scripts')
@endpush
 --}}
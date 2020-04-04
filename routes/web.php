<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/



/* NEEDED */
// Auth::routes();

// Broadcast::routes(/* $attributes */);

Route::get('/', 'HomeController@index')->name('home');

// Route::get('/list', 'GameRoomController@index');

Route::post('/f', 'GameRoomController@testEvents');

Route::prefix('gameRoom'/* .'s' */)->group(function () {
	
	/*  
	Route::get('/{gameRoom?}', 'GameRoomController@show');
	Route::post('/{gameRoom?}/*', 'GameRoomController@*Event');
	*/
	
	Route::get('/', 'GameRoomController@show');
	Route::get('word', 'GameRoomController@wordEvent');
	Route::post('/chat', 'GameRoomController@chatEvent');
	
	Route::post('/line', 'GameRoomController@canvasEvent');
	Route::post('/clear', 'GameRoomController@canvasEvent');
	Route::post('/fill', 'GameRoomController@canvasEvent');

	Route::post('/joined', 'GameRoomController@joinedEvent');
	Route::post('/left', 'GameRoomController@leftEvent');
	
	Route::post('/round', 'GameRoomController@roundEvent');
	Route::post('/timeUp', 'GameRoomController@timeUpEvent');
	
	Route::post('/askSync', 'GameRoomController@askSyncEvent');
	Route::post('/toSync', 'GameRoomController@syncEvent');

	Route::post('/guessed', 'GameRoomController@guessedEvent');
});




/* LEFTOVER */
/* Route::group(['middleware' => 'auth'], function () {
	Route::resource('user', 'UserController', ['except' => ['show']]);
	Route::get('profile', ['as' => 'profile.edit', 'uses' => 'ProfileController@edit']);
	Route::put('profile', ['as' => 'profile.update', 'uses' => 'ProfileController@update']);
	Route::put('profile/password', ['as' => 'profile.password', 'uses' => 'ProfileController@password']);
}); */

/* Route::group(['middleware' => 'auth'], function () {
	Route::get('{page}', ['as' => 'page.index', 'uses' => 'PageController@index']);
}); */

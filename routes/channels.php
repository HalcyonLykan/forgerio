<?php

use Illuminate\Support\Facades\Broadcast;
use App\Broadcasting\Room;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

Broadcast::channel('App.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

// Broadcast::channel('room.{roomId}', function (/* $user */, $roomId) { //maybe use Room::class
//     /* if ($user->canJoinRoom($roomId)) { */
//         return true/* ['id' => $user->id, 'name' => $user->name] */;
//     /* } */
// }); 

// Broadcast::channel('room', Room::class);

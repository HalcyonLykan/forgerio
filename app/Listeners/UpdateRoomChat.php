<?php

namespace App\Listeners;

use App\Events\SentText;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class UpdateRoomChat
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /* *
     * Handle the event.
     *
     * @param  SentText  $event
     * @return void
     */
    /* public function handle(SentText $event)
    {
        dd($event);
        // return ;
    } */
}

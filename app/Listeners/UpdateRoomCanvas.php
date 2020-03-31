<?php

namespace App\Listeners;

use App\Events\DrawnLine;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class UpdateRoomCanvas
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

    /**
     * Handle the event.
     *
     * @param  DrawnLine  $event
     * @return void
     */
    public function handle(DrawnLine $event)
    {
        //
    }
}

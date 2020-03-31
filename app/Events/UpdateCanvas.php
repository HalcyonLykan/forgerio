<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class UpdateCanvas implements ShouldBroadcastNow /* ShouldBroadcastNow */
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $broadcastLine, $broadcastName, $broadcastRoom;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct($line, $name, $room = null)
    {
        $this->broadcastLine = $line;
        $this->broadcastRoom = $room;
        $this->broadcastName = $name;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new Channel('room' /* . isset($this->room) ? '_' . $this->room : '' */);
    }

    public function broadcastWith()
    {
        return [ $this->broadcastLine, 'name' => $this->broadcastName];
    }

    public function broadcastAs()
    {
        return 'UpdateCanvas';
    }
}

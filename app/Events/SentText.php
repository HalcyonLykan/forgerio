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

class SentText implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $broadcastText, $broadcastName, $broadcastRoom;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct($text, $name, $room = null)
    {
        $this->broadcastText = $text;
        $this->broadcastName = $name;
        $this->broadcastRoom = $room;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new Channel('room' /* . isset($this->broadcastRoom) ? '_' . $this->broadcastRoom : '' */);
    }

    public function broadcastWith()
    {
        //make array message and select randomly from that is case of null message as fallback
        return [
            'message' => $this->broadcastText,
            'name' => $this->broadcastName
        ];
    }

    public function broadcastAs()
    {
        return 'UpdateChat';
    }
}

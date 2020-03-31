<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TimeUp implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $next;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct($n)
    {
        $this->next = $n;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new Channel('room');
    }

    public function broadcastWith()
    {
        //make array message and select randomly from that is case of null message as fallback
        return [
            'next' => $this->next
        ];
    }

    public function broadcastAs()
    {
        return 'TimeUp';
    }
}

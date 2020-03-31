<?php

namespace App\Http\Controllers;

use App\Events\AskSync;
use App\Events\InPLM;
use App\Events\Joined;
use App\Events\Left;
use App\Events\SentText;
use App\Events\Sync;
use App\Events\TimeUp;
use App\Events\UpdateCanvas;
use App\Events\Word;
use App\GameRoom;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class GameRoomController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return view('pages.gameList');
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\GameRoom  $gameRoom
     * @return \Illuminate\Http\Response
     */
    public function show(GameRoom $gameRoom)
    {
        return view('pages.gameRoom');
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\GameRoom  $gameRoom
     * @return \Illuminate\Http\Response
     */
    public function edit(GameRoom $gameRoom)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\GameRoom  $gameRoom
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, GameRoom $gameRoom)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\GameRoom  $gameRoom
     * @return \Illuminate\Http\Response
     */
    public function destroy(GameRoom $gameRoom)
    {
        //
    }


    //@TODO: Refactor these into separate controller
    public function chatEvent(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:25|min:2',
            'message' => 'required|string|max:230|min:2',
        ]);
        // dd($validatedData);
        if ($validatedData['name'] != '' && $validatedData['message'] != '');
        broadcast(new SentText($validatedData['message'],$validatedData['name']));
    }

    public function canvasEvent(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:25|min:2',
            // 'line' => 'required|JSON',
        ]);
        // dd($request->line);
        broadcast(new UpdateCanvas($request->line, $validatedData['name']))->toOthers();
    }

    public function getWord(Type $var = null)
    {
    }

    public function checkGuess(Type $var = null)
    {
        # code...
    }

    public function syncEvent(Request $request)
    {
        broadcast(new Sync($request->data));
    }

    public function askSyncEvent(Request $request)
    {
        broadcast(new AskSync());
    }

    public function joinedEvent(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:25|min:2',
        ]);
        broadcast(new Joined($validatedData['name']))->toOthers();
        broadcast(new AskSync());
    }

    public function leftEvent(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:25|min:2',
        ]);
        broadcast(new Left($validatedData['name']))->toOthers();
    }

    public function timeUpEvent(Request $request)
    {
        broadcast(new TimeUp($request->next));
    }

    public function wordEvent(){
        $response = Http::get('http://random-word-api.herokuapp.com/word?number=1');
        broadcast(new Word($response->body()));
        return response()->json($response->body());
    }

    public function guessEvent(){
        broadcast(new Word($response->body()));
        return response()->json($response->body());
    }

}

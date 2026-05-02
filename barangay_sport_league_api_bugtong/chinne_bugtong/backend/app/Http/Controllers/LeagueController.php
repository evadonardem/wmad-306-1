<?php
namespace App\Http\Controllers;

use App\Models\League;
use Illuminate\Http\Request;

class LeagueController extends Controller
{
    public function index(Request $request)
    {
        return $this->successResponse(
            $request->user()->leagues()->with('seasons')->get(),
            'Leagues loaded'
        );
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'sport' => 'nullable|string|max:255',
            'description' => 'nullable|string',
        ]);
        $league = $request->user()->leagues()->create($data);
        return $this->successResponse($league->load('seasons'), 'League created', 201);
    }

    public function show(Request $request, League $league)
    {
        abort_unless($league->user_id === $request->user()->id, 403);
        $league->load('seasons');
        return $this->successResponse($league, 'League loaded');
    }

    public function update(Request $request, League $league)
    {
        abort_unless($league->user_id === $request->user()->id, 403);
        $league->update($request->validate([
            'name' => 'sometimes|required|string|max:255',
            'sport' => 'sometimes|nullable|string|max:255',
            'description' => 'sometimes|nullable|string',
        ]));
        return $this->successResponse($league->load('seasons'), 'League updated');
    }

    public function destroy(Request $request, League $league)
    {
        abort_unless($league->user_id === $request->user()->id, 403);
        $league->delete();
        return $this->successResponse(null, 'League deleted');
    }
}

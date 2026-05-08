<?php

namespace App\Http\Controllers;

use App\Models\Game;
use App\Models\League;
use App\Models\Season;
use App\Models\Team;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

abstract class Controller
{
    protected function success(string $message, mixed $data = null, int $status = 200): JsonResponse
    {
        $payload = ['message' => $message];

        if ($data !== null) {
            $payload['data'] = $data;
        }

        return response()->json($payload, $status);
    }

    protected function fail(string $message, int $status = 422, mixed $errors = null): JsonResponse
    {
        $payload = ['message' => $message];

        if ($errors !== null) {
            $payload['errors'] = $errors;
        }

        return response()->json($payload, $status);
    }

    protected function notFound(string $message): never
    {
        throw new HttpResponseException($this->fail($message, 404));
    }

    protected function leagueForUser(Request $request, int|string $leagueId): League
    {
        $league = $request->user()->leagues()->find($leagueId);

        if (! $league) {
            $this->notFound('League not found.');
        }

        return $league;
    }

    protected function seasonForUser(Request $request, int|string $seasonId): Season
    {
        $season = Season::query()
            ->whereKey($seasonId)
            ->whereHas('league', fn ($query) => $query->where('user_id', $request->user()->id))
            ->first();

        if (! $season) {
            $this->notFound('Season not found.');
        }

        return $season;
    }

    protected function teamForUser(Request $request, int|string $teamId): Team
    {
        $team = Team::query()
            ->whereKey($teamId)
            ->whereHas('season.league', fn ($query) => $query->where('user_id', $request->user()->id))
            ->first();

        if (! $team) {
            $this->notFound('Team not found.');
        }

        return $team;
    }

    protected function gameForUser(Request $request, int|string $gameId): Game
    {
        $game = Game::query()
            ->whereKey($gameId)
            ->whereHas('season.league', fn ($query) => $query->where('user_id', $request->user()->id))
            ->first();

        if (! $game) {
            $this->notFound('Game not found.');
        }

        return $game;
    }
}

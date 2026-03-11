<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\ArticleFavorite;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FavoriteController extends Controller
{
    public function toggle(Article $article)
    {
        $user = Auth::user();

        $existing = ArticleFavorite::where('user_id', $user->id)
            ->where('article_id', $article->id)
            ->first();

        if ($existing) {
            $existing->delete();
            return back()->with('success', 'Article removed from favorites');
        }

        ArticleFavorite::create([
            'user_id' => $user->id,
            'article_id' => $article->id,
        ]);

        return back()->with('success', 'Article added to favorites');
    }

    public function isFavorited(Article $article)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['favorited' => false]);
        }

        $favorited = ArticleFavorite::where('user_id', $user->id)
            ->where('article_id', $article->id)
            ->exists();

        return response()->json(['favorited' => $favorited]);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Support\Facades\Auth;

class ArticleController extends Controller
{
    public function destroy(Article $article)
    {
        $this->authorize('delete', $article);

        $article->delete();

        return redirect()->back()->with('success', 'Article deleted successfully');
    }
}

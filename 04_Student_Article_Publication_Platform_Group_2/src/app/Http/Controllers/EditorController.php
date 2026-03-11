<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\ArticleStatus;
use App\Models\Revision;
use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class EditorController extends Controller
{

    public function dashboard()
    {

        $pending = Article::whereHas('status', function ($q) {
            $q->where('name', 'submitted');
        })
        ->with(['writer','category','status'])
        ->latest()
        ->get();

        $needsRevision = Article::whereHas('status', function ($q) {
            $q->where('name', 'needs_revision');
        })
        ->with(['writer','category','status'])
        ->latest()
        ->get();

        // all published articles along with the editor who published them
        $published = Article::whereHas('status', function ($q) {
            $q->where('name', 'published');
        })
        ->with(['writer','editor','category','status'])
        ->latest()
        ->get();

        // debug: log how many published articles we're sending
        logger()->info('editor dashboard published count', ['count' => $published->count()]);


        /*
        -----------------------------------------
        Statistics
        -----------------------------------------
        */

        $stats = [

            'pending_reviews' => Article::whereHas('status', function ($q) {
                $q->where('name','submitted');
            })->count(),

            'needs_revision' => Article::whereHas('status', function ($q) {
                $q->where('name','needs_revision');
            })->count(),

            'published_articles' => Article::whereHas('status', function ($q) {
                $q->where('name','published');
            })->count(),

            'articles_reviewed' => Article::where('editor_id', Auth::id())->count(),

        ];


        /*
        -----------------------------------------
        Platform Activity Analytics
        -----------------------------------------
        */

        $months = [
            1=>'Jan',2=>'Feb',3=>'Mar',4=>'Apr',
            5=>'May',6=>'Jun',7=>'Jul',8=>'Aug',
            9=>'Sep',10=>'Oct',11=>'Nov',12=>'Dec'
        ];

        $month = DB::getDriverName() === 'sqlite'
            ? "strftime('%m', created_at)"
            : 'MONTH(created_at)';

        $submitted = Article::whereHas('status', fn($q)=>$q->where('name','submitted'))
            ->selectRaw("{$month} as month, COUNT(*) as total")
            ->groupBy('month')
            ->pluck('total','month');

        $publishedActivity = Article::whereHas('status', fn($q)=>$q->where('name','published'))
            ->selectRaw("{$month} as month, COUNT(*) as total")
            ->groupBy('month')
            ->pluck('total','month');

        $comments = Comment::selectRaw("{$month} as month, COUNT(*) as total")
            ->groupBy('month')
            ->pluck('total','month');

        $activity = collect($months)->map(function($name,$num) use ($submitted,$publishedActivity,$comments){

            return [
                'month'=>$name,
                'submitted'=>$submitted[$num] ?? 0,
                'published'=>$publishedActivity[$num] ?? 0,
                'comments'=>$comments[$num] ?? 0
            ];

        })->values();


        return Inertia::render('Editor/Dashboard', [
            'pending' => $pending,
            'needsRevision' => $needsRevision,
            'published' => $published,
            'stats' => $stats,
            'activity' => $activity
        ]);
    }


    public function review(Article $article)
    {
        $this->authorize('view', $article);

        return Inertia::render('Editor/Review', [
            'article' => $article->load(['writer','category','status','revisions'])
        ]);
    }


    public function requestRevision(Request $request, Article $article)
    {
        $this->authorize('requestRevision', $article);

        $data = $request->validate([
            'comments' => 'required|string'
        ]);

        $revision = Revision::create([
            'article_id' => $article->id,
            'editor_id' => Auth::id(),
            'comments' => $data['comments']
        ]);

        $status = ArticleStatus::firstOrCreate(
            ['name' => 'needs_revision'],
            ['label' => 'Needs Revision']
        );

        $article->update([
            'status_id' => $status->id
        ]);

        if ($article->writer) {
            $article->writer->notify(
                new \App\Notifications\RevisionRequestedNotification($revision)
            );
        }

        return redirect()->route('editor.dashboard');
    }


    public function publish(Article $article)
    {
        $this->authorize('publish', $article);

        $published = ArticleStatus::firstOrCreate(
            ['name' => 'published'],
            ['label' => 'Published']
        );

        $article->update([
            'status_id' => $published->id,
            'editor_id' => Auth::id()
        ]);

        if ($article->writer) {
            $article->writer->notify(
                new \App\Notifications\ArticlePublishedNotification($article)
            );
        }

        // Notify all students when a new article is published.
        $students = \App\Models\User::role('student')->get();
        foreach ($students as $student) {
            $student->notify(
                new \App\Notifications\NewArticlePublishedNotification($article)
            );
        }

        return redirect()->route('editor.dashboard');
    }
}

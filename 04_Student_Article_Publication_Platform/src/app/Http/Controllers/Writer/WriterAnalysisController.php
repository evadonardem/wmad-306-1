<?php

namespace App\Http\Controllers\Writer;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Category;
use App\Services\PlagiarismService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WriterAnalysisController extends Controller
{
    public function __construct(private readonly PlagiarismService $plagiarismService)
    {
    }

    private function normalizeText(string $html): string
    {
        $text = strip_tags($html);
        $text = html_entity_decode($text, ENT_QUOTES | ENT_HTML5);
        $text = preg_replace('/\s+/u', ' ', $text) ?? '';
        return trim($text);
    }

    /** @return array<string,int> */
    private function tokenCounts(string $text): array
    {
        $lower = mb_strtolower($text);
        $lower = preg_replace('/[^\p{L}\p{N}\s]+/u', ' ', $lower) ?? '';
        $parts = preg_split('/\s+/u', $lower, -1, PREG_SPLIT_NO_EMPTY) ?: [];

        $stop = array_flip([
            'the', 'a', 'an', 'and', 'or', 'but', 'to', 'of', 'in', 'on', 'for', 'with', 'at', 'by', 'from',
            'is', 'are', 'was', 'were', 'be', 'been', 'being', 'it', 'this', 'that', 'these', 'those',
            'as', 'not', 'can', 'could', 'should', 'would', 'will', 'just', 'we', 'you', 'they', 'he', 'she',
            'i', 'my', 'your', 'our', 'their',
        ]);

        $counts = [];
        foreach ($parts as $p) {
            if (isset($stop[$p])) {
                continue;
            }
            if (mb_strlen($p) < 3) {
                continue;
            }
            $counts[$p] = ($counts[$p] ?? 0) + 1;
        }

        arsort($counts);
        return $counts;
    }

    private function jaccardSimilarity(array $a, array $b): float
    {
        $a = array_unique($a);
        $b = array_unique($b);
        if (count($a) === 0 && count($b) === 0) {
            return 1.0;
        }
        if (count($a) === 0 || count($b) === 0) {
            return 0.0;
        }

        $setA = array_fill_keys($a, true);
        $intersection = 0;
        foreach ($b as $v) {
            if (isset($setA[$v])) {
                $intersection++;
            }
        }
        $union = count($a) + count($b) - $intersection;
        return $union > 0 ? ($intersection / $union) : 0.0;
    }

    /** @return string[] */
    private function shingles(string $text, int $size = 5, int $max = 1500): array
    {
        $lower = mb_strtolower($text);
        $lower = preg_replace('/[^\p{L}\p{N}\s]+/u', ' ', $lower) ?? '';
        $tokens = preg_split('/\s+/u', $lower, -1, PREG_SPLIT_NO_EMPTY) ?: [];
        $tokens = array_values(array_filter($tokens, fn ($t) => mb_strlen($t) >= 3));

        $out = [];
        $count = count($tokens);
        for ($i = 0; $i + $size <= $count; $i++) {
            $out[] = implode(' ', array_slice($tokens, $i, $size));
            if (count($out) >= $max) {
                break;
            }
        }

        return $out;
    }

    public function categorySuggestions(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['nullable', 'string', 'max:255'],
            'content' => ['nullable', 'string'],
        ]);

        $text = trim(($validated['title'] ?? '')." \n".$this->normalizeText($validated['content'] ?? ''));
        $tokens = $this->tokenCounts($text);

        $topTokens = array_slice(array_keys($tokens), 0, 40);
        $categories = Category::query()->get(['id', 'name']);

        // Pull a small sample of recent published articles for content-based scoring.
        $recentArticles = Article::query()
            ->whereNotNull('published_at')
            ->whereNotNull('category_id')
            ->latest('published_at')
            ->limit(120)
            ->get(['id', 'category_id', 'content']);

        $articlesByCategory = $recentArticles->groupBy('category_id');

        $scored = $categories->map(function (Category $category) use ($topTokens, $articlesByCategory) {
            $nameTokens = array_keys($this->tokenCounts($category->name));
            $nameScore = $this->jaccardSimilarity($topTokens, $nameTokens);

            $articleScore = 0.0;
            $bucket = $articlesByCategory->get($category->id, collect());
            if ($bucket->isNotEmpty()) {
                $scores = $bucket->take(12)->map(function ($article) use ($topTokens) {
                    $candidateText = $this->normalizeText($article->content ?? '');
                    $candidateTokens = array_slice(array_keys($this->tokenCounts($candidateText)), 0, 40);
                    return $this->jaccardSimilarity($topTokens, $candidateTokens);
                });
                $articleScore = (float) ($scores->average() ?? 0.0);
            }

            $score = max($nameScore, $articleScore);

            return [
                'id' => $category->id,
                'name' => $category->name,
                'score' => round($score, 4),
            ];
        })->sortByDesc('score')->values();

        return response()->json([
            'suggestions' => $scored->take(5)->values(),
        ]);
    }

    public function plagiarism(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'content' => ['required', 'string'],
            'exclude_article_id' => ['nullable', 'integer', 'exists:articles,id'],
        ]);

        $text = $this->plagiarismService->normalizeHtmlToText($validated['content']);
        $tokens = $this->plagiarismService->tokenize($text);

        // Too little text => meaningless plagiarism check.
        if (count($tokens) < 40) {
            return response()->json([
                'score' => 0,
                'label' => 'Not enough text',
                'checkedAgainstCount' => 0,
                'matches' => [],
            ]);
        }

        $targetShingles = $this->plagiarismService->shinglesFromTokens($tokens, size: 6, max: 2500);
        if (count($targetShingles) === 0) {
            return response()->json([
                'score' => 0,
                'label' => 'Not enough text',
                'checkedAgainstCount' => 0,
                'matches' => [],
            ]);
        }

        $excludeId = $validated['exclude_article_id'] ?? null;

        $candidatesQuery = Article::query()
            ->whereNotNull('published_at')
            ->latest('published_at');

        if ($excludeId !== null) {
            $candidatesQuery->where('id', '!=', $excludeId);
        }

        // Compare against a reasonable window for demo; adjust as needed.
        $candidates = $candidatesQuery
            ->limit(200)
            ->get(['id', 'title', 'content', 'published_at']);

        $checkedAgainstCount = $candidates->count();

        $matches = $candidates->map(function (Article $article) use ($targetShingles) {
            $candidateText = $this->plagiarismService->normalizeHtmlToText($article->content ?? '');
            $candidateTokens = $this->plagiarismService->tokenize($candidateText);
            $candidateShingles = $this->plagiarismService->shinglesFromTokens($candidateTokens, size: 6, max: 2500);
            $sim = $this->plagiarismService->similarity($targetShingles, $candidateShingles);

            // Use containment as primary ("how much of my text appears"), with jaccard as secondary.
            $score = max($sim['containment'], $sim['jaccard']);

            $overlap = $this->plagiarismService->overlapPhrases($targetShingles, $candidateShingles, limit: 5);
            $snippet = null;
            if (!empty($overlap)) {
                $snippet = $this->plagiarismService->snippetAroundPhrase($candidateText, $overlap[0]);
            }

            return [
                'article_id' => $article->id,
                'title' => $article->title,
                'published_at' => $article->published_at,
                'score' => round($score * 100, 2),
                'overlapPhrases' => $overlap,
                'snippet' => $snippet,
            ];
        })
            ->filter(fn ($m) => ($m['score'] ?? 0) > 0)
            ->sortByDesc('score')
            ->values();

        $top = $matches->take(5)->values();
        $topScore = $top->first()['score'] ?? 0;

        $label = 'Low similarity';
        if ($topScore >= 35) {
            $label = 'High similarity';
        } elseif ($topScore >= 20) {
            $label = 'Medium similarity';
        } elseif ($topScore <= 0) {
            $label = 'No similarity detected';
        }

        return response()->json([
            'score' => $topScore,
            'label' => $label,
            'checkedAgainstCount' => $checkedAgainstCount,
            'matches' => $top,
        ]);
    }
}

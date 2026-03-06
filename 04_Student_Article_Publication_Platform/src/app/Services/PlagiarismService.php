<?php

namespace App\Services;

class PlagiarismService
{
    public function normalizeHtmlToText(string $html): string
    {
        $normalized = (string) $html;
        $normalized = preg_replace('/<\s*br\s*\/?\s*>/i', "\n", $normalized) ?? $normalized;
        $normalized = preg_replace('/<\s*\/p\s*>/i', "\n", $normalized) ?? $normalized;
        $normalized = preg_replace('/<\s*\/div\s*>/i', "\n", $normalized) ?? $normalized;
        $normalized = preg_replace('/<\s*\/li\s*>/i', "\n", $normalized) ?? $normalized;

        $text = strip_tags($normalized);
        $text = html_entity_decode($text, ENT_QUOTES | ENT_HTML5);
        $text = str_replace("\r\n", "\n", $text);
        $text = preg_replace('/[ \t]+\n/u', "\n", $text) ?? '';
        $text = preg_replace('/\n{3,}/u', "\n\n", $text) ?? '';
        $text = preg_replace('/\s+/u', ' ', $text) ?? '';

        return trim($text);
    }

    /** @return string[] */
    public function tokenize(string $text): array
    {
        $lower = mb_strtolower($text);
        $lower = preg_replace('/[^\p{L}\p{N}\s]+/u', ' ', $lower) ?? '';
        $tokens = preg_split('/\s+/u', $lower, -1, PREG_SPLIT_NO_EMPTY) ?: [];
        $tokens = array_values(array_filter($tokens, fn ($t) => mb_strlen($t) >= 3));
        return $tokens;
    }

    /**
     * Build unique word-shingles (n-grams).
     *
     * @return string[]
     */
    public function shinglesFromTokens(array $tokens, int $size = 6, int $max = 2500): array
    {
        $out = [];
        $count = count($tokens);
        if ($count < $size) {
            return [];
        }

        for ($i = 0; $i + $size <= $count; $i++) {
            $out[] = implode(' ', array_slice($tokens, $i, $size));
            if (count($out) >= $max) {
                break;
            }
        }

        return array_values(array_unique($out));
    }

    /** @return array{jaccard: float, containment: float, overlapCount: int} */
    public function similarity(array $aShingles, array $bShingles): array
    {
        $a = array_values(array_unique($aShingles));
        $b = array_values(array_unique($bShingles));
        if (count($a) === 0 || count($b) === 0) {
            return ['jaccard' => 0.0, 'containment' => 0.0, 'overlapCount' => 0];
        }

        $setA = array_fill_keys($a, true);
        $overlap = 0;
        foreach ($b as $s) {
            if (isset($setA[$s])) {
                $overlap++;
            }
        }

        $union = count($a) + count($b) - $overlap;
        $jaccard = $union > 0 ? ($overlap / $union) : 0.0;

        // How much of the target appears in the candidate.
        $containment = count($a) > 0 ? ($overlap / count($a)) : 0.0;

        return ['jaccard' => $jaccard, 'containment' => $containment, 'overlapCount' => $overlap];
    }

    /**
     * Return up to N overlapping phrases (shingles) as evidence.
     *
     * @param string[] $targetShingles
     * @param string[] $candidateShingles
     * @return string[]
     */
    public function overlapPhrases(array $targetShingles, array $candidateShingles, int $limit = 5): array
    {
        $set = array_fill_keys($targetShingles, true);
        $out = [];
        foreach ($candidateShingles as $s) {
            if (isset($set[$s])) {
                $out[] = $s;
                if (count($out) >= $limit) {
                    break;
                }
            }
        }
        return array_values(array_unique($out));
    }

    public function snippetAroundPhrase(string $text, string $phrase, int $radius = 140): ?string
    {
        if ($phrase === '') {
            return null;
        }

        $lowerText = mb_strtolower($text);
        $lowerPhrase = mb_strtolower($phrase);

        $pos = mb_strpos($lowerText, $lowerPhrase);
        if ($pos === false) {
            return null;
        }

        $start = max(0, $pos - $radius);
        $len = min(mb_strlen($text) - $start, mb_strlen($phrase) + $radius * 2);
        $slice = mb_substr($text, $start, $len);

        $prefix = $start > 0 ? '…' : '';
        $suffix = ($start + $len) < mb_strlen($text) ? '…' : '';

        return $prefix.trim($slice).$suffix;
    }
}

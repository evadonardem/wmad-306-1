Hello {{ $authorName }},

Your article has been picked up for review.

Title: {{ $article->title }}
Editor: {{ $editorName }}
Claimed at: {{ optional($article->claimed_at)->toDateTimeString() ?: now()->toDateTimeString() }}

Please wait for the editorial decision. You will receive another update once review is complete.

Regards,
FYI Editorial Team

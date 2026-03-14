Hello {{ $authorName }},

Your article has completed editorial review.

Title: {{ $article->title }}

@if ($outcome === 'rejected')
Outcome: Rejected
@elseif ($outcome === 'revision_requested')
Outcome: Returned for Revision
@else
Outcome: Published
@endif

@if (!empty($note))
Editor note:
{{ $note }}
@endif

Please check your dashboard for the latest status.

Regards,
FYI Editorial Team

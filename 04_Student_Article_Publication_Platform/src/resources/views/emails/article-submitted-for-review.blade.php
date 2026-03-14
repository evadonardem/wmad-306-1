@if ($isResubmission)
An article has been resubmitted for review.
@else
A new article has been submitted for editorial review.
@endif

Title: {{ $article->title }}
Author: {{ $authorName }}
Submitted at: {{ optional($article->submitted_at)->toDateTimeString() }}

Please open the Editor Review Queue to claim it.

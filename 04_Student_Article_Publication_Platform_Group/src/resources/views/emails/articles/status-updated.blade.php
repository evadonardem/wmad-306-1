<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Article Status Updated</title>
</head>
<body>
    <p>Hello {{ $article->user->name }},</p>
    <p>The status of your article, "{{ $article->title }}", has been updated to: <strong>{{ $article->status }}</strong>.</p>
    @if ($article->status === 'published')
        <p>Congratulations! Your article is now live.</p>
    @elseif ($article->status === 'rejected')
        <p>We appreciate your submission. Please review any feedback from the admin team.</p>
    @endif
    <p>Thank you,</p>
    <p>The Publication Team</p>
</body>
</html>

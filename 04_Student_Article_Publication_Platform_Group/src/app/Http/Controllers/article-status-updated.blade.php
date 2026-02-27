<!DOCTYPE html>
<html>
<head>
    <title>Article Status Updated</title>
</head>
<body>
    <h1>Hello, {{ $article->user->name }}!</h1>
    <p>The status of your article, "{{ $article->title }}", has been updated.</p>
    <p><strong>New Status:</strong> {{ ucfirst(str_replace('_', ' ', $article->status)) }}</p>

    @if ($article->status === 'published')
        <p>Congratulations! Your article is now live.</p>
    @endif

    <p>Thank you for your submission!</p>
</body>
</html>

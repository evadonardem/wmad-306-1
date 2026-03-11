<?php

namespace App\Notifications;

use App\Models\Article;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewArticlePublishedNotification extends Notification
{
    use Queueable;

    protected $article;

    public function __construct(Article $article)
    {
        $this->article = $article;
    }

    public function via($notifiable)
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('New Article Published')
            ->line('A new article has been published on the platform.')
            ->line('Title: ' . $this->article->title)
            ->action('Read Article', route('articles.show', $this->article->id));
    }

    public function toDatabase($notifiable)
    {
        return [
            'type' => 'article_published_broadcast',
            'article_id' => $this->article->id,
            'title' => $this->article->title,
            'message' => 'New article published: ' . $this->article->title,
            'url' => route('articles.show', $this->article->id),
        ];
    }
}

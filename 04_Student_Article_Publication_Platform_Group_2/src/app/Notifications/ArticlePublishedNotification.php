<?php

namespace App\Notifications;

use App\Models\Article;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ArticlePublishedNotification extends Notification
{
    use Queueable;

    protected $article;

    public function __construct(Article $article)
    {
        $this->article = $article;
    }

    /**
     * Determine which channels the notification will be delivered on.
     */
    public function via($notifiable)
    {
        return ['mail', 'database'];
    }

    /**
     * Email notification
     */
    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Your Article Has Been Published')
            ->greeting('Hello ' . $notifiable->name . ',')
            ->line('Great news! Your article has been successfully published.')
            ->line('Article Title: ' . $this->article->title)
            ->action('Read Article', route('articles.show', $this->article->id))
            ->line('Thank you for contributing to PublishHub!');
    }

    /**
     * Database notification (used for notification bell)
     */
    public function toDatabase($notifiable)
    {
        return [
            'type' => 'article_published',
            'article_id' => $this->article->id,
            'title' => $this->article->title,
            'message' => 'Your article "' . $this->article->title . '" has been published.',
            'url' => route('articles.show', $this->article->id)
        ];
    }
}
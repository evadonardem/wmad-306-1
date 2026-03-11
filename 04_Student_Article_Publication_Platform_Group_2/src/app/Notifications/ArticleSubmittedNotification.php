<?php

namespace App\Notifications;

use App\Models\Article;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ArticleSubmittedNotification extends Notification
{
    use Queueable;

    protected $article;

    public function __construct(Article $article)
    {
        $this->article = $article;
    }

    public function via($notifiable)
    {
        return ['mail','database'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Article Submitted For Review')
            ->line('A new article has been submitted.')
            ->line('Title: '.$this->article->title)
            ->action('Review Article', route('editor.articles.review', $this->article->id));
    }

    public function toDatabase($notifiable)
    {
        return [
            'type' => 'article_submitted',
            'message' => 'New article submitted: '.$this->article->title,
            'url' => route('editor.articles.review', $this->article->id)
        ];
    }
}

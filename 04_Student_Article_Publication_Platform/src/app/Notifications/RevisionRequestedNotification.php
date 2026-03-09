<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class RevisionRequestedNotification extends Notification
{
    use Queueable;
    public $article;
    public $comments;

    public function __construct($article, $comments)
    {
        $this->article = $article;
        $this->comments = $comments;
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
                    ->subject('Revision Requested: ' . $this->article->title)
                    ->greeting('Hello ' . $this->article->writer->name . ',')
                    ->line('The editor has requested revisions for your article.')
                    ->line('Editor Comments: "' . $this->comments . '"')
                    ->action('View Article Queue', url('/dashboard'))
                    ->line('Please update your draft and resubmit.');
    }
}

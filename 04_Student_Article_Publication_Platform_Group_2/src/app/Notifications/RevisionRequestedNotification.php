<?php

namespace App\Notifications;

use App\Models\Revision;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class RevisionRequestedNotification extends Notification
{
    use Queueable;

    protected $revision;

    public function __construct(Revision $revision)
    {
        $this->revision = $revision;
    }

    public function via($notifiable)
    {
        return ['mail','database'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Revision Requested')
            ->line('A revision has been requested for your article: '.$this->revision->article->title)
            ->line('Editor Feedback:')
            ->line($this->revision->comments ?? 'No comments provided.')
            ->action('Edit Article', route('articles.edit', $this->revision->article->id));
    }

    public function toDatabase($notifiable)
    {
        return [
            'type' => 'revision_requested',
            'message' => 'Revision requested for: '.$this->revision->article->title,
            'url' => route('articles.edit', $this->revision->article->id)
        ];
    }
}

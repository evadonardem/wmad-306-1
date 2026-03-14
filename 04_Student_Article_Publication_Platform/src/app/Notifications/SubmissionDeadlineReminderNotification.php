<?php

namespace App\Notifications;

use App\Models\SubmissionDeadline;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SubmissionDeadlineReminderNotification extends Notification
{
    use Queueable;

    public function __construct(private readonly SubmissionDeadline $deadline)
    {
    }

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $due = $this->deadline->due_at?->toDayDateTimeString() ?? 'Unknown';

        return (new MailMessage())
            ->subject('Submission deadline reminder')
            ->line('You have an upcoming submission deadline.')
            ->line('Deadline: '.$this->deadline->title)
            ->line('Due at: '.$due);
    }

    public function toArray(object $notifiable): array
    {
        return [
            'deadline_id' => $this->deadline->id,
            'title' => $this->deadline->title,
            'due_at' => $this->deadline->due_at,
            'category_id' => $this->deadline->category_id,
            'message' => 'Upcoming submission deadline reminder.',
        ];
    }
}

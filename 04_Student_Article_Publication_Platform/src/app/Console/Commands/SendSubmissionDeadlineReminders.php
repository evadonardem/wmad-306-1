<?php

namespace App\Console\Commands;

use App\Models\SubmissionDeadline;
use App\Models\User;
use App\Notifications\SubmissionDeadlineReminderNotification;
use Illuminate\Console\Command;

class SendSubmissionDeadlineReminders extends Command
{
    protected $signature = 'deadlines:send-reminders {--hours=72 : Notify for deadlines within the next N hours}';

    protected $description = 'Send upcoming submission deadline reminders to writers (email + in-app notifications).';

    public function handle(): int
    {
        $hours = (int) $this->option('hours');
        $windowEnd = now()->addHours(max($hours, 1));

        $deadlines = SubmissionDeadline::query()
            ->where('active', true)
            ->whereBetween('due_at', [now(), $windowEnd])
            ->orderBy('due_at')
            ->get();

        if ($deadlines->isEmpty()) {
            $this->info('No upcoming deadlines in window.');
            return self::SUCCESS;
        }

        $writers = User::query()->role('writer')->get();
        $sent = 0;

        foreach ($writers as $writer) {
            foreach ($deadlines as $deadline) {
                $alreadyNotified = $writer->notifications()
                    ->where('type', SubmissionDeadlineReminderNotification::class)
                    ->where('data->deadline_id', $deadline->id)
                    ->exists();

                if ($alreadyNotified) {
                    continue;
                }

                $writer->notify(new SubmissionDeadlineReminderNotification($deadline));
                $sent++;
            }
        }

        $this->info("Sent {$sent} reminder notification(s).");

        return self::SUCCESS;
    }
}

<?php

namespace App\Services;

use App\Mail\ArticleClaimedForReviewMail;
use App\Mail\ArticleSubmittedForReviewMail;
use App\Mail\EditorialOutcomeMail;
use App\Mail\WriterApplicationDecisionMail;
use App\Mail\WriterApplicationSubmittedMail;
use App\Models\Article;
use App\Models\User;
use App\Models\WriterApplication;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Throwable;

class EditorialMailService
{
    public function sendWriterApplicationSubmitted(WriterApplication $application): void
    {
        $emails = $this->adminRecipientEmails();

        if ($emails->isEmpty()) {
            return;
        }

        $this->safeSend(
            fn () => Mail::to($emails->all())->send(new WriterApplicationSubmittedMail($application->loadMissing('applicant:id,name,email'))),
            'writer_application_submitted',
            ['writer_application_id' => $application->id]
        );
    }

    public function sendWriterApplicationDecision(WriterApplication $application, bool $accepted): void
    {
        $recipient = $application->applicant?->email;
        if (!$recipient) {
            return;
        }

        $this->safeSend(
            fn () => Mail::to($recipient)->send(new WriterApplicationDecisionMail($application->loadMissing('applicant:id,name,email'), $accepted)),
            'writer_application_decision',
            [
                'writer_application_id' => $application->id,
                'accepted' => $accepted,
                'recipient' => $recipient,
            ]
        );
    }

    public function sendArticleSubmittedToEditors(Article $article, bool $isResubmission = false): void
    {
        $emails = $this->editorRecipientEmails();

        if ($emails->isEmpty()) {
            return;
        }

        $this->safeSend(
            fn () => Mail::to($emails->all())->send(new ArticleSubmittedForReviewMail($article->loadMissing('author:id,name,email'), $isResubmission)),
            'article_submitted_for_review',
            ['article_id' => $article->id, 'resubmission' => $isResubmission]
        );
    }

    public function sendArticleClaimedToAuthor(Article $article, User $editor): void
    {
        $recipient = $article->author?->email;
        if (!$recipient) {
            return;
        }

        $this->safeSend(
            fn () => Mail::to($recipient)->send(new ArticleClaimedForReviewMail($article->loadMissing('author:id,name,email'), $editor)),
            'article_claimed_for_review',
            ['article_id' => $article->id, 'editor_id' => $editor->id, 'recipient' => $recipient]
        );
    }

    public function sendEditorialOutcomeToAuthor(Article $article, string $outcome, ?string $note = null): void
    {
        $recipient = $article->author?->email;
        if (!$recipient) {
            return;
        }

        $this->safeSend(
            fn () => Mail::to($recipient)->send(new EditorialOutcomeMail($article->loadMissing('author:id,name,email'), $outcome, $note)),
            'editorial_outcome',
            ['article_id' => $article->id, 'outcome' => $outcome, 'recipient' => $recipient]
        );
    }

    private function adminRecipientEmails(): Collection
    {
        $emails = User::query()
            ->role('admin')
            ->whereNotNull('email_verified_at')
            ->pluck('email')
            ->filter()
            ->unique()
            ->values();

        $fallback = config('mail.admin_address');
        if ($fallback && !$emails->contains($fallback)) {
            $emails->push($fallback);
        }

        return $emails->unique()->values();
    }

    private function editorRecipientEmails(): Collection
    {
        return User::query()
            ->role('editor')
            ->whereNotNull('email_verified_at')
            ->pluck('email')
            ->filter()
            ->unique()
            ->values();
    }

    private function safeSend(callable $callback, string $mailType, array $context = []): void
    {
        try {
            $callback();
        } catch (Throwable $exception) {
            Log::warning('Mail send failed; continuing workflow.', array_merge($context, [
                'mail_type' => $mailType,
                'error' => $exception->getMessage(),
            ]));
        }
    }
}

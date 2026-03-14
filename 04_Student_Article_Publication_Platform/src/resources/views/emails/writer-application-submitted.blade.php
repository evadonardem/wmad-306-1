New writer application received.

Applicant: {{ $applicantName }}
Email: {{ $applicantEmail }}
Submitted at: {{ optional($application->created_at)->toDateTimeString() }}

Why they want to become a writer:
{{ $application->motivation }}

Writing experience:
{{ $application->experience ?: 'Not provided.' }}

Topics they want to write about:
{{ $application->topics ?: 'Not provided.' }}

Please review this in the Admin panel under Writer Applications.

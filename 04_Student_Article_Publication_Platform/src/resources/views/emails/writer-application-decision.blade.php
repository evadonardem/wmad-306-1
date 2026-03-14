Hello {{ $applicantName }},

Your application to become a Writer has been reviewed.

@if ($accepted)
Status: ACCEPTED

Congratulations. You can now access Writer features in your account.
@else
Status: REJECTED

Thank you for applying. At this time, your application was not approved.
You may apply again after improving your writing portfolio and motivation statement.
@endif

Regards,
FYI Editorial Team

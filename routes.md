Auth Routes (guests)
Method URL Purpose
GET http://localhost:8000/register Registration form (choose role)
GET http://localhost:8000/login Login form
GET http://localhost:8000/forgot-password Request password reset
GET http://localhost:8000/reset-password/{token} Reset password form

Writer Routes (requires login + writer role)
Method URL Route Name Purpose
GET http://localhost:8000/writer/dashboard writer.dashboard View all my articles
GET http://localhost:8000/writer/articles/create articles.create New article form
POST http://localhost:8000/writer/articles articles.store Save draft
GET http://localhost:8000/writer/articles/{id}/edit articles.edit Edit article form
PATCH http://localhost:8000/writer/articles/{id} articles.update Save edits
POST http://localhost:8000/writer/articles/{id}/submit articles.submit Submit for review
DELETE http://localhost:8000/writer/articles/{id} articles.destroy Delete draft

Editor Routes (requires login + editor role)
Method URL Route Name Purpose
GET http://localhost:8000/editor/dashboard editor.dashboard View pending + published articles
GET http://localhost:8000/editor/articles/{id}/review editor.review Open article review page
POST http://localhost:8000/editor/articles/{id}/revision articles.revision Request revision with feedback
POST http://localhost:8000/editor/articles/{id}/publish articles.publish Publish article

Student Routes (requires login + student role)
Method URL Route Name Purpose
GET http://localhost:8000/student/dashboard student.dashboard Browse published articles
GET http://localhost:8000/student/articles/{id} student.show Read article + comments
POST http://localhost:8000/student/articles/{id}/comment articles.comment Post a comment
DELETE http://localhost:8000/student/comments/{id} student.delete-comment Delete own comment

Admin Routes (requires login + admin role)
Method URL Route Name Purpose
GET http://localhost:8000/admin/dashboard admin.dashboard View pending + approved accounts
POST http://localhost:8000/admin/users/{id}/approve admin.approve Approve a pending account
DELETE http://localhost:8000/admin/users/{id}/reject admin.reject Reject and delete a pending account

Note: Writers and Editors require admin approval after registration. Students are auto-approved.

Bonus / Dev URLs
URL Purpose
http://localhost:8000/dashboard Auto-redirects to the correct role dashboard after login
http://localhost:8000/telescope Laravel Telescope (debug dashboard)
http://localhost:8000/sample/email Test Mailtrap email config
http://localhost:8000/sample/jodit-editor Preview Jodit editor
http://localhost:8025 Mailtrap web UI — view all sent emails
Seeded Test Accounts (all password: password)
Email Role
admin@example.com Admin
writer@example.com Writer
editor@example.com Editor
student@example.com Student
After logging in, visiting http://localhost:8000/dashboard automatically redirects each user to their role-specific dashboard.

Guarantees one user per role:

| Email               | Name        | Role    | Password |
| ------------------- | ----------- | ------- | -------- |
| admin@example.com   | Admin User  | admin   | password |
| writer@example.com  | John Writer | writer  | password |
| editor@example.com  | Jane Editor | editor  | password |
| student@example.com | Bob Student | student | password |

Email Testing with Mailpit

1. Visit http://localhost:8025
2. All emails sent during development are captured here
3. Perfect for testing email notifications without external SMTP

## Debugging with Telescope

1. Visit http://localhost:8000/telescope
2. View all requests, queries, cache, mail, and exceptions
3. Essential for development debugging

## Production Deployment Notes

For production with real Mailtrap:
1. Update `src/.env` with actual Mailtrap credentials
2. Set `APP_ENV=production`
3. Set `TELESCOPE_ENABLED=false`
4. Use proper MySQL credentials
5. Configure backups for data volume



### Sample Routes
- ✅ GET `/sample/email` → SampleController@testEmail
- ✅ GET `/sample/jodit-editor` → SampleController@testJoditEditor
- ✅ GET `/sample/assigning-roles` → SampleController@assigningRoles
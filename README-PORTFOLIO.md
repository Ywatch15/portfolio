Portfolio dev notes

- Admin login: visit /admin/login. Seed admin via `npm run seed:admin` in server; copy username/password printed.
- Resume download: place `server/public/resume.pdf`. Frontend CTA hits /api/resume/download and counts metrics.
- Analytics: lightweight visit ping on mount via useAnalytics hook.


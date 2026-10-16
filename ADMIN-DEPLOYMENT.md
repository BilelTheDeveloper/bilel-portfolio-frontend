# Administrator interface deployment

The login is `/admin`; the old gate flow has been removed. The frontend and backend must be upgraded together.

Vercel Production configuration:

- `VITE_API_URL=/api`
- `VITE_SITE_URL=https://www.bilelthedev.website`
- Deploy the included `vercel.json`: `/api/:path*` forwards to `https://bilel-portfolio-backend-0zny.onrender.com/api/:path*` before the SPA rewrite. Do not leave the old absolute Render URL in VITE_API_URL, because production session cookies are intentionally SameSite=Lax.

Backend configuration requires a private `MFA_ENCRYPTION_KEY`, an approved owner account, and the correct ALLOWED_ORIGINS. See `ADMIN-SECURITY.md` in the backend repository for the full migration, initial enrollment, and recovery procedures. No production account changes have been made automatically.

First sign-in: email/password → Google Authenticator enrollment → prove a current six-digit code → save the one-use recovery codes → workspace. Returning sign-in uses email/password → authenticator (or saved recovery code). No email delivery service is required for authentication.

The Security & Access panel supports owner account approval/disable/reapproval, session revocation, recovery-code replacement, password changes, and recent security activity. Sensitive changes require a fresh authenticator code.

Client verification: `npm run lint` and `npm run build`.

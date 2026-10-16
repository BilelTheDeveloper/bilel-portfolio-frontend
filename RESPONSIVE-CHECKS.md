# Responsive verification — 2026-10-16

## Coverage

Browser viewport emulation against the local portfolio with a disposable, populated MongoDB preview. No production database or portfolio content was changed.

- Public pages: home, project gallery, populated project details, reviews, administrator sign-in.
- Admin pages: overview, project library, new project editor, reviews, inquiries, security and access, Explore tools.
- Public matrix: 320, 390, 768, 1024 and 1440 px widths (25 combinations).
- Admin matrix: 320, 390, 768, 1024, 1280 and 1440 px widths (42 combinations).
- Edge matrix: 360×800, 640×360, 844×390, 1920×1080 and 2560×1440 across four public pages and overview/editor/security (35 combinations).
- Additional visual checks: contact, review, service and résumé dialogs at 320 px; contact dialog in landscape; authenticator enrollment; populated project editing; mobile workspace menu and project-not-found state.

All 102 matrix combinations had no measured horizontal overflow of page text or form controls. The gallery marquee is intentionally clipped within its own strip. Desktop sidebar and mobile menu behavior were inspected separately. Checks use Chromium viewport emulation; they are not a certification of every physical device or browser engine.

## Changes

- Flexible grid/flex children and wrapping for long titles, technologies, URLs, emails and messages.
- Project details: smaller phone typography and padding, contained image badges, desktop-only sticky feature column, and no fading/scaling of the entire hero while scrolling on smaller screens.
- Public navigation switches to the mobile arrangement below 1024 px, with safe-area space reserved for the bottom bar and a scrollable dropdown in landscape.
- Homepage portrait and floating cards fit phones; hero columns begin at desktop widths.
- Project gallery featured cards stack their text and actions; latest-work cards use two columns on tablets.
- Review headers, dialog headings and modal spacing adapt to small screens.
- Résumé avatar/name stack on phones and summary statistics stay readable.
- Admin editor stacks before its sidebar leaves too little space; filenames and account details wrap. Mobile sections use an expandable grid menu.
- Form text is at least 16 px on small screens to avoid automatic input zoom on iOS. Close buttons and primary admin controls have 44 px minimum targets.

## Checks

- `npm run lint`: passed.
- `npm run build`: passed.
- `git diff --check`: passed.
- Preview fixture script syntax: passed.
- No console errors observed in the final browser check.

## Reproduce with sample data

In the server terminal, set `NODE_ENV=test` and `PREVIEW_PORT=5090`, then run `node scripts/preview-admin.js`.
In the client terminal, set `VITE_API_URL=/api` and `PORTFOLIO_API_PROXY=http://127.0.0.1:5090`, then run `npm run dev -- --host 127.0.0.1 --port 5190 --strictPort`.
The sample project is `/project/111111111111111111111111`. Fixture credentials belong only to the disposable preview and are printed by its startup script. The proxy override only affects local Vite development.

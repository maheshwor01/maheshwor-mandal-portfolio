# Maheshwor Mandal — Portfolio

Single-page portfolio of **Maheshwor Mandal**, a BSc IT student and aspiring AI/ML engineer. Built with React and Vite, styled with a custom CSS design system, and deployed on Cloudflare Pages.

## Features

- **Hero** — intro, resume download, and quick links to GitHub
- **About** — background, education, and focus areas
- **Skills** — categorized skill list with tabbed navigation
- **Projects** — showcased project work
- **Experience** — static timeline of roles and academic work (data lives in React)
- **Contact** — form that emails submissions to Gmail via Resend
- **Scroll spy navigation** — the navbar highlights the section currently in view

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Contact Form (Gmail)

Set `RESEND_API_KEY` in `.env` (see `.env.example`). In production, add it in Cloudflare Pages environment variables. Emails go to `345mandalmahesh@gmail.com` with the visitor address as Reply-To.

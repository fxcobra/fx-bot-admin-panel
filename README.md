# Fx Admin Panel (Next.js)

This is the modern admin panel for your WhatsApp/MongoDB bot, built with Next.js and designed to be deployed on Vercel.

## Features
- Admin authentication (JWT)
- Dashboard with stats and analytics
- Orders management (CRUD, search, filter, export, bulk)
- Services management (CRUD)
- Service form
- Chat interface
- Settings (currencies, SMS, quick replies)
- User management (add/remove admins)
- Activity logs
- Real-time notifications
- Mobile-friendly, modern UI/UX

## Structure
- `/pages` — Main app pages (login, dashboard, orders, services, etc.)
- `/components` — Reusable React components
- `/utils` — API helpers, JWT, etc.
- `/hooks` — Custom React hooks
- `/styles` — CSS/SCSS or Tailwind config

## Setup
1. Install dependencies: `npm install`
2. Set environment variables in `.env.local`
3. Run locally: `npm run dev`
4. Deploy to Vercel

---

This project will be fully API-driven and connect to your backend at Bot-Hosting.net.

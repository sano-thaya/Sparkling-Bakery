# Sparkling Bakery Web Application

A full-stack web application for a custom cake bakery, built with Next.js (App Router), PostgreSQL, Prisma, NextAuth.js, Stripe, Cloudinary, and Resend.

## Tech Stack
- **Framework:** Next.js (App Router)
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** NextAuth.js
- **Payments:** Stripe Checkout
- **Image Hosting:** Cloudinary
- **Emails:** Resend
- **Styling:** Vanilla CSS Modules

## Setup Instructions

### 1. Environment Variables
Copy `.env.example` to `.env` and fill in the required values:
```bash
cp .env.example .env
```
*Note: Ensure `DATABASE_URL` points to your PostgreSQL instance. For NextAuth, generate a secret with `openssl rand -base64 32` and set `NEXTAUTH_SECRET`.*

### 2. Install Dependencies
```bash
npm install
```

### 3. Database Setup (Prisma)
Initialize your database schema:
```bash
npx prisma db push
```

### 4. Seed Data
Seed the database with an admin user and a sample gallery post:
```bash
npx prisma db seed
```
*(Ensure you have `ts-node` installed globally or use `npx ts-node prisma/seed.ts` if `db seed` is not configured in package.json. For this project, you can run `npx ts-node prisma/seed.ts` directly).*

### 5. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage Guide
- **Public:** Customers can view the gallery, place custom cake orders (which redirects to a Stripe Checkout Session), and submit enquiries via the contact form.
- **Admin:** Navigate to `/login` to sign in. The default seeded admin is `admin@sparklingbakery.com` with password `admin123`.
  - **Dashboard:** View overall statistics and pending/cancelled orders.
  - **Orders:** Manage and update the status of customer orders.
  - **Posts:** Upload new posts to the gallery using Cloudinary image URLs.
  - **Enquiries:** View and mark customer enquiries as responded.

## Vercel Cron Setup
A daily cron job is configured at `/api/cron/daily-reminders`. In your Vercel project settings, configure `vercel.json` with your desired schedule to automatically hit this endpoint and dispatch the daily reminder emails to the admin.
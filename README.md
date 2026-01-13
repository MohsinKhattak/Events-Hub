# Event Hub

A full-stack event management application for creating, viewing, and managing events with venue information. Built as a portfolio project showcasing modern web development practices.

## Tech Stack

- Next.js 15+ (App Router)
- TypeScript
- Supabase (Database & Auth)
- Tailwind CSS
- shadcn/ui
- React Hook Form + Zod

## Features

- Email/Password and Google OAuth authentication
- Create, edit, and delete events
- Multiple venues per event
- Search by name, filter by event type
- Responsive design with dark mode support
- Full-stack TypeScript implementation

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Get these from your Supabase project: **Settings** → **API**


### 5. Run

```bash
npm run dev
```


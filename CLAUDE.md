# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Juvenal CRM is a complete CRM system for therapy/coaching clinics. Built with React 18 + TypeScript + Supabase.

## Development Commands

- `npm run dev` - Start development server (http://localhost:5173)
- `npm run build` - Build for production (TypeScript check + Vite build)
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## Tech Stack

- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router v6
- **State:** Zustand
- **Backend:** Supabase (PostgreSQL + Auth + Storage + Real-time)
- **Validation:** Zod
- **Icons:** Heroicons

## Architecture

### Folder Structure

- `src/components/ui/` - Reusable base components (Button, Input, Card, etc)
- `src/components/layout/` - Layout components (Sidebar, Header)
- `src/pages/` - Page components
- `src/hooks/` - Custom React hooks (useAuth, etc)
- `src/lib/` - Third-party library configurations (Supabase client)
- `src/services/` - API services (auth, clients, appointments, finance)
- `src/types/` - TypeScript type definitions (database types generated from Supabase)
- `supabase/migrations/` - SQL migration files

### Key Files

- `src/lib/supabase.ts` - Supabase client configuration
- `src/hooks/useAuth.ts` - Authentication hook with session management
- `src/types/database.types.ts` - Auto-generated types from Supabase schema
- `src/App.tsx` - Main app with routing and authentication flow
- `.env.local` - Environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)

### Authentication Flow

- Uses Supabase Auth with email/password
- `useAuth` hook provides user session across the app
- Protected routes in App.tsx redirect unauthenticated users to login
- Auth service in `src/services/auth.ts` handles all auth operations

### Database Schema

All tables use Row Level Security (RLS) - users can only access their own data.

Main tables:
- `clients` - Client information
- `appointments` - Session scheduling
- `transactions` - Financial records
- `session_packages` - Package templates
- `client_session_packages` - Purchased packages
- `working_hours` - Practitioner availability
- `user_settings` - User preferences

See `supabase/migrations/` for complete schema.

### Supabase Integration

- Client initialized in `src/lib/supabase.ts`
- All services use typed Supabase client with Database generic
- RLS policies ensure data isolation per user
- Trigger automatically creates default settings for new users

## Path Aliases

`@/` maps to `src/` directory (configured in tsconfig.json and vite.config.ts)

## Styling Patterns

- Tailwind utility classes for all styling
- Primary color: green-600 (#16a34a)
- Custom primary color scale defined in tailwind.config.js
- Component variants handled via className props
- Responsive: mobile-first approach

## Project Status

**Phase 1 (COMPLETED):**
- ✅ Project setup with React + Vite + TypeScript + Tailwind
- ✅ Supabase configuration and migrations
- ✅ Authentication system (login, register, forgot password)
- ✅ Base layout (Sidebar, Header)
- ✅ Base UI components (Button, Input, Card, Textarea)
- ✅ Protected routes structure

**Next Phases:**
- Phase 2: Complete authentication module
- Phase 3: Clients module (CRUD)
- Phase 4: Appointments module (Calendar)
- Phase 5: Finance module (Dashboard, transactions)
- Phase 6: Refinements and mobile responsivity

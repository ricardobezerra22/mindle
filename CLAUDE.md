# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm run dev          # Start development server (localhost:3000)
pnpm run build        # prisma generate + nuxt build
pnpm run lint         # ESLint check
pnpm run lint:fix     # ESLint auto-fix
pnpm run typecheck    # TypeScript check
npx prisma db push    # Push schema changes to MongoDB (no migrations)
npx prisma studio     # GUI for the database
```

`pnpm install` triggers `prisma generate && nuxt prepare` automatically via `postinstall`.

## Architecture

Full-stack Nuxt 4 app (Vue 3 Composition API + TypeScript). MongoDB via Prisma ORM. JWT auth with Google OAuth overlay.

```
app/
├── components/ui/        # Reusable base components (UiButton, UiCard, etc.)
├── components/layout/    # LayoutHeader, LayoutSidebar
├── components/{feature}/ # tasks/, habits/, focus/, planner/, goals/, projects/
├── composables/          # Feature logic with API calls (useTasks, useAuth, etc.)
├── stores/               # Pinia stores — minimal, prefer composables
├── types/index.ts        # ALL shared TypeScript interfaces and enums
├── layouts/              # default, auth, focus, minimal
├── middleware/auth.global.ts  # Route guard
└── pages/                # File-based routing

server/
├── api/{resource}/       # REST routes: index.get.ts, [id].put.ts, etc.
├── middleware/auth.ts    # Injects userId into event.context
├── utils/prisma.ts       # Prisma client singleton
├── utils/response.ts     # sendSuccess / sendError helpers
└── services/             # goalService, dashboardService, emailService
```

## Key Patterns

### API Response Contract

Every server route must use the helpers from `server/utils/response.ts`:

```ts
return sendSuccess(event, data);       // { success: true, data }
return sendError(event, message, 400); // { success: false, error }
```

Client composables expect `APIResponse<T>` — always use `$fetch` (Nuxt auto-import).

### Auth in Server Routes

`server/middleware/auth.ts` injects the authenticated user's ID. Access it as:

```ts
const userId = event.context.userId;
```

Public routes must be excluded from the middleware (currently: `/api/auth/**`, `/api/webhooks/**`).

### Composable Pattern

Follow `useTasks` as the reference implementation: `useState` for SSR-safe shared state, optimistic updates (save → apply locally → call API → merge or rollback), return `{ state, loading, error, fetch, create, update, delete }`.

### New Feature Checklist

1. Types → `app/types/index.ts`
2. Composable → `app/composables/useFeature.ts`
3. API routes → `server/api/{resource}/`
4. Components → `app/components/{feature}/`
5. Page → `app/pages/` with `definePageMeta({ layout: 'default' })`
6. Add nav link to `app/components/layout/Sidebar.vue`
7. Add title mapping to `app/layouts/default.vue`

## Nuxt Auto-Imports

Do NOT manually import: `ref`, `computed`, `watch`, `onMounted`, `useState`, `useRoute`, `navigateTo`, `definePageMeta`, `useToast`, `$fetch`, `Icon`, `defineStore`.

Component naming follows Nuxt convention: `components/ui/Button.vue` → `<UiButton>`.

## Design System

CSS custom properties defined in `app/assets/css/main.css`. Always use them — never hardcode colors/spacing/radius. Exception: status-specific colors (priority badges, success/danger/warning) can be hardcoded.

Primary: `#6faf8e` · Background: `#f7faf9` · Surface: `#ffffff` · Text: `#1f2d2b`

Spacing scale: `--spacing-xs` (4px) through `--spacing-xl` (32px).

Standard transition: `all 0.2s ease`.

## Styling Rules

- `<style scoped>` on every component
- Mobile-first: `@media (min-width: 768px)` for desktop overrides
- No SCSS, no CSS preprocessors
- Tailwind utilities are allowed; Nuxt UI components are available
- Icon sizing inside scoped styles: use `:deep(svg)`

## Language Convention

- **UI text and toast messages**: Portuguese (pt-BR)
- **Code** (variables, functions, types, comments): English
- **No comments** in code — the codebase intentionally has none

## Hard Rules

- No SCSS, no additional UI component libraries
- No `any` type
- No `<div>` for interactive elements — use `<button>` or `<a>`
- No duplicate types — check `app/types/index.ts` first
- All shared interfaces go in `app/types/index.ts`; server-only types can be co-located

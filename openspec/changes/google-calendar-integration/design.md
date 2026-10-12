# Design

## Context

The app already uses Google Sign-In via `nuxt-google-auth` + GSI, which produces an ID token verified server-side. That flow stores only `googleId` on the User — it carries no access token and cannot reach the Calendar API. A separate OAuth2 Authorization Code flow is required.

The Planner feature (`usePlanner.ts`, `/pages/planner/`) is currently empty scaffolding. This integration builds the first meaningful content for it: `CalendarEvent` records alongside existing `PlannerEntry` items.

## Goals / Non-Goals

**Goals:**
- OAuth2 Calendar connect/disconnect in Settings, independent of login
- Daily cron sync pulling the next 7 days of primary Calendar events per connected user
- Read-only `CalendarEvent` records surfaced in the Planner
- Task → Calendar push on create/update/delete when `syncToCalendar = true`

**Non-Goals:**
- Real-time / webhook-based sync (cron-job.org daily pull is sufficient for MVP)
- Syncing secondary or shared calendars
- Editing Calendar events from within Mindle
- Two-way conflict resolution

## Decisions

### D1: `googleapis` npm package, server-side only
The official Google API client handles OAuth2 token exchange, refresh, and Calendar API calls. Alternatives: raw `fetch` against Google REST endpoints. Rejected — `googleapis` handles token refresh, pagination, and type safety with less code. It is never imported on the client side.

### D2: Token storage on the User model (not a separate table)
`googleAccessToken`, `googleRefreshToken`, `googleTokenExpiresAt`, `calendarConnected` added directly to `User`. Alternatives: separate `UserIntegration` table for multi-provider extensibility. Rejected for now — only one Calendar integration exists; a separate table adds a join for no gain. Revisit if a second calendar provider is added.
`ponytail: flat User fields, extract to UserIntegration if a second provider lands`

### D3: Cron endpoint secured by `x-api-key` header, not JWT
The cron call comes from cron-job.org with no user session. A static `CRON_API_KEY` env var is the simplest guard. Alternatives: IP allowlisting (fragile), signed HMAC timestamp (overkill). The key is never exposed to the client.

### D4: CalendarEvent upsert by `googleEventId`
Each sync run fetches all events in range and upserts by `googleEventId`. Events absent from the new response are deleted. This is a full replace per user per run — simple, correct, no delta tracking needed. Cost: one Calendar API call per connected user per day. At Google's 1M free queries/day ceiling this is negligible even at scale.

### D5: Task Calendar push is synchronous (not queued)
The Calendar API call is made inline during the task create/update/delete handler. Failure shows a toast warning but does not roll back the Mindle operation. Alternatives: background queue (adds infrastructure). Rejected — Calendar writes are fast (<200ms p95) and the task must still save even if Calendar fails. If latency becomes a concern, move to a background job.

### D6: `scheduledAt` is a separate field from `dueDate`
`dueDate` = deadline. `scheduledAt` = the time slot pushed to Calendar. They serve different purposes and can differ (e.g., task due Friday, but scheduled on Calendar for Wednesday afternoon). A conditional UI field appears only when `syncToCalendar = true`.

### D7: Planner renders CalendarEvent and PlannerEntry as distinct components
`PlannerCalendarEvent.vue` is visually distinct from `PlannerTaskEntry.vue` — different background, a Calendar icon, no interaction beyond read-only display. They are merged and sorted by time when rendering a day's view. No data model mixing.

## Risks / Trade-offs

- **Refresh token revoked by user in Google account settings** → system detects the 401 on next sync, sets `calendarConnected = false`, clears tokens. User must reconnect manually. Mitigation: toast or settings badge indicating disconnected state.
- **Cron timeout with many users** → sequential per-user processing. At ~200ms per user the Vercel serverless 60s limit handles ~300 users. If user count grows beyond ~500, switch to chunked processing across multiple cron calls. `ponytail: sequential sync, add chunking when users > ~500`
- **Calendar API quota** → 1M queries/day free. One call per connected user per day. Not a concern until ~1M connected users.
- **MongoDB + Prisma upsert cost** → each sync does one `upsert` per event per user. For 30 events/user this is 30 DB writes. Acceptable for a daily batch.

## Migration Plan

1. Add fields to `User` and `Task` in `prisma/schema.prisma`, add `CalendarEvent` model
2. Run `npx prisma db push` — MongoDB schema-less, no downtime
3. Add `CRON_API_KEY` and `GOOGLE_CALENDAR_CLIENT_ID` / `GOOGLE_CALENDAR_CLIENT_SECRET` / `GOOGLE_CALENDAR_REDIRECT_URI` env vars to Vercel
4. Deploy
5. Configure cron-job.org to call `GET /api/cron/sync-calendar` daily at 03:00 UTC with `x-api-key` header
6. Rollback: remove cron-job.org job; the endpoint is additive and no existing behavior changes

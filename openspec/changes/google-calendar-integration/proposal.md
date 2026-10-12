# Proposal

## Why

Users manage tasks in Mindle but also have commitments in Google Calendar, forcing them to context-switch between two tools to plan their day. This integration brings Calendar events into the Planner as a read-only layer and lets users push tasks with a scheduled time to Calendar — making Mindle the single place to see and plan the day.

## What Changes

- **New**: OAuth2 "Connect Google Calendar" flow in Settings (Flow B — separate from Google Sign-In), storing refresh token on the User model
- **New**: `CalendarEvent` Prisma model — read-only mirror of Google Calendar events, scoped to each user
- **New**: Daily cron endpoint (`/api/cron/sync-calendar`) secured by `x-api-key` header, triggered externally by cron-job.org at 03:00 UTC, syncing the primary calendar for the next 7 days per connected user
- **New**: Planner view surfaces `CalendarEvent` records alongside `PlannerEntry` items — Calendar events are read-only, not tasks
- **Modified**: Task creation form gains two conditional fields: `syncToCalendar` toggle and `scheduledAt` datetime picker (required when toggle is on)
- **Modified**: Task create/update/delete API routes write to Google Calendar when `syncToCalendar` is true, storing `googleCalendarEventId` on the Task

## Capabilities

### New Capabilities

- `google-calendar-connect`: OAuth2 Authorization Code flow to connect a user's Google Calendar; stores and refreshes access/refresh tokens; user can disconnect
- `calendar-event-sync`: Daily cron sync that pulls primary Google Calendar events (today + 7 days) into `CalendarEvent` records per user; handles upsert and deletion of stale records
- `task-calendar-push`: Optional push of a task to Google Calendar as a timed event on create/update/delete; requires `scheduledAt` when enabled

### Modified Capabilities

_(none — planner display of CalendarEvent is new surface area, not a requirement change on an existing capability)_

## Impact

**New Prisma models** (`npx prisma db push` required after schema changes):
- `CalendarEvent` — new model
- `User` additions: `googleAccessToken`, `googleRefreshToken`, `googleTokenExpiresAt`, `calendarConnected`
- `Task` additions: `syncToCalendar`, `scheduledAt`, `scheduledDuration`, `googleCalendarEventId`

**New types** in `app/types/index.ts`:
- `CalendarEvent` interface
- Additions to `Task` interface

**New server routes**:
- `GET /api/auth/google-calendar` — initiates OAuth2 redirect
- `GET /api/auth/google-calendar/callback` — exchanges code, stores tokens
- `DELETE /api/auth/google-calendar` — disconnects Calendar
- `GET /api/cron/sync-calendar` — cron endpoint (secured, not user-facing)
- `GET /api/calendar-events` — returns CalendarEvent records for the authenticated user

**Modified server routes**:
- `POST /api/tasks` — conditionally push to Calendar
- `PUT /api/tasks/[id]` — conditionally update Calendar event
- `DELETE /api/tasks/[id]` — conditionally delete Calendar event

**New composables**:
- `useCalendar.ts` — manages CalendarEvent state and calendar connection status

**New components**:
- `SettingsCalendarConnect.vue` — connect/disconnect button with connection status
- `PlannerCalendarEvent.vue` — read-only Calendar event card in the Planner view

**New dependency**: `googleapis` (Google API Node.js client) — server-side only

**Feature checklist mapping**:
1. Types → `app/types/index.ts` (CalendarEvent, Task additions)
2. Composable → `app/composables/useCalendar.ts`
3. API routes → `server/api/auth/google-calendar/`, `server/api/cron/`, `server/api/calendar-events/`
4. Components → `app/components/settings/`, `app/components/planner/`
5. Page → existing `settings.vue` (new section) + existing planner page
6. Sidebar nav → no new nav entry needed
7. Title mapping → no new page

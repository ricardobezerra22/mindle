# Tasks

## 1. Schema & Types

- [x] 1.1 Add `googleAccessToken`, `googleRefreshToken`, `googleTokenExpiresAt` (DateTime), and `calendarConnected` (Boolean, default false) to `User` model in `prisma/schema.prisma`; verify `npx prisma db push` succeeds
- [x] 1.2 Add `syncToCalendar` (Boolean, default false), `scheduledAt` (DateTime?), `scheduledDuration` (Int?, default 60), and `googleCalendarEventId` (String?) to `Task` model in `prisma/schema.prisma`
- [x] 1.3 Add `CalendarEvent` model to `prisma/schema.prisma` with fields: `id`, `googleEventId` (unique per user), `userId`, `title`, `description?`, `startTime`, `endTime`, `allDay` (Boolean), `calendarId`, `syncedAt`; verify model appears in Prisma Studio
- [x] 1.4 Add `CalendarEvent` interface and Task field additions to `app/types/index.ts`; verify `pnpm run typecheck` passes with no new errors

## 2. googleapis Dependency & Server Utility

- [x] 2.1 Install `googleapis` via `npm install googleapis`; verify it appears in `package.json` dependencies and `pnpm run build` compiles without errors
- [x] 2.2 Create `server/utils/googleCalendar.ts` exporting an `getCalendarClient(accessToken: string)` factory and a `refreshAccessToken(userId: string)` helper that reads stored tokens, refreshes if expired, updates the DB, and returns a valid access token; verify TypeScript check passes

## 3. OAuth2 Calendar Connect Routes

- [x] 3.1 Create `server/api/auth/google-calendar/index.get.ts` that redirects to Google OAuth2 with `calendar.readonly` and `calendar.events` scopes; verify the redirect URL contains the correct scopes and `redirect_uri`
- [x] 3.2 Create `server/api/auth/google-calendar/callback.get.ts` that exchanges the code for tokens, stores them on the user (scoped by `userId` from `event.context`), sets `calendarConnected = true`, and redirects to `/settings`; verify an error param redirects to `/settings` with the error surfaced
- [x] 3.3 Create `server/api/auth/google-calendar/index.delete.ts` that clears all Calendar tokens, sets `calendarConnected = false`, and deletes all `CalendarEvent` records for `userId`; verify the route is userId-scoped and returns `sendSuccess`

## 4. Cron Sync Endpoint

- [x] 4.1 Create `server/api/cron/sync-calendar.get.ts` that checks `x-api-key` header against `CRON_API_KEY` env var and returns 401 on mismatch; verify a request without the header returns HTTP 401
- [x] 4.2 Implement the sync loop in the same route: query all users with `calendarConnected = true`, call `refreshAccessToken`, fetch primary calendar events for today + 7 days, upsert `CalendarEvent` records, delete stale records; verify a test call with the correct key returns `{ processed: N, errors: [] }` for a connected user
- [x] 4.3 Add `CRON_API_KEY`, `GOOGLE_CALENDAR_CLIENT_ID`, `GOOGLE_CALENDAR_CLIENT_SECRET`, and `GOOGLE_CALENDAR_REDIRECT_URI` to `nuxt.config.ts` `runtimeConfig` (server-side only) and document the required env vars in a comment block in `.env.example`

## 5. Calendar Events API Route

- [x] 5.1 Create `server/api/calendar-events/index.get.ts` that returns all `CalendarEvent` records for `event.context.userId` ordered by `startTime` ascending using `sendSuccess`; verify the route returns an empty array for a user with no events

## 6. useCalendar Composable

- [x] 6.1 Create `app/composables/useCalendar.ts` exporting `{ calendarEvents, calendarConnected, loading, fetchCalendarEvents, connectCalendar, disconnectCalendar }`; `connectCalendar` navigates to `/api/auth/google-calendar`; `disconnectCalendar` calls `DELETE /api/auth/google-calendar` then clears local state; verify `pnpm run typecheck` passes

## 7. Settings — Calendar Connect UI

- [x] 7.1 Create `app/components/settings/CalendarConnect.vue` with a "Conectar Google Calendar" button when disconnected and a connected status + "Desconectar" button when connected; calls `connectCalendar` / `disconnectCalendar` from `useCalendar`; uses CSS custom properties, `<button>` elements, `<style scoped>`
- [x] 7.2 Add the `<SettingsCalendarConnect>` component to `app/pages/settings.vue` in an "Integrações" section; verify the section renders and the button is visible in the dev server

## 8. Task Form — Sync to Calendar Fields

- [x] 8.1 Locate the task creation component(s) and add a `syncToCalendar` toggle; when toggled on, show a `scheduledAt` datetime input (required) and an optional `scheduledDuration` number input (default 60 min); when toggled off, hide and clear both fields; verify the conditional fields appear/disappear correctly
- [x] 8.2 Update the `createTask` call in `useTasks.ts` to pass `syncToCalendar`, `scheduledAt`, and `scheduledDuration` to `POST /api/tasks`; verify `pnpm run typecheck` passes

## 9. Task API — Calendar Push on Create/Update/Delete

- [x] 9.1 Update `server/api/tasks/index.post.ts`: when `syncToCalendar = true`, validate `scheduledAt` is present, call the Calendar API to create an event, store `googleCalendarEventId` on the task; if Calendar fails, still save the task and return a warning field; verify userId-scoped, validate `sendSuccess` shape
- [x] 9.2 Update `server/api/tasks/[id].put.ts`: when the updated task has `googleCalendarEventId`, patch the Calendar event with changed title/description/scheduledAt/scheduledDuration; when `syncToCalendar` flips to false, delete the Calendar event and clear `googleCalendarEventId` and `scheduledAt`; verify userId-scoped
- [x] 9.3 Update `server/api/tasks/[id].delete.ts`: when the task has `googleCalendarEventId`, delete the Calendar event before removing the task; if Calendar delete fails, still delete the task; verify userId-scoped

## 10. Planner — CalendarEvent Display

- [x] 10.1 Create `app/components/planner/CalendarEvent.vue` — read-only card showing event title, time range, and a Calendar icon; visually distinct from task entries (different background tint, no interactive controls beyond read-only); uses CSS custom properties, `<style scoped>`
- [x] 10.2 Update the Planner page to fetch `calendarEvents` via `useCalendar` and render `<PlannerCalendarEvent>` entries merged and sorted by time alongside `PlannerEntry` items for each day; verify the Planner renders both types in the dev server with no console errors

## 11. Integration Verification

- [ ] 11.1 Manually test the full connect flow: Settings → connect → OAuth consent → callback → `calendarConnected = true` in DB; verify Prisma Studio shows tokens stored
- [ ] 11.2 Manually call `GET /api/cron/sync-calendar` with the correct `x-api-key` and verify `CalendarEvent` records appear in DB for the connected user
- [ ] 11.3 Create a task with `syncToCalendar = true` and verify the event appears in Google Calendar; update the task title and verify the Calendar event title updates; delete the task and verify the Calendar event is removed
- [ ] 11.4 Run `pnpm run typecheck` and `pnpm run lint` with zero errors

## Workflow follow-up

- Configure cron-job.org to call `GET <production-url>/api/cron/sync-calendar` daily at 03:00 UTC with the `x-api-key` header matching `CRON_API_KEY`.
- Add `CRON_API_KEY`, `GOOGLE_CALENDAR_CLIENT_ID`, `GOOGLE_CALENDAR_CLIENT_SECRET`, `GOOGLE_CALENDAR_REDIRECT_URI` to Vercel environment variables before deploying.
- Archive this change after implementation is verified.

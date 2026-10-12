# Spec Delta

## Purpose

Pulls events from each connected user's primary Google Calendar into `CalendarEvent` records in the database. A daily cron job at 03:00 UTC drives the sync; events are read-only within Mindle and cover the next 7 days from the sync date.

## ADDED Requirements

### Requirement: Cron endpoint is secured by API key
The sync endpoint SHALL reject any request that does not include the correct `x-api-key` header matching the server-side `CRON_API_KEY` environment variable.

#### Scenario: Valid API key
- **WHEN** a request arrives at `GET /api/cron/sync-calendar` with the correct `x-api-key` header
- **THEN** the system processes the sync and returns a result summary

#### Scenario: Missing or invalid API key
- **WHEN** a request arrives without an `x-api-key` header or with an incorrect value
- **THEN** the system returns HTTP 401 with no body

### Requirement: Sync runs for all connected users
The endpoint SHALL iterate over all users where `calendarConnected = true` and sync their primary Google Calendar events.

#### Scenario: No connected users
- **WHEN** the endpoint is called and no users have `calendarConnected = true`
- **THEN** the system returns `{ processed: 0, errors: [] }` with HTTP 200

#### Scenario: One user sync fails
- **WHEN** the Calendar API call fails for one user during a batch sync
- **THEN** the system records the error, continues processing remaining users, and includes the error in the response summary

### Requirement: Events are synced for today + 7 days
The system SHALL fetch all events from the user's primary Google Calendar with `timeMin` set to the start of the current UTC day and `timeMax` set to the end of 7 days ahead.

#### Scenario: Events within range are upserted
- **WHEN** Calendar returns events within the date range
- **THEN** the system upserts each event into `CalendarEvent` using `googleEventId` as the key, updating title, description, startTime, endTime, allDay, and syncedAt

#### Scenario: All-day events are handled
- **WHEN** a Calendar event has a `date` field instead of `dateTime`
- **THEN** the system sets `allDay = true` and stores the date as the start of that UTC day

### Requirement: Stale CalendarEvent records are deleted
The system SHALL delete any `CalendarEvent` records for the user whose `googleEventId` is not present in the latest Calendar API response for the synced range.

#### Scenario: Event deleted in Google Calendar
- **WHEN** an event previously synced no longer appears in the Calendar API response
- **THEN** the system deletes the corresponding `CalendarEvent` record

### Requirement: CalendarEvent records are exposed via API
The system SHALL provide a `GET /api/calendar-events` endpoint that returns the authenticated user's `CalendarEvent` records ordered by `startTime` ascending.

#### Scenario: Authenticated user fetches events
- **WHEN** an authenticated user calls `GET /api/calendar-events`
- **THEN** the system returns all `CalendarEvent` records for that user, ordered by `startTime`

#### Scenario: User with no synced events
- **WHEN** an authenticated user with no `CalendarEvent` records calls the endpoint
- **THEN** the system returns an empty array with HTTP 200

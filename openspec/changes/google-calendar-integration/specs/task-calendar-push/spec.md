# Spec Delta

## Purpose

Lets users optionally push a Mindle task to their primary Google Calendar as a timed event. The task gains a `syncToCalendar` toggle and a `scheduledAt` datetime field; the corresponding Calendar event is kept in sync through the task's lifecycle.

## ADDED Requirements

### Requirement: Task creation accepts Calendar sync fields
The task creation form SHALL expose a `syncToCalendar` toggle. When enabled, a `scheduledAt` datetime field becomes required. `syncToCalendar` cannot be true without a `scheduledAt` value.

#### Scenario: User enables sync without a date
- **WHEN** the user enables `syncToCalendar` and submits without setting `scheduledAt`
- **THEN** the system rejects the request with a validation error in Portuguese

#### Scenario: User enables sync with a valid date
- **WHEN** the user enables `syncToCalendar` and sets `scheduledAt` to a valid future datetime
- **THEN** the system accepts the task and proceeds to create the Calendar event

#### Scenario: User creates task without Calendar sync
- **WHEN** the user leaves `syncToCalendar` off
- **THEN** the task is created normally with no Calendar interaction

### Requirement: A Calendar event is created when a task is synced
The system SHALL create a Google Calendar event on the user's primary calendar when `syncToCalendar = true`, using `title` as the event summary, `description` as the event description, `scheduledAt` as the start time, and `scheduledAt + scheduledDuration` (default 60 minutes) as the end time. The returned `googleCalendarEventId` SHALL be stored on the Task.

#### Scenario: Calendar event creation succeeds
- **WHEN** a task with `syncToCalendar = true` is created and the Calendar API responds successfully
- **THEN** the system stores the returned event id in `googleCalendarEventId` on the Task

#### Scenario: Calendar event creation fails
- **WHEN** the Calendar API call fails during task creation
- **THEN** the task is still created in Mindle and the error is logged; the user sees a toast warning in Portuguese that Calendar sync failed

#### Scenario: User is not connected to Calendar
- **WHEN** a task is submitted with `syncToCalendar = true` but the user has no `calendarConnected = true`
- **THEN** the system returns a validation error instructing the user to connect Google Calendar first

### Requirement: Calendar event is updated when the synced task changes
The system SHALL update the Google Calendar event whenever a task with a `googleCalendarEventId` has its `title`, `description`, `scheduledAt`, or `scheduledDuration` changed.

#### Scenario: Title updated on a synced task
- **WHEN** a user updates the title of a task that has `googleCalendarEventId` set
- **THEN** the system patches the corresponding Calendar event's summary

#### Scenario: Calendar update fails on task update
- **WHEN** the Calendar API patch call fails
- **THEN** the task update is still persisted in Mindle and the user sees a toast warning in Portuguese

### Requirement: Calendar event is deleted when the synced task is deleted
The system SHALL delete the Google Calendar event when a task with a `googleCalendarEventId` is deleted from Mindle.

#### Scenario: Task deletion removes Calendar event
- **WHEN** a user deletes a task that has `googleCalendarEventId` set
- **THEN** the system deletes the corresponding Calendar event; if the API call fails the task is still deleted from Mindle

### Requirement: User can disable Calendar sync on an existing task
The system SHALL allow the user to turn off `syncToCalendar` on an existing synced task, which SHALL delete the corresponding Calendar event and clear `googleCalendarEventId`.

#### Scenario: User disables sync
- **WHEN** a user updates a task by setting `syncToCalendar = false`
- **THEN** the system deletes the Calendar event, clears `googleCalendarEventId`, and clears `scheduledAt`

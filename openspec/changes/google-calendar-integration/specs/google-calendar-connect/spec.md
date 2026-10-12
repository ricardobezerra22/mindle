# Spec Delta

## Purpose

Allows users to connect their Google Calendar account to Mindle via OAuth2, granting the app read/write access to their primary calendar. The connection can be revoked at any time from Settings.

## ADDED Requirements

### Requirement: User can initiate Calendar connection
The system SHALL provide a "Conectar Google Calendar" button in Settings that initiates an OAuth2 Authorization Code flow requesting the `calendar.readonly` and `calendar.events` scopes against the user's primary Google account.

#### Scenario: User initiates connection
- **WHEN** the user clicks "Conectar Google Calendar" in Settings
- **THEN** the system redirects to Google's OAuth2 consent screen with the correct scopes

#### Scenario: User is already connected
- **WHEN** the user visits Settings with `calendarConnected = true`
- **THEN** the button is replaced by a connected status indicator and a "Desconectar" option

### Requirement: OAuth2 callback stores tokens
The system SHALL exchange the authorization code for an access token and refresh token, store both on the User record, and redirect the user back to Settings on success.

#### Scenario: Successful OAuth2 callback
- **WHEN** Google redirects to the callback URL with a valid authorization code
- **THEN** the system stores `googleAccessToken`, `googleRefreshToken`, and `googleTokenExpiresAt` on the user, sets `calendarConnected = true`, and redirects to `/settings`

#### Scenario: OAuth2 callback with error
- **WHEN** Google redirects to the callback URL with an `error` parameter
- **THEN** the system redirects to `/settings` with a toast error message in Portuguese

### Requirement: User can disconnect Google Calendar
The system SHALL allow a connected user to revoke Calendar access, clearing stored tokens and marking the user as disconnected.

#### Scenario: User disconnects
- **WHEN** the user clicks "Desconectar" and confirms
- **THEN** the system clears `googleAccessToken`, `googleRefreshToken`, `googleTokenExpiresAt`, sets `calendarConnected = false`, and shows a success toast

#### Scenario: CalendarEvent records after disconnect
- **WHEN** the user disconnects
- **THEN** existing `CalendarEvent` records for that user are deleted

### Requirement: Access token is refreshed automatically
The system SHALL refresh the access token using the stored refresh token whenever it is expired or within 5 minutes of expiry before making any Calendar API call.

#### Scenario: Token refresh succeeds
- **WHEN** a Calendar API call is attempted and the access token is expired
- **THEN** the system uses the refresh token to obtain a new access token, updates the stored token, and proceeds with the API call

#### Scenario: Refresh token is invalid
- **WHEN** the refresh token is rejected by Google
- **THEN** the system sets `calendarConnected = false`, clears tokens, and returns an error indicating re-connection is required

import { google } from "googleapis";
import { prisma } from "./prisma";

const createOAuthClient = () =>
  new google.auth.OAuth2(
    process.env.GOOGLE_CALENDAR_CLIENT_ID,
    process.env.GOOGLE_CALENDAR_CLIENT_SECRET,
    process.env.GOOGLE_CALENDAR_REDIRECT_URI,
  );

export const getCalendarClient = (accessToken: string) => {
  const auth = createOAuthClient();
  auth.setCredentials({ access_token: accessToken });
  return google.calendar({ version: "v3", auth });
};

export const getAuthUrl = () => {
  const oauth2Client = createOAuthClient();
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/calendar.readonly",
      "https://www.googleapis.com/auth/calendar.events",
    ],
    prompt: "consent",
  });
};

export const exchangeCode = async (code: string) => {
  const oauth2Client = createOAuthClient();
  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
};

export const refreshAccessToken = async (userId: string): Promise<string> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      googleAccessToken: true,
      googleRefreshToken: true,
      googleTokenExpiresAt: true,
    },
  });

  if (!user?.googleRefreshToken) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        calendarConnected: false,
        googleAccessToken: null,
        googleRefreshToken: null,
        googleTokenExpiresAt: null,
      },
    });
    throw new Error("Calendar reconnect required");
  }

  const fiveMinutesFromNow = new Date(Date.now() + 5 * 60 * 1000);
  if (
    user.googleAccessToken &&
    user.googleTokenExpiresAt &&
    user.googleTokenExpiresAt > fiveMinutesFromNow
  ) {
    return user.googleAccessToken;
  }

  const oauth2Client = createOAuthClient();
  oauth2Client.setCredentials({ refresh_token: user.googleRefreshToken });

  try {
    const { credentials } = await oauth2Client.refreshAccessToken();
    await prisma.user.update({
      where: { id: userId },
      data: {
        googleAccessToken: credentials.access_token ?? null,
        googleTokenExpiresAt: credentials.expiry_date
          ? new Date(credentials.expiry_date)
          : null,
      },
    });
    return credentials.access_token!;
  } catch {
    await prisma.user.update({
      where: { id: userId },
      data: {
        calendarConnected: false,
        googleAccessToken: null,
        googleRefreshToken: null,
        googleTokenExpiresAt: null,
      },
    });
    throw new Error("Calendar reconnect required");
  }
};

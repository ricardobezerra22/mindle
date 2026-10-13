import { prisma } from "../../utils/prisma";
import { refreshAccessToken, getCalendarClient } from "../../utils/googleCalendar";

export default defineEventHandler(async (event) => {
  const apiKey = getHeader(event, "x-api-key");
  if (!apiKey || apiKey !== process.env.CRON_API_KEY) {
    setResponseStatus(event, 401);
    return;
  }

  const connectedUsers = await prisma.user.findMany({
    where: { calendarConnected: true },
    select: { id: true },
  });

  const now = new Date();
  const timeMin = new Date(now);
  timeMin.setUTCHours(0, 0, 0, 0);
  const timeMax = new Date(timeMin);
  timeMax.setUTCDate(timeMax.getUTCDate() + 7);

  let processed = 0;
  const errors: { userId: string; error: string }[] = [];

  for (const user of connectedUsers) {
    try {
      const accessToken = await refreshAccessToken(user.id);
      const calendar = getCalendarClient(accessToken);

      const res = await calendar.events.list({
        calendarId: "primary",
        timeMin: timeMin.toISOString(),
        timeMax: timeMax.toISOString(),
        singleEvents: true,
        maxResults: 500,
      });

      const events = res.data.items ?? [];
      const seenEventIds: string[] = [];

      for (const ev of events) {
        if (!ev.id) continue;
        seenEventIds.push(ev.id);

        const start = ev.start?.dateTime ?? ev.start?.date;
        const end = ev.end?.dateTime ?? ev.end?.date;
        const allDay = !ev.start?.dateTime;

        if (!start || !end) continue;

        await prisma.calendarEvent.upsert({
          where: { googleEventId_userId: { googleEventId: ev.id, userId: user.id } },
          update: {
            title: ev.summary ?? "(sem título)",
            description: ev.description ?? null,
            startTime: new Date(start),
            endTime: new Date(end),
            allDay,
            calendarId: "primary",
            syncedAt: new Date(),
          },
          create: {
            googleEventId: ev.id,
            userId: user.id,
            title: ev.summary ?? "(sem título)",
            description: ev.description ?? null,
            startTime: new Date(start),
            endTime: new Date(end),
            allDay,
            calendarId: "primary",
          },
        });
      }

      await prisma.calendarEvent.deleteMany({
        where: {
          userId: user.id,
          googleEventId: { notIn: seenEventIds },
          startTime: { gte: timeMin, lte: timeMax },
        },
      });

      processed++;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      errors.push({ userId: user.id, error: message });
    }
  }

  return sendSuccess(event, { processed, errors });
});

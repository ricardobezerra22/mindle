import { prisma } from "../../utils/prisma";
import { refreshAccessToken, getCalendarClient } from "../../utils/googleCalendar";

const align15Min = (date: Date): Date => {
  const ms = date.getTime();
  const aligned = Math.round(ms / (15 * 60 * 1000)) * (15 * 60 * 1000);
  return new Date(aligned);
};

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const userId = event.context.userId;

    const { title, description, status, priority, dueDate, color, categoryId, subTasks, isFavorite, syncToCalendar, scheduledAt, scheduledDuration } = body;

    if (!title) {
      return sendError(event, serverT(event, "server.titleIsRequired"), 400);
    }

    if (syncToCalendar && !scheduledAt) {
      return sendError(event, serverT(event, "server.scheduledAtRequired"), 400);
    }

    if (syncToCalendar) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { calendarConnected: true },
      });
      if (!user?.calendarConnected) {
        return sendError(event, serverT(event, "server.calendarNotConnected"), 400);
      }
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status: status || "NOT_STARTED",
        priority: priority || "MEDIUM",
        dueDate: dueDate ? new Date(dueDate) : undefined,
        color,
        isFavorite: isFavorite || false,
        categoryId: categoryId || undefined,
        userId,
        syncToCalendar: syncToCalendar || false,
        scheduledAt: scheduledAt ? align15Min(new Date(scheduledAt)) : undefined,
        scheduledDuration: scheduledDuration ?? undefined,
        ...(subTasks?.length && {
          subTasks: {
            create: subTasks.map((st: { title: string }) => ({ title: st.title })),
          },
        }),
      },
      include: {
        category: true,
        subTasks: true,
      },
    });

    if (syncToCalendar && task.scheduledAt) {
      try {
        const accessToken = await refreshAccessToken(userId);
        const calendar = getCalendarClient(accessToken);
        const startTime = task.scheduledAt;
        const endTime = new Date(
          startTime.getTime() + (task.scheduledDuration ?? 60) * 60 * 1000,
        );
        const calEvent = await calendar.events.insert({
          calendarId: "primary",
          requestBody: {
            summary: title,
            description: description ?? undefined,
            start: { dateTime: startTime.toISOString() },
            end: { dateTime: endTime.toISOString() },
          },
        });
        await prisma.task.update({
          where: { id: task.id },
          data: { googleCalendarEventId: calEvent.data.id ?? undefined },
        });
        task.googleCalendarEventId = calEvent.data.id ?? null;
      } catch (calErr) {
        console.error("Calendar event creation failed:", calErr);
      }
    }

    return sendSuccess(event, task, 201);
  } catch (error) {
    console.error("Error creating task:", error);
    return sendError(event, serverT(event, "server.failedToCreateTask"), 500);
  }
});

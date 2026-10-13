import { prisma } from "../../utils/prisma";
import { refreshAccessToken, getCalendarClient } from "../../utils/googleCalendar";

const align15Min = (date: Date): Date => {
  const ms = date.getTime();
  const aligned = Math.round(ms / (15 * 60 * 1000)) * (15 * 60 * 1000);
  return new Date(aligned);
};

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    const body = await readBody(event);
    const userId = event.context.userId;

    if (!id) {
      return sendError(event, serverT(event, "server.taskIdIsRequired"), 400);
    }

    const { title, description, status, priority, dueDate, color, categoryId, isFavorite, position, syncToCalendar, scheduledAt, scheduledDuration } = body;

    const existing = await prisma.task.findUnique({
      where: { id, userId },
      select: { googleCalendarEventId: true, syncToCalendar: true, title: true, description: true },
    });

    if (!existing) {
      throw createError({ statusCode: 404, statusMessage: serverT(event, "server.taskNotFound") });
    }

    const disablingSync = syncToCalendar === false && existing.syncToCalendar;
    const updateData: Record<string, unknown> = {
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(status !== undefined && { status, doneAt: status === "DONE" ? new Date() : null }),
      ...(priority !== undefined && { priority }),
      ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
      ...(color !== undefined && { color }),
      ...(isFavorite !== undefined && { isFavorite }),
      ...(categoryId !== undefined && { categoryId: categoryId || null }),
      ...(position !== undefined && { position }),
      ...(syncToCalendar !== undefined && { syncToCalendar }),
      ...(scheduledAt !== undefined && { scheduledAt: scheduledAt ? align15Min(new Date(scheduledAt)) : null }),
      ...(scheduledDuration !== undefined && { scheduledDuration }),
    };

    if (disablingSync) {
      updateData.googleCalendarEventId = null;
      updateData.scheduledAt = null;
    }

    const task = await prisma.task.update({
      where: { id, userId },
      data: updateData,
      include: { category: true, subTasks: true },
    });

    if (disablingSync && existing.googleCalendarEventId) {
      try {
        const accessToken = await refreshAccessToken(userId);
        const calendar = getCalendarClient(accessToken);
        await calendar.events.delete({
          calendarId: "primary",
          eventId: existing.googleCalendarEventId,
        });
      } catch (calErr) {
        console.error("Calendar event delete failed on sync disable:", calErr);
      }
    } else if (existing.googleCalendarEventId && syncToCalendar !== false) {
      try {
        const accessToken = await refreshAccessToken(userId);
        const calendar = getCalendarClient(accessToken);
        const patchBody: Record<string, unknown> = {};
        if (title !== undefined) patchBody.summary = title;
        if (description !== undefined) patchBody.description = description;
        if (scheduledAt !== undefined || scheduledDuration !== undefined) {
          const start = new Date(scheduledAt ?? task.scheduledAt!);
          const dur = scheduledDuration ?? task.scheduledDuration ?? 60;
          patchBody.start = { dateTime: start.toISOString() };
          patchBody.end = { dateTime: new Date(start.getTime() + dur * 60 * 1000).toISOString() };
        }
        if (Object.keys(patchBody).length > 0) {
          await calendar.events.patch({
            calendarId: "primary",
            eventId: existing.googleCalendarEventId,
            requestBody: patchBody,
          });
        }
      } catch (calErr) {
        console.error("Calendar event update failed:", calErr);
      }
    }

    return sendSuccess(event, task);
  } catch (error) {
    console.error("Error updating task:", error);
    return sendError(event, serverT(event, "server.failedToUpdateTask"), 500);
  }
});

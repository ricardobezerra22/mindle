import { prisma } from "../../utils/prisma";
import { refreshAccessToken, getCalendarClient } from "../../utils/googleCalendar";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    const userId = event.context.userId;

    if (!id) {
      return sendError(event, serverT(event, "server.taskIdIsRequired"), 400);
    }

    const task = await prisma.task.findUnique({
      where: { id, userId },
      select: { googleCalendarEventId: true },
    });

    if (task?.googleCalendarEventId) {
      try {
        const accessToken = await refreshAccessToken(userId);
        const calendar = getCalendarClient(accessToken);
        await calendar.events.delete({
          calendarId: "primary",
          eventId: task.googleCalendarEventId,
        });
      } catch (calErr) {
        console.error("Calendar event delete failed:", calErr);
      }
    }

    await prisma.subTask.deleteMany({
      where: { taskId: id },
    });

    await prisma.plannerEntry.deleteMany({
      where: { taskId: id },
    });

    await prisma.task.delete({
      where: { id },
    });

    return sendSuccess(event, { message: serverT(event, "server.taskDeleted") });
  } catch (error) {
    console.error("Error deleting task:", error);
    return sendError(event, serverT(event, "server.failedToDeleteTask"), 500);
  }
});

import { prisma } from "../../utils/prisma";

export default defineEventHandler(async (event) => {
  const userId = event.context.userId;

  const events = await prisma.calendarEvent.findMany({
    where: { userId },
    orderBy: { startTime: "asc" },
  });

  return sendSuccess(event, events);
});

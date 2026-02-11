import { prisma } from "../../utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const userId = event.context.userId;

    const sessions = await prisma.focusSession.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      include: {
        task: {
          select: { id: true, title: true, category: true },
        },
      },
    });

    return sendSuccess(event, sessions);
  } catch (error) {
    console.error("Error fetching focus sessions:", error);
    return sendError(event, "Failed to fetch focus sessions", 500);
  }
});

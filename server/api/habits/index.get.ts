import { prisma } from "../../utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const userId = event.context.userId;

    const habits = await prisma.habit.findMany({
      where: { userId },
      include: {
        logs: {
          where: {
            done: true,
          },
          orderBy: { date: "desc" },
        },
      },
      orderBy: {
        position: "asc",
      },
    });

    return sendSuccess(event, habits);
  } catch (error) {
    console.error("Error fetching habits:", error);
    return sendError(event, "Failed to fetch habits", 500);
  }
});

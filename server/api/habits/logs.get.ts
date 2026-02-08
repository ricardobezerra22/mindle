import { prisma } from "../../utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const userId = event.context.userId;

    const logs = await prisma.habitLog.findMany({
      where: { userId },
      orderBy: {
        date: "desc",
      },
    });

    return sendSuccess(event, logs);
  } catch (error) {
    console.error("Error fetching habit logs:", error);
    return sendError(event, "Failed to fetch habit logs", 500);
  }
});

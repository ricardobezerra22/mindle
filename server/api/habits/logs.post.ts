import { prisma } from "../../utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const userId = event.context.userId;

    const body = await readBody(event);
    const { habitId, date, done } = body;

    if (!habitId) {
      return sendError(event, "Habit ID is required", 400);
    }

    const log = await prisma.habitLog.create({
      data: {
        userId,
        habitId,
        date: date ? new Date(date) : new Date(),
        done: done !== undefined ? done : true,
      },
    });

    return sendSuccess(event, log);
  } catch (error) {
    console.error("Error creating habit log:", error);
    return sendError(event, "Failed to create habit log", 500);
  }
});

import { prisma } from "../../utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const userId = event.context.userId;

    const body = await readBody(event);
    const { focusContext, durationMinutes, elapsedMinutes, taskId } = body;

    if (!durationMinutes || !elapsedMinutes) {
      return sendError(event, "Missing required fields", 400);
    }

    const elapsed = parseInt(elapsedMinutes);

    const focusSession = await prisma.focusSession.create({
      data: {
        userId,
        focusContext: focusContext || null,
        duration: parseInt(durationMinutes),
        elapsed,
        taskId: taskId || null,
      },
      include: {
        task: {
          select: { id: true, title: true },
        },
      },
    });

    if (taskId) {
      await prisma.task.update({
        where: { id: taskId },
        data: { timeSpent: { increment: elapsed } },
      });
    }

    return sendSuccess(event, focusSession);
  } catch (error) {
    console.error("Error creating focus session:", error);
    return sendError(event, "Failed to create focus session", 500);
  }
});

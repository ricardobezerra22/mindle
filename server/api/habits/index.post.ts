import { prisma } from "../../utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const userId = event.context.userId;

    const body = await readBody(event);
    const { title, icon, weeklyGoal } = body;

    if (!title) {
      return sendError(event, "Title is required", 400);
    }

    const count = await prisma.habit.count({ where: { userId } });

    const habit = await prisma.habit.create({
      data: {
        userId,
        title,
        icon: icon || null,
        weeklyGoal: weeklyGoal ?? 3,
        position: count,
      },
    });

    return sendSuccess(event, habit);
  } catch (error) {
    console.error("Error creating habit:", error);
    return sendError(event, "Failed to create habit", 500);
  }
});

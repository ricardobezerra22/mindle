import { prisma } from "../../utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    const body = await readBody(event);

    if (!id) {
      return sendError(event, "Task ID is required", 400);
    }

    const { title, description, status, priority, dueDate, color, categoryId, isFavorite } = body;

    const task = await prisma.task.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(status !== undefined && { status }),
        ...(priority !== undefined && { priority }),
        ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
        ...(color !== undefined && { color }),
        ...(isFavorite !== undefined && { isFavorite }),
        ...(categoryId !== undefined && { categoryId: categoryId || null }),
      },
      include: {
        category: true,
        subTasks: true,
      },
    });

    return sendSuccess(event, task);
  } catch (error) {
    console.error("Error updating task:", error);
    return sendError(event, "Failed to update task", 500);
  }
});

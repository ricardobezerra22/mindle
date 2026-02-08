import { prisma } from "../../utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { title, taskId } = body;

    if (!title || !taskId) {
      return sendError(event, "Title and taskId are required", 400);
    }

    const subTask = await prisma.subTask.create({
      data: { title, taskId },
    });

    return sendSuccess(event, subTask, 201);
  } catch (error) {
    console.error("Error creating subtask:", error);
    return sendError(event, "Failed to create subtask", 500);
  }
});

import { prisma } from "../../utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");

    if (!id) {
      return sendError(event, serverT(event, "server.taskIdIsRequired"), 400);
    }

    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        subTasks: true,
      },
    });

    if (!task) {
      return sendError(event, serverT(event, "server.taskNotFound"), 404);
    }

    return sendSuccess(event, task);
  } catch (error) {
    console.error("Error fetching task:", error);
    return sendError(event, serverT(event, "server.failedToFetchTask"), 500);
  }
});

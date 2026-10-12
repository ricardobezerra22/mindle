import { prisma } from "../../utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { id, title, done, position } = body;

    if (!id) return sendError(event, serverT(event, "server.taskIdIsRequired"), 400);

    const task = await prisma.projectTask.update({
      where: { id },
      data: {
        ...(title !== undefined && { title: title.trim() }),
        ...(done !== undefined && { done }),
        ...(position !== undefined && { position }),
      },
    });

    return sendSuccess(event, task);
  } catch (error) {
    console.error("Error updating project task:", error);
    return sendError(event, serverT(event, "server.failedToUpdateProjectTask"), 500);
  }
});

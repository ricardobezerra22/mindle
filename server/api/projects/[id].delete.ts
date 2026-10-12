import { prisma } from "../../utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const userId = event.context.userId;
    const id = getRouterParam(event, "id");

    if (!id) return sendError(event, serverT(event, "server.projectIdIsRequired"), 400);

    const existing = await prisma.project.findFirst({
      where: { id, userId },
    });

    if (!existing) return sendError(event, serverT(event, "server.projectNotFound"), 404);

    await prisma.project.delete({ where: { id } });

    return sendSuccess(event, { deleted: true });
  } catch (error) {
    console.error("Error deleting project:", error);
    return sendError(event, serverT(event, "server.failedToDeleteProject"), 500);
  }
});

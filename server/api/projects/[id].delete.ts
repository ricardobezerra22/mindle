import { prisma } from "../../utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const userId = event.context.userId;
    const id = getRouterParam(event, "id");

    if (!id) return sendError(event, "Project ID is required", 400);

    const existing = await prisma.project.findFirst({
      where: { id, userId },
    });

    if (!existing) return sendError(event, "Project not found", 404);

    await prisma.project.delete({ where: { id } });

    return sendSuccess(event, { deleted: true });
  } catch (error) {
    console.error("Error deleting project:", error);
    return sendError(event, "Failed to delete project", 500);
  }
});

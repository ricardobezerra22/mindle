import { prisma } from "../../utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { id } = body;

    if (!id) return sendError(event, "Task ID is required", 400);

    await prisma.projectTask.delete({ where: { id } });

    return sendSuccess(event, { deleted: true });
  } catch (error) {
    console.error("Error deleting project task:", error);
    return sendError(event, "Failed to delete project task", 500);
  }
});

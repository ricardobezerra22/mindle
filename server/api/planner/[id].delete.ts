import { prisma } from "../../utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");

    if (!id) {
      return sendError(event, "ID is required", 400);
    }

    await prisma.plannerEntry.delete({
      where: { id },
    });

    return sendSuccess(event, { deleted: true });
  } catch (error) {
    console.error("Error deleting planner entry:", error);
    return sendError(event, "Failed to delete planner entry", 500);
  }
});

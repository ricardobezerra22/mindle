import { prisma } from "../../utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");

    if (!id) {
      return sendError(event, serverT(event, "server.idIsRequired"), 400);
    }

    await prisma.plannerEntry.delete({
      where: { id },
    });

    return sendSuccess(event, { deleted: true });
  } catch (error) {
    console.error("Error deleting planner entry:", error);
    return sendError(event, serverT(event, "server.failedToDeletePlannerEntry"), 500);
  }
});

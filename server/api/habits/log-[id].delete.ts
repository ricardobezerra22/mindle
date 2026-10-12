import { prisma } from "../../utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");

    if (!id) {
      return sendError(event, serverT(event, "server.idIsRequired"), 400);
    }

    await prisma.habitLog.delete({
      where: { id },
    });

    return sendSuccess(event, { deleted: true });
  } catch (error) {
    console.error("Error deleting habit log:", error);
    return sendError(event, serverT(event, "server.failedToDeleteHabitLog"), 500);
  }
});

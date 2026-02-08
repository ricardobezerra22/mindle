import { prisma } from "../../utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");

    if (!id) {
      return sendError(event, "ID is required", 400);
    }

    await prisma.habitLog.deleteMany({
      where: { habitId: id },
    });

    await prisma.habit.delete({
      where: { id },
    });

    return sendSuccess(event, { deleted: true });
  } catch (error) {
    console.error("Error deleting habit:", error);
    return sendError(event, "Failed to delete habit", 500);
  }
});

import { prisma } from "../../utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");

    if (!id) {
      return sendError(event, "Task ID is required", 400);
    }

    await prisma.subTask.deleteMany({
      where: { taskId: id },
    });

    await prisma.plannerEntry.deleteMany({
      where: { taskId: id },
    });

    await prisma.task.delete({
      where: { id },
    });

    return sendSuccess(event, { message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    return sendError(event, "Failed to delete task", 500);
  }
});

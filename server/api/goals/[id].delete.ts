import { deleteGoal } from "../../services/goalService";

export default defineEventHandler(async (event) => {
  try {
    const userId = event.context.userId;
    const id = getRouterParam(event, "id");

    if (!id) {
      return sendError(event, "ID is required", 400);
    }

    const deleted = await deleteGoal(id, userId);
    if (!deleted) {
      return sendError(event, "Goal not found", 404);
    }

    return sendSuccess(event, { deleted: true });
  } catch (error) {
    console.error("Error deleting goal:", error);
    return sendError(event, "Failed to delete goal", 500);
  }
});

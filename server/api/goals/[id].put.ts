import { updateGoal } from "../../services/goalService";

export default defineEventHandler(async (event) => {
  try {
    const userId = event.context.userId;
    const id = getRouterParam(event, "id");

    if (!id) {
      return sendError(event, "ID is required", 400);
    }

    const body = await readBody(event);
    const goal = await updateGoal(id, userId, body);

    if (!goal) {
      return sendError(event, "Goal not found", 404);
    }

    return sendSuccess(event, goal);
  } catch (error) {
    console.error("Error updating goal:", error);
    return sendError(event, "Failed to update goal", 500);
  }
});

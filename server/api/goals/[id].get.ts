import { getGoalById } from "../../services/goalService";

export default defineEventHandler(async (event) => {
  try {
    const userId = event.context.userId;
    const id = getRouterParam(event, "id");

    if (!id) {
      return sendError(event, "ID is required", 400);
    }

    const goal = await getGoalById(id, userId);
    if (!goal) {
      return sendError(event, "Goal not found", 404);
    }

    return sendSuccess(event, goal);
  } catch (error) {
    console.error("Error fetching goal:", error);
    return sendError(event, "Failed to fetch goal", 500);
  }
});

import { getGoalById } from "../../services/goalService";

export default defineEventHandler(async (event) => {
  try {
    const userId = event.context.userId;
    const id = getRouterParam(event, "id");

    if (!id) {
      return sendError(event, serverT(event, "server.idIsRequired"), 400);
    }

    const goal = await getGoalById(id, userId);
    if (!goal) {
      return sendError(event, serverT(event, "server.goalNotFound"), 404);
    }

    return sendSuccess(event, goal);
  } catch (error) {
    console.error("Error fetching goal:", error);
    return sendError(event, serverT(event, "server.failedToFetchGoal"), 500);
  }
});

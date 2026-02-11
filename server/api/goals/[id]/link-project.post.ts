import { linkProjectToGoal } from "../../../services/goalService";

export default defineEventHandler(async (event) => {
  try {
    const userId = event.context.userId;
    const goalId = getRouterParam(event, "id");
    const body = await readBody(event);
    const { projectId } = body;

    if (!goalId || !projectId) {
      return sendError(event, "Goal ID and Project ID are required", 400);
    }

    const project = await linkProjectToGoal(goalId, projectId, userId);
    if (!project) {
      return sendError(event, "Goal or Project not found", 404);
    }

    return sendSuccess(event, project);
  } catch (error) {
    console.error("Error linking project to goal:", error);
    return sendError(event, "Failed to link project", 500);
  }
});

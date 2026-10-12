import { linkProjectToGoal } from "../../../services/goalService";

export default defineEventHandler(async (event) => {
  try {
    const userId = event.context.userId;
    const goalId = getRouterParam(event, "id");
    const body = await readBody(event);
    const { projectId } = body;

    if (!goalId || !projectId) {
      return sendError(event, serverT(event, "server.goalIdAndProjectIdAreRequired"), 400);
    }

    const project = await linkProjectToGoal(goalId, projectId, userId);
    if (!project) {
      return sendError(event, serverT(event, "server.goalOrProjectNotFound"), 404);
    }

    return sendSuccess(event, project);
  } catch (error) {
    console.error("Error linking project to goal:", error);
    return sendError(event, serverT(event, "server.failedToLinkProject"), 500);
  }
});

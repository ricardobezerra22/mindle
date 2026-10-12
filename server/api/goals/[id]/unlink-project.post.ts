import { unlinkProjectFromGoal } from "../../../services/goalService";

export default defineEventHandler(async (event) => {
  try {
    const userId = event.context.userId;
    const body = await readBody(event);
    const { projectId } = body;

    if (!projectId) {
      return sendError(event, serverT(event, "server.projectIdIsRequired"), 400);
    }

    const project = await unlinkProjectFromGoal(projectId, userId);
    if (!project) {
      return sendError(event, serverT(event, "server.projectNotFound"), 404);
    }

    return sendSuccess(event, project);
  } catch (error) {
    console.error("Error unlinking project from goal:", error);
    return sendError(event, serverT(event, "server.failedToUnlinkProject"), 500);
  }
});

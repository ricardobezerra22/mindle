import { unlinkProjectFromGoal } from "../../../services/goalService";

export default defineEventHandler(async (event) => {
  try {
    const userId = event.context.userId;
    const body = await readBody(event);
    const { projectId } = body;

    if (!projectId) {
      return sendError(event, "Project ID is required", 400);
    }

    const project = await unlinkProjectFromGoal(projectId, userId);
    if (!project) {
      return sendError(event, "Project not found", 404);
    }

    return sendSuccess(event, project);
  } catch (error) {
    console.error("Error unlinking project from goal:", error);
    return sendError(event, "Failed to unlink project", 500);
  }
});

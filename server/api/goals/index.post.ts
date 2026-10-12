import { createGoal } from "../../services/goalService";

export default defineEventHandler(async (event) => {
  try {
    const userId = event.context.userId;
    const body = await readBody(event);
    const { title, description, color, deadline } = body;

    if (!title) {
      return sendError(event, serverT(event, "server.titleIsRequired"), 400);
    }

    const goal = await createGoal(userId, { title, description, color, deadline });
    return sendSuccess(event, goal);
  } catch (error) {
    console.error("Error creating goal:", error);
    return sendError(event, serverT(event, "server.failedToCreateGoal"), 500);
  }
});

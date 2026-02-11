import { getAllGoals } from "../../services/goalService";

export default defineEventHandler(async (event) => {
  try {
    const userId = event.context.userId;
    const goals = await getAllGoals(userId);
    return sendSuccess(event, goals);
  } catch (error) {
    console.error("Error fetching goals:", error);
    return sendError(event, "Failed to fetch goals", 500);
  }
});

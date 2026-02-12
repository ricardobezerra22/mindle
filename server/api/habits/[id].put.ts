import { prisma } from "../../utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");

    if (!id) {
      return sendError(event, "ID is required", 400);
    }

    const body = await readBody(event);
    const updateData: any = {};

    if (body.title !== undefined) updateData.title = body.title;
    if (body.icon !== undefined) updateData.icon = body.icon || null;
    if (body.weeklyGoal !== undefined) updateData.weeklyGoal = body.weeklyGoal;
    if (body.position !== undefined) updateData.position = body.position;

    const habit = await prisma.habit.update({
      where: { id },
      data: updateData,
    });

    return sendSuccess(event, habit);
  } catch (error) {
    console.error("Error updating habit:", error);
    return sendError(event, "Failed to update habit", 500);
  }
});

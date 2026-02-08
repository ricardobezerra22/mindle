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
    if (body.amount !== undefined) updateData.amount = parseFloat(body.amount);
    if (body.category !== undefined) updateData.category = body.category || null;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.dueDate !== undefined) updateData.dueDate = body.dueDate ? new Date(body.dueDate) : null;
    if (body.note !== undefined) updateData.note = body.note || null;
    if (body.archived !== undefined) updateData.archived = body.archived;
    if (body.paidAt !== undefined) updateData.paidAt = body.paidAt ? new Date(body.paidAt) : null;

    const entry = await prisma.financeEntry.update({
      where: { id },
      data: updateData,
    });

    return sendSuccess(event, entry);
  } catch (error) {
    console.error("Error updating finance entry:", error);
    return sendError(event, "Failed to update finance entry", 500);
  }
});

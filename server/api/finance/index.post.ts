import { prisma } from "../../utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const userId = event.context.userId;

    const body = await readBody(event);
    const { title, amount, category, status, dueDate, note } = body;

    if (!title || amount === undefined) {
      return sendError(event, "Title and amount are required", 400);
    }

    const entry = await prisma.financeEntry.create({
      data: {
        userId,
        title,
        amount: parseFloat(amount),
        category: category || null,
        status: status || "NOT_STARTED",
        dueDate: dueDate ? new Date(dueDate) : null,
        note: note || null,
      },
    });

    return sendSuccess(event, entry);
  } catch (error) {
    console.error("Error creating finance entry:", error);
    return sendError(event, "Failed to create finance entry", 500);
  }
});

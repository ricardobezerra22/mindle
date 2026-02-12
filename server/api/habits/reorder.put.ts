import { prisma } from "../../utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { items } = body;

    if (!Array.isArray(items)) {
      return sendError(event, "Items array is required", 400);
    }

    const updates = items.map((item: { id: string; position: number }) =>
      prisma.habit.update({
        where: { id: item.id },
        data: { position: item.position },
      }),
    );

    await prisma.$transaction(updates);

    return sendSuccess(event, { updated: items.length });
  } catch (error) {
    console.error("Error reordering habits:", error);
    return sendError(event, "Failed to reorder habits", 500);
  }
});

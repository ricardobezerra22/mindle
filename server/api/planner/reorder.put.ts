import { prisma } from "../../utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { items } = body;

    if (!Array.isArray(items)) {
      return sendError(event, "Items array is required", 400);
    }

    const updates = items.map((item: { id: string; position: number }) =>
      prisma.plannerEntry.update({
        where: { id: item.id },
        data: { position: item.position },
      }),
    );

    await prisma.$transaction(updates);

    return sendSuccess(event, { updated: items.length });
  } catch (error) {
    console.error("Error reordering planner entries:", error);
    return sendError(event, "Failed to reorder planner entries", 500);
  }
});

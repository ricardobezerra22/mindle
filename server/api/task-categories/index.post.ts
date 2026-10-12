import { prisma } from "../../utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const userId = event.context.userId;
    const body = await readBody(event);
    const { name, color } = body;

    if (!name || !color) {
      return sendError(event, serverT(event, "server.nameAndColorAreRequired"), 400);
    }

    const normalizedColor = color.toUpperCase().trim();
    const capitalizedName = name.trim().charAt(0).toUpperCase() + name.trim().slice(1).toLowerCase();

    const userCategories = await prisma.taskCategory.findMany({
      where: { userId },
    });

    const nameExists = userCategories.some(
      c => c.name.toLowerCase() === name.trim().toLowerCase(),
    );
    if (nameExists) {
      return sendError(event, serverT(event, "server.categoryNameExists"), 400);
    }

    const colorExists = userCategories.some(
      c => c.color.toUpperCase() === normalizedColor,
    );
    if (colorExists) {
      return sendError(event, serverT(event, "server.categoryColorExists"), 400);
    }

    const category = await prisma.taskCategory.create({
      data: { name: capitalizedName, color: normalizedColor, userId },
    });

    return sendSuccess(event, category, 201);
  } catch (error) {
    console.error("Error creating task category:", error);
    return sendError(event, serverT(event, "server.failedToCreateTaskCategory"), 500);
  }
});

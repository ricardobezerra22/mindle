import { prisma } from "../../utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const userId = event.context.userId;
    const body = await readBody(event);
    const { title, description, categoryId, dueDate } = body;

    if (!title?.trim()) {
      return sendError(event, "Title is required", 400);
    }

    const count = await prisma.project.count({ where: { userId } });

    const project = await prisma.project.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        categoryId: categoryId || null,
        dueDate: dueDate ? new Date(dueDate) : null,
        position: count,
        userId,
      },
      include: {
        category: true,
        topics: true,
      },
    });

    return sendSuccess(event, project, 201);
  } catch (error) {
    console.error("Error creating project:", error);
    return sendError(event, "Failed to create project", 500);
  }
});

import { prisma } from "../../utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const userId = event.context.userId;
    const id = getRouterParam(event, "id");
    const body = await readBody(event);

    if (!id) return sendError(event, "Project ID is required", 400);

    const existing = await prisma.project.findFirst({
      where: { id, userId },
    });

    if (!existing) return sendError(event, "Project not found", 404);

    const { title, description, categoryId, archived, position } = body;

    const project = await prisma.project.update({
      where: { id },
      data: {
        ...(title !== undefined && { title: title.trim() }),
        ...(description !== undefined && { description: description?.trim() || null }),
        ...(categoryId !== undefined && { categoryId: categoryId || null }),
        ...(archived !== undefined && { archived }),
        ...(position !== undefined && { position }),
      },
      include: {
        category: true,
        topics: {
          orderBy: { position: "asc" },
          include: {
            subtopics: {
              orderBy: { position: "asc" },
              include: {
                tasks: { orderBy: { position: "asc" } },
              },
            },
          },
        },
      },
    });

    return sendSuccess(event, project);
  } catch (error) {
    console.error("Error updating project:", error);
    return sendError(event, "Failed to update project", 500);
  }
});

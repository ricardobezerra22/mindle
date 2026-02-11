import { prisma } from "../../utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const userId = event.context.userId;
    const query = getQuery(event);

    const where: any = { userId, archived: false };

    if (query.categoryId) {
      where.categoryId = String(query.categoryId);
    }

    if (query.search) {
      where.title = { contains: String(query.search), mode: "insensitive" };
    }

    const projects = await prisma.project.findMany({
      where,
      include: {
        category: true,
        topics: {
          orderBy: { position: "asc" },
          include: {
            subtopics: {
              orderBy: { position: "asc" },
              include: {
                tasks: {
                  orderBy: { position: "asc" },
                },
              },
            },
          },
        },
      },
      orderBy: { position: "asc" },
    });

    return sendSuccess(event, projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return sendError(event, "Failed to fetch projects", 500);
  }
});

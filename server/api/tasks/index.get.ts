import { prisma } from "../../utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const userId = event.context.userId;
    const query = getQuery(event);

    const where: any = { userId };

    if (query.status) {
      where.status = String(query.status);
    }

    if (query.categoryId) {
      where.categoryId = String(query.categoryId);
    }

    if (query.from || query.to) {
      where.dueDate = {};
      if (query.from) where.dueDate.gte = new Date(String(query.from));
      if (query.to) where.dueDate.lte = new Date(String(query.to));
    }

    if (query.doneFrom || query.doneTo) {
      where.doneAt = {};
      if (query.doneFrom) where.doneAt.gte = new Date(String(query.doneFrom));
      if (query.doneTo) where.doneAt.lte = new Date(String(query.doneTo));
    }

    if (query.search) {
      const search = String(query.search);
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const sortBy = query.sortBy ? String(query.sortBy) : undefined;
    let orderBy: any = { createdAt: "desc" };

    if (sortBy === "HIGHEST_PRIORITY" || sortBy === "LOWEST_PRIORITY") {
      orderBy = [{ priority: sortBy === "HIGHEST_PRIORITY" ? "desc" : "asc" }, { createdAt: "desc" }];
    } else if (sortBy === "position") {
      orderBy = { position: "asc" };
    }

    const tasks = await prisma.task.findMany({
      where,
      include: {
        category: true,
        subTasks: true,
      },
      orderBy,
    });

    return sendSuccess(event, tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return sendError(event, "Failed to fetch tasks", 500);
  }
});

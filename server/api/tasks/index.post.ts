import { prisma } from "../../utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const userId = event.context.userId;

    const { title, description, status, priority, dueDate, color, categoryId, subTasks } = body;

    if (!title) {
      return sendError(event, "Title is required", 400);
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status: status || "NOT_STARTED",
        priority: priority || "MEDIUM",
        dueDate: dueDate ? new Date(dueDate) : undefined,
        color,
        categoryId: categoryId || undefined,
        userId,
        ...(subTasks?.length && {
          subTasks: {
            create: subTasks.map((st: { title: string }) => ({ title: st.title }))
          }
        })
      },
      include: {
        category: true,
        subTasks: true,
      },
    });

    return sendSuccess(event, task, 201);
  } catch (error) {
    console.error("Error creating task:", error);
    return sendError(event, "Failed to create task", 500);
  }
});

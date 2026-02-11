import { prisma } from "../../utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { title, subtopicId } = body;

    if (!title?.trim()) return sendError(event, "Title is required", 400);
    if (!subtopicId) return sendError(event, "Subtopic ID is required", 400);

    const count = await prisma.projectTask.count({ where: { subtopicId } });

    const task = await prisma.projectTask.create({
      data: {
        title: title.trim(),
        position: count,
        subtopicId,
      },
    });

    return sendSuccess(event, task, 201);
  } catch (error) {
    console.error("Error creating project task:", error);
    return sendError(event, "Failed to create project task", 500);
  }
});

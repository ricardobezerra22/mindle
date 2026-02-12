import { prisma } from "../../utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { title, projectId, topicId, subtopicId } = body;

    if (!title?.trim()) return sendError(event, "Title is required", 400);
    if (!projectId && !topicId && !subtopicId) {
      return sendError(event, "projectId, topicId or subtopicId is required", 400);
    }

    const where: Record<string, string> = {};
    if (subtopicId) where.subtopicId = subtopicId;
    else if (topicId) where.topicId = topicId;
    else if (projectId) where.projectId = projectId;

    const count = await prisma.projectTask.count({ where });

    const task = await prisma.projectTask.create({
      data: {
        title: title.trim(),
        position: count,
        ...(subtopicId ? { subtopicId } : {}),
        ...(topicId ? { topicId } : {}),
        ...(projectId ? { projectId } : {}),
      },
    });

    return sendSuccess(event, task, 201);
  } catch (error) {
    console.error("Error creating project task:", error);
    return sendError(event, "Failed to create project task", 500);
  }
});

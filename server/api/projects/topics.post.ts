import { prisma } from "../../utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const userId = event.context.userId;
    const body = await readBody(event);
    const { title, projectId } = body;

    if (!title?.trim()) return sendError(event, "Title is required", 400);
    if (!projectId) return sendError(event, "Project ID is required", 400);

    const project = await prisma.project.findFirst({
      where: { id: projectId, userId },
    });

    if (!project) return sendError(event, "Project not found", 404);

    const count = await prisma.topic.count({ where: { projectId } });

    const topic = await prisma.topic.create({
      data: {
        title: title.trim(),
        position: count,
        projectId,
      },
      include: { subtopics: true },
    });

    return sendSuccess(event, topic, 201);
  } catch (error) {
    console.error("Error creating topic:", error);
    return sendError(event, "Failed to create topic", 500);
  }
});

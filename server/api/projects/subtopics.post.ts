import { prisma } from "../../utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { title, topicId } = body;

    if (!title?.trim()) return sendError(event, "Title is required", 400);
    if (!topicId) return sendError(event, "Topic ID is required", 400);

    const count = await prisma.subtopic.count({ where: { topicId } });

    const subtopic = await prisma.subtopic.create({
      data: {
        title: title.trim(),
        position: count,
        topicId,
      },
      include: { tasks: true },
    });

    return sendSuccess(event, subtopic, 201);
  } catch (error) {
    console.error("Error creating subtopic:", error);
    return sendError(event, "Failed to create subtopic", 500);
  }
});

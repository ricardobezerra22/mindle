import { prisma } from "../../utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { id, title, content, position } = body;

    if (!id) return sendError(event, "Topic ID is required", 400);

    const topic = await prisma.topic.update({
      where: { id },
      data: {
        ...(title !== undefined && { title: title.trim() }),
        ...(content !== undefined && { content }),
        ...(position !== undefined && { position }),
      },
      include: {
        subtopics: {
          orderBy: { position: "asc" },
          include: {
            tasks: { orderBy: { position: "asc" } },
          },
        },
      },
    });

    return sendSuccess(event, topic);
  } catch (error) {
    console.error("Error updating topic:", error);
    return sendError(event, "Failed to update topic", 500);
  }
});

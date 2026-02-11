import { prisma } from "../../utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { id, title, content, position } = body;

    if (!id) return sendError(event, "Subtopic ID is required", 400);

    const subtopic = await prisma.subtopic.update({
      where: { id },
      data: {
        ...(title !== undefined && { title: title.trim() }),
        ...(content !== undefined && { content }),
        ...(position !== undefined && { position }),
      },
      include: {
        tasks: { orderBy: { position: "asc" } },
      },
    });

    return sendSuccess(event, subtopic);
  } catch (error) {
    console.error("Error updating subtopic:", error);
    return sendError(event, "Failed to update subtopic", 500);
  }
});

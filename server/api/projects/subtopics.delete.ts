import { prisma } from "../../utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { id } = body;

    if (!id) return sendError(event, serverT(event, "server.subtopicIdIsRequired"), 400);

    await prisma.subtopic.delete({ where: { id } });

    return sendSuccess(event, { deleted: true });
  } catch (error) {
    console.error("Error deleting subtopic:", error);
    return sendError(event, serverT(event, "server.failedToDeleteSubtopic"), 500);
  }
});

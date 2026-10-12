import { prisma } from "../../utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { id } = body;

    if (!id) return sendError(event, serverT(event, "server.topicIdIsRequired"), 400);

    await prisma.topic.delete({ where: { id } });

    return sendSuccess(event, { deleted: true });
  } catch (error) {
    console.error("Error deleting topic:", error);
    return sendError(event, serverT(event, "server.failedToDeleteTopic"), 500);
  }
});

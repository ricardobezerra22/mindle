import { prisma } from "../../utils/prisma";
import { getAuthUser } from "../../utils/auth";

export default defineEventHandler(async (event) => {
  try {
    const userId = await getAuthUser(event);
    if (!userId) {
      return sendError(event, serverT(event, "server.unauthorized"), 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, createdAt: true, emailNotifications: true },
    });

    if (!user) {
      return sendError(event, serverT(event, "server.userNotFound"), 404);
    }

    return sendSuccess(event, user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return sendError(event, serverT(event, "server.userFetchError"), 500);
  }
});

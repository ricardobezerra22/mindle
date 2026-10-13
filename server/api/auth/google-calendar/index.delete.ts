import { requireAuth } from "../../../utils/auth";
import { prisma } from "../../../utils/prisma";

export default defineEventHandler(async (event) => {
  const userId = await requireAuth(event);

  await prisma.user.update({
    where: { id: userId },
    data: {
      googleAccessToken: null,
      googleRefreshToken: null,
      googleTokenExpiresAt: null,
      calendarConnected: false,
    },
  });

  await prisma.calendarEvent.deleteMany({
    where: { userId },
  });

  return sendSuccess(event, { disconnected: true });
});

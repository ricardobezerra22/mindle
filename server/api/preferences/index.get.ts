import { prisma } from "../../utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const userId = event.context.userId;

    let prefs = await prisma.userPreferences.findUnique({
      where: { userId },
    });

    if (!prefs) {
      prefs = await prisma.userPreferences.create({
        data: { userId, palette: "contrastful" },
      });
    }

    return sendSuccess(event, { ...prefs, palette: prefs.palette ?? "classic" });
  } catch (error) {
    console.error("Error fetching preferences:", error);
    return sendError(event, serverT(event, "server.preferencesFetchError"), 500);
  }
});

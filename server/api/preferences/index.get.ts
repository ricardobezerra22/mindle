import { prisma } from "../../utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const userId = event.context.userId;

    let prefs = await prisma.userPreferences.findUnique({
      where: { userId },
    });

    if (!prefs) {
      prefs = await prisma.userPreferences.create({
        data: { userId },
      });
    }

    return sendSuccess(event, prefs);
  } catch (error) {
    console.error("Error fetching preferences:", error);
    return sendError(event, "Erro ao buscar preferências", 500);
  }
});

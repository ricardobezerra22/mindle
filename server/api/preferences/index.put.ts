import { prisma } from "../../utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const userId = event.context.userId;
    const body = await readBody(event);

    const {
      focusDuration,
      autoBreak,
      focusSound,
      weekStart,
      showOnlyToday,
      showCompleted,
      dailyReminder,
      showInsights,
      financeReminder,
      autoArchivePaid,
      theme,
      reducedMotion,
      fontSize,
    } = body;

    const prefs = await prisma.userPreferences.upsert({
      where: { userId },
      update: {
        focusDuration,
        autoBreak,
        focusSound,
        weekStart,
        showOnlyToday,
        showCompleted,
        dailyReminder,
        showInsights,
        financeReminder,
        autoArchivePaid,
        theme,
        reducedMotion,
        fontSize,
      },
      create: {
        userId,
        focusDuration,
        autoBreak,
        focusSound,
        weekStart,
        showOnlyToday,
        showCompleted,
        dailyReminder,
        showInsights,
        financeReminder,
        autoArchivePaid,
        theme,
        reducedMotion,
        fontSize,
      },
    });

    return sendSuccess(event, prefs);
  } catch (error) {
    console.error("Error saving preferences:", error);
    return sendError(event, "Erro ao salvar preferências", 500);
  }
});

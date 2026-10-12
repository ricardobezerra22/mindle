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
      palette,
    } = body;

    const validPalette = ["classic", "contrastful"].includes(palette)
      ? palette
      : undefined;

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
        palette: validPalette,
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
        palette: validPalette ?? "contrastful",
      },
    });

    return sendSuccess(event, { ...prefs, palette: prefs.palette ?? "classic" });
  } catch (error) {
    console.error("Error saving preferences:", error);
    return sendError(event, serverT(event, "server.preferencesSaveError"), 500);
  }
});

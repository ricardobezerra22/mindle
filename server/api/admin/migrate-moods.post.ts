import { prisma } from "../../utils/prisma";

const MOOD_MAP: Record<string, string> = {
  happy: "HAPPY",
  calmly: "CALMLY",
  ok: "OK",
  sad: "SAD",
  tired: "TIRED",
  overwhelmed: "OVERWHELMED",
};

export default defineEventHandler(async (event) => {
  try {
    const userId = event.context.userId;
    if (!userId) {
      return sendError(event, "Unauthorized", 401);
    }

    let updatedCount = 0;

    for (const [oldValue, newValue] of Object.entries(MOOD_MAP)) {
      const result = await prisma.$runCommandRaw({
        update: "DailyMood",
        updates: [
          {
            q: { mood: oldValue },
            u: { $set: { mood: newValue } },
            multi: true,
          },
        ],
      });

      const modified = (result as any)?.nModified ?? 0;
      updatedCount += modified;
    }

    return sendSuccess(event, {
      message: `Migration complete. Updated ${updatedCount} mood records.`,
      updatedCount,
    });
  } catch (error) {
    console.error("Mood migration error:", error);
    return sendError(event, "Migration failed", 500);
  }
});

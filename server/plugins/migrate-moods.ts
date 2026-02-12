import { prisma } from "../utils/prisma";

const MOOD_MAP: Record<string, string> = {
  happy: "HAPPY",
  calmly: "CALMLY",
  ok: "OK",
  sad: "SAD",
  tired: "TIRED",
  overwhelmed: "OVERWHELMED",
};

export default defineNitroPlugin(async () => {
  try {
    let totalUpdated = 0;

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
      totalUpdated += modified;
    }

    if (totalUpdated > 0) {
      console.log(`[migrate-moods] Migrated ${totalUpdated} mood records to uppercase enum values.`);
    }
  } catch (e) {
    console.error("[migrate-moods] Migration failed:", e);
  }
});

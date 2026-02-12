import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const MOOD_MAP: Record<string, string> = {
  happy: "HAPPY",
  calmly: "CALMLY",
  ok: "OK",
  sad: "SAD",
  tired: "TIRED",
  overwhelmed: "OVERWHELMED",
};

async function main() {
  console.log("Starting mood migration...");

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
    if (modified > 0) {
      console.log(`  ${oldValue} → ${newValue}: ${modified} records`);
    }
    totalUpdated += modified;
  }

  console.log(`Migration complete. Updated ${totalUpdated} records.`);
}

main()
  .catch((e) => {
    console.error("Migration failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

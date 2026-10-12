import { prisma } from "../../utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const userId = event.context.userId;

    const body = await readBody(event);
    const { mood, energy } = body;

    if (!mood) {
      return sendError(event, serverT(event, "server.moodIsRequired"), 400);
    }

    const validMoods = ["HAPPY", "CALMLY", "OK", "SAD", "TIRED", "OVERWHELMED"];
    if (!validMoods.includes(mood)) {
      return sendError(event, serverT(event, "server.invalidMoodValue"), 400);
    }

    const validEnergy = ["LOW", "MEDIUM", "HIGH"];
    if (energy && !validEnergy.includes(energy)) {
      return sendError(event, serverT(event, "server.invalidEnergyValue"), 400);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingMood = await prisma.dailyMood.findFirst({
      where: {
        userId,
        date: {
          gte: today,
        },
      },
    });

    if (existingMood) {
      const updated = await prisma.dailyMood.update({
        where: { id: existingMood.id },
        data: {
          mood,
          ...(energy !== undefined && { energy }),
        },
      });
      return sendSuccess(event, updated);
    }

    const newMood = await prisma.dailyMood.create({
      data: {
        userId,
        mood,
        ...(energy && { energy }),
        date: new Date(),
      },
    });

    return sendSuccess(event, newMood);
  } catch (error) {
    console.error("Error saving mood:", error);
    return sendError(event, serverT(event, "server.failedToSaveMood"), 500);
  }
});

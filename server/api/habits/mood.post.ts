import { prisma } from "../../utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const userId = event.context.userId;

    const body = await readBody(event);
    const { mood } = body;

    if (!mood) {
      return sendError(event, "Mood is required", 400);
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
        data: { mood },
      });
      return sendSuccess(event, updated);
    }

    const newMood = await prisma.dailyMood.create({
      data: {
        userId,
        mood,
        date: new Date(),
      },
    });

    return sendSuccess(event, newMood);
  } catch (error) {
    console.error("Error saving mood:", error);
    return sendError(event, "Failed to save mood", 500);
  }
});

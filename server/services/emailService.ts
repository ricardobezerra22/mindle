import { getResend } from "../utils/resend";
import { prisma } from "../utils/prisma";
import {
  buildDailySubject,
  dailyTrackingTemplate,
  welcomeTemplate,
} from "../utils/emails";

const FROM = "Ricardo <noreply@mindle.space>";

export const sendWelcomeEmail = async (
  userId: string,
  email: string,
  name: string,
) => {
  try {
    const resend = getResend();

    await resend.emails.send({
      from: FROM,
      to: email,
      subject: `Bem-vindo ao Mindle, ${name}! 🌿`,
      html: welcomeTemplate(name),
    });

    await prisma.user.update({
      where: { id: userId },
      data: { welcomeEmailSent: true },
    });

    console.log(`Welcome email sent to ${email}`);
  } catch (error) {
    console.error(`Failed to send welcome email to ${email}:`, error);
  }
};

export const sendDailyTrackingEmail = async (userId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true, emailNotifications: true },
    });

    if (!user || !user.emailNotifications) return;

    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const endOfToday = new Date(startOfToday.getTime() + 86400000);

    const [
      pendingTasks,
      dueTodayTasks,
      overdueTasks,
      activeGoals,
      goalAtRisk,
      habits,
      yesterdayLogs,
    ] = await Promise.all([
      prisma.task.count({
        where: { userId, status: { not: "DONE" } },
      }),
      prisma.task.count({
        where: {
          userId,
          status: { not: "DONE" },
          dueDate: { gte: startOfToday, lt: endOfToday },
        },
      }),
      prisma.task.count({
        where: {
          userId,
          status: { not: "DONE" },
          dueDate: { lt: startOfToday },
        },
      }),
      prisma.goal.count({
        where: { userId, status: "IN_PROGRESS", archived: false },
      }),
      prisma.goal.count({
        where: { userId, status: "AT_RISK", archived: false },
      }),
      prisma.habit.count({ where: { userId } }),
      prisma.habitLog.count({
        where: {
          userId,
          done: true,
          date: {
            gte: new Date(startOfToday.getTime() - 86400000),
            lt: startOfToday,
          },
        },
      }),
    ]);

    const hasContent = pendingTasks > 0 || activeGoals > 0 || habits > 0;
    if (!hasContent) return;

    const resend = getResend();

    await resend.emails.send({
      from: FROM,
      to: user.email,
      subject: buildDailySubject(overdueTasks, dueTodayTasks, pendingTasks),
      html: dailyTrackingTemplate({
        name: user.name,
        pendingTasks,
        dueTodayTasks,
        overdueTasks,
        activeGoals,
        goalAtRisk,
        streakHabits: yesterdayLogs,
        totalHabits: habits,
      }),
    });

    console.log(`Daily tracking email sent to ${user.email}`);
  } catch (error) {
    console.error(
      `Failed to send daily tracking email for user ${userId}:`,
      error,
    );
  }
};

export const sendDailyTrackingToAll = async () => {
  const users = await prisma.user.findMany({
    where: {
      isActive: true,
      emailNotifications: true,
    },
    select: { id: true },
  });

  console.log(`Sending daily tracking emails to ${users.length} users`);

  for (const user of users) {
    await sendDailyTrackingEmail(user.id);
  }

  return { sent: users.length };
};

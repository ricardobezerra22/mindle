import { prisma } from "../utils/prisma";

interface DateRange {
  startDate: Date;
  endDate: Date;
}

interface PreviousRange {
  startDate: Date;
  endDate: Date;
}

const getPreviousRange = (range: DateRange): PreviousRange => {
  const diff = range.endDate.getTime() - range.startDate.getTime();
  return {
    startDate: new Date(range.startDate.getTime() - diff),
    endDate: new Date(range.startDate.getTime()),
  };
};

const getFocusMetrics = async (userId: string, range: DateRange) => {
  const sessions = await prisma.focusSession.findMany({
    where: {
      userId,
      date: { gte: range.startDate, lte: range.endDate },
    },
    include: { task: { select: { id: true, title: true } } },
  });

  const prev = getPreviousRange(range);
  const prevSessions = await prisma.focusSession.findMany({
    where: {
      userId,
      date: { gte: prev.startDate, lte: prev.endDate },
    },
    select: { elapsed: true },
  });

  const totalMinutes = sessions.reduce((sum, s) => sum + s.elapsed, 0);
  const prevTotalMinutes = prevSessions.reduce((sum, s) => sum + s.elapsed, 0);

  const days = Math.max(1, Math.ceil((range.endDate.getTime() - range.startDate.getTime()) / 86400000));
  const avgDaily = Math.round(totalMinutes / days);

  const totalDuration = sessions.reduce((sum, s) => sum + s.duration, 0);
  const completionRate = totalDuration > 0 ? Math.round((totalMinutes / totalDuration) * 100) : 0;

  const taskFocusMap = new Map<string, { title: string; minutes: number }>();
  for (const s of sessions) {
    if (s.task) {
      const existing = taskFocusMap.get(s.task.id);
      if (existing) {
        existing.minutes += s.elapsed;
      } else {
        taskFocusMap.set(s.task.id, { title: s.task.title, minutes: s.elapsed });
      }
    }
  }

  let topTask: { title: string; minutes: number } | null = null;
  for (const entry of taskFocusMap.values()) {
    if (!topTask || entry.minutes > topTask.minutes) {
      topTask = entry;
    }
  }

  const growth = prevTotalMinutes > 0
    ? Math.round(((totalMinutes - prevTotalMinutes) / prevTotalMinutes) * 100)
    : totalMinutes > 0 ? 100 : 0;

  const dailyData = new Map<string, number>();
  for (const s of sessions) {
    const key = s.date.toISOString().split("T")[0];
    dailyData.set(key, (dailyData.get(key) || 0) + s.elapsed);
  }

  return {
    totalMinutes,
    avgDaily,
    completionRate,
    topTask,
    growth,
    sessionCount: sessions.length,
    dailyData: Object.fromEntries(dailyData),
  };
};

const getTaskMetrics = async (userId: string, range: DateRange) => {
  const tasks = await prisma.task.findMany({
    where: {
      userId,
      createdAt: { gte: range.startDate, lte: range.endDate },
    },
    select: {
      id: true,
      status: true,
      priority: true,
      timeSpent: true,
      isFavorite: true,
      createdAt: true,
    },
  });

  const allTasks = await prisma.task.findMany({
    where: { userId, status: "DONE" },
    select: { createdAt: true },
  });

  const completedInPeriod = allTasks.filter(
    t => t.createdAt >= range.startDate && t.createdAt <= range.endDate,
  );

  const total = tasks.length;
  const done = tasks.filter(t => t.status === "DONE").length;
  const completionRate = total > 0 ? Math.round((done / total) * 100) : 0;
  const totalTimeSpent = tasks.reduce((sum, t) => sum + t.timeSpent, 0);

  const byPriority = {
    HIGH: { total: 0, done: 0 },
    MEDIUM: { total: 0, done: 0 },
    LOW: { total: 0, done: 0 },
  };

  for (const t of tasks) {
    const p = t.priority as keyof typeof byPriority;
    if (byPriority[p]) {
      byPriority[p].total++;
      if (t.status === "DONE") byPriority[p].done++;
    }
  }

  const favoriteDone = tasks.filter(t => t.isFavorite && t.status === "DONE").length;

  const prev = getPreviousRange(range);
  const prevTasks = await prisma.task.count({
    where: {
      userId,
      createdAt: { gte: prev.startDate, lte: prev.endDate },
    },
  });

  const growth = prevTasks > 0
    ? Math.round(((total - prevTasks) / prevTasks) * 100)
    : total > 0 ? 100 : 0;

  const dailyCreated = new Map<string, number>();
  const dailyDone = new Map<string, number>();
  for (const t of tasks) {
    const key = t.createdAt.toISOString().split("T")[0];
    dailyCreated.set(key, (dailyCreated.get(key) || 0) + 1);
    if (t.status === "DONE") {
      dailyDone.set(key, (dailyDone.get(key) || 0) + 1);
    }
  }

  return {
    total,
    done,
    completionRate,
    totalTimeSpent,
    byPriority,
    favoriteDone,
    growth,
    dailyCreated: Object.fromEntries(dailyCreated),
    dailyDone: Object.fromEntries(dailyDone),
  };
};

const getProjectMetrics = async (userId: string, _range: DateRange) => {
  const projects = await prisma.project.findMany({
    where: { userId },
    include: {
      category: { select: { name: true, color: true } },
      topics: {
        include: {
          subtopics: {
            include: {
              tasks: { select: { done: true } },
            },
          },
        },
      },
    },
  });

  const active = projects.filter(p => !p.archived);
  const archived = projects.filter(p => p.archived);

  const projectProgress = projects.map(p => {
    let totalTasks = 0;
    let doneTasks = 0;
    for (const topic of p.topics) {
      for (const sub of topic.subtopics) {
        totalTasks += sub.tasks.length;
        doneTasks += sub.tasks.filter(t => t.done).length;
      }
    }
    const progress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;
    return {
      id: p.id,
      title: p.title,
      category: p.category,
      totalTasks,
      doneTasks,
      progress,
      updatedAt: p.updatedAt,
    };
  });

  const avgProgress = projectProgress.length > 0
    ? Math.round(projectProgress.reduce((sum, p) => sum + p.progress, 0) / projectProgress.length)
    : 0;

  const topProject = projectProgress.reduce(
    (best, p) => (!best || p.progress > best.progress ? p : best),
    null as (typeof projectProgress)[0] | null,
  );

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 14);
  const stale = projectProgress.filter(
    p => new Date(p.updatedAt) < oneWeekAgo && p.progress < 100,
  );

  return {
    activeCount: active.length,
    archivedCount: archived.length,
    avgProgress,
    topProject,
    staleProjects: stale.map(p => ({ id: p.id, title: p.title, progress: p.progress })),
    projectProgress: projectProgress.slice(0, 10),
  };
};

const getPlannerMetrics = async (userId: string, range: DateRange) => {
  const entries = await prisma.plannerEntry.findMany({
    where: {
      userId,
      date: { gte: range.startDate, lte: range.endDate },
    },
    include: {
      task: { select: { status: true } },
    },
  });

  const planned = entries.length;
  const executed = entries.filter(e => e.task?.status === "DONE").length;
  const executionRate = planned > 0 ? Math.round((executed / planned) * 100) : 0;

  const dayMap = new Map<number, { planned: number; done: number }>();
  for (const e of entries) {
    const day = new Date(e.date).getDay();
    const existing = dayMap.get(day) || { planned: 0, done: 0 };
    existing.planned++;
    if (e.task?.status === "DONE") existing.done++;
    dayMap.set(day, existing);
  }

  const dayLabels = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const byWeekday = dayLabels.map((label, i) => ({
    label,
    planned: dayMap.get(i)?.planned || 0,
    done: dayMap.get(i)?.done || 0,
  }));

  return { planned, executed, executionRate, byWeekday };
};

const getHabitMetrics = async (userId: string, range: DateRange) => {
  const habits = await prisma.habit.findMany({
    where: { userId },
    select: { id: true, title: true, icon: true },
  });

  const logs = await prisma.habitLog.findMany({
    where: {
      userId,
      date: { gte: range.startDate, lte: range.endDate },
      done: true,
    },
    select: { habitId: true, date: true },
  });

  const days = Math.max(1, Math.ceil((range.endDate.getTime() - range.startDate.getTime()) / 86400000));

  const habitStats = habits.map(h => {
    const habitLogs = logs.filter(l => l.habitId === h.id);
    const consistency = Math.round((habitLogs.length / days) * 100);

    const logDates = habitLogs
      .map(l => l.date.toISOString().split("T")[0])
      .sort();

    let streak = 0;
    let maxStreak = 0;
    const today = new Date();
    for (let i = 0; i < days; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split("T")[0];
      if (logDates.includes(key)) {
        streak++;
        maxStreak = Math.max(maxStreak, streak);
      } else {
        if (i === 0) continue;
        streak = 0;
      }
    }

    return {
      id: h.id,
      title: h.title,
      icon: h.icon,
      logCount: habitLogs.length,
      consistency,
      streak: maxStreak,
    };
  });

  const avgConsistency = habitStats.length > 0
    ? Math.round(habitStats.reduce((sum, h) => sum + h.consistency, 0) / habitStats.length)
    : 0;

  const best = habitStats.reduce(
    (b, h) => (!b || h.consistency > b.consistency ? h : b),
    null as (typeof habitStats)[0] | null,
  );

  const neglected = habitStats.reduce(
    (b, h) => (!b || h.consistency < b.consistency ? h : b),
    null as (typeof habitStats)[0] | null,
  );

  return { avgConsistency, best, neglected, habits: habitStats };
};

const getFinanceMetrics = async (userId: string, range: DateRange) => {
  const entries = await prisma.financeEntry.findMany({
    where: {
      userId,
      createdAt: { gte: range.startDate, lte: range.endDate },
    },
    select: {
      amount: true,
      status: true,
      category: true,
      dueDate: true,
    },
  });

  const totalAmount = entries.reduce((sum, e) => sum + e.amount, 0);
  const paid = entries.filter(e => e.status === "PAID");
  const pending = entries.filter(e => e.status === "PENDING");
  const notStarted = entries.filter(e => e.status === "NOT_STARTED");

  const totalPaid = paid.reduce((sum, e) => sum + e.amount, 0);
  const totalPending = pending.reduce((sum, e) => sum + e.amount, 0) + notStarted.reduce((sum, e) => sum + e.amount, 0);

  const onTimeRate = entries.length > 0
    ? Math.round((paid.length / entries.length) * 100)
    : 0;

  const now = new Date();
  const overdue = entries.filter(
    e => e.status !== "PAID" && e.dueDate && new Date(e.dueDate) < now,
  ).length;

  const categoryMap = new Map<string, { total: number; paid: number; pending: number }>();
  for (const e of entries) {
    const cat = e.category || "Sem categoria";
    const existing = categoryMap.get(cat) || { total: 0, paid: 0, pending: 0 };
    existing.total += e.amount;
    if (e.status === "PAID") existing.paid += e.amount;
    else existing.pending += e.amount;
    categoryMap.set(cat, existing);
  }

  return {
    totalAmount,
    totalPaid,
    totalPending,
    onTimeRate,
    overdue,
    entryCount: entries.length,
    paidCount: paid.length,
    pendingCount: pending.length + notStarted.length,
    byCategory: Object.fromEntries(categoryMap),
  };
};

const getMoodMetrics = async (userId: string, range: DateRange) => {
  const moods = await prisma.dailyMood.findMany({
    where: {
      userId,
      date: { gte: range.startDate, lte: range.endDate },
    },
    select: { mood: true, energy: true, date: true },
    orderBy: { date: "asc" },
  });

  const habitLogs = await prisma.habitLog.findMany({
    where: {
      userId,
      date: { gte: range.startDate, lte: range.endDate },
      done: true,
    },
    select: { date: true },
  });

  const totalHabits = await prisma.habit.count({ where: { userId } });

  const distribution = new Map<string, number>();
  const energyDistribution = new Map<string, number>();
  const moodHabitMap = new Map<string, { totalDays: number; totalRate: number }>();

  for (const m of moods) {
    distribution.set(m.mood, (distribution.get(m.mood) || 0) + 1);
    if (m.energy) {
      energyDistribution.set(m.energy, (energyDistribution.get(m.energy) || 0) + 1);
    }

    const dayStr = m.date.toISOString().split("T")[0];
    const logsForDay = habitLogs.filter(
      l => l.date.toISOString().split("T")[0] === dayStr,
    ).length;
    const dayRate = totalHabits > 0 ? Math.round((logsForDay / totalHabits) * 100) : 0;

    const entry = moodHabitMap.get(m.mood) || { totalDays: 0, totalRate: 0 };
    entry.totalDays++;
    entry.totalRate += dayRate;
    moodHabitMap.set(m.mood, entry);
  }

  const moodHabitCorrelation: Record<string, number> = {};
  for (const [mood, data] of moodHabitMap) {
    moodHabitCorrelation[mood] = data.totalDays > 0
      ? Math.round(data.totalRate / data.totalDays)
      : 0;
  }

  const dailyMoods = moods.map(m => ({
    date: m.date.toISOString().split("T")[0],
    mood: m.mood,
    energy: m.energy || null,
  }));

  return {
    total: moods.length,
    distribution: Object.fromEntries(distribution),
    energyDistribution: Object.fromEntries(energyDistribution),
    moodHabitCorrelation,
    dailyMoods,
  };
};

export const getDashboardMetrics = async (userId: string, startDate: Date, endDate: Date) => {
  const range: DateRange = { startDate, endDate };

  const [focus, tasks, projects, planner, habits, finance, mood] = await Promise.all([
    getFocusMetrics(userId, range),
    getTaskMetrics(userId, range),
    getProjectMetrics(userId, range),
    getPlannerMetrics(userId, range),
    getHabitMetrics(userId, range),
    getFinanceMetrics(userId, range),
    getMoodMetrics(userId, range),
  ]);

  return { focus, tasks, projects, planner, habits, finance, mood };
};

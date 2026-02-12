import { prisma } from "../utils/prisma";

interface GoalInput {
  title: string;
  description?: string;
  color?: string;
  deadline?: string;
}

interface GoalUpdateInput extends Partial<GoalInput> {
  status?: "IN_PROGRESS" | "DONE";
  archived?: boolean;
  position?: number;
}

const deepProjectInclude = {
  category: true,
  tasks: true,
  topics: {
    include: {
      tasks: true,
      subtopics: {
        include: {
          tasks: true,
        },
      },
    },
  },
};

const computeProjectProgress = (project: any) => {
  let total = 0;
  let done = 0;

  for (const task of project.tasks || []) {
    total++;
    if (task.done) done++;
  }

  for (const topic of project.topics || []) {
    for (const task of topic.tasks || []) {
      total++;
      if (task.done) done++;
    }
    for (const subtopic of topic.subtopics || []) {
      for (const task of subtopic.tasks || []) {
        total++;
        if (task.done) done++;
      }
    }
  }

  return { total, done, progress: total > 0 ? Math.round((done / total) * 100) : 0 };
};

const computeGoalProgress = (projects: any[]) => {
  let weightedSum = 0;
  let totalWeight = 0;
  let totalTasks = 0;
  let completedTasks = 0;
  let lastActivity: Date | undefined;

  for (const project of projects) {
    const weight = project.weight || 1;
    const stats = computeProjectProgress(project);
    weightedSum += stats.progress * weight;
    totalWeight += weight;
    totalTasks += stats.total;
    completedTasks += stats.done;

    const projectDate = new Date(project.updatedAt);
    if (!lastActivity || projectDate > lastActivity) {
      lastActivity = projectDate;
    }
  }

  const progress = totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;

  return { progress, totalTasks, completedTasks, lastActivity };
};

const computeClarityScore = (goal: any) => {
  let score = 0;
  const maxScore = 4;

  if (goal.deadline) score++;
  if (goal.projects && goal.projects.length > 0) score++;

  const hasTasks = goal.projects?.some((p: any) => {
    if (p.tasks && p.tasks.length > 0) return true;
    return p.topics?.some((t: any) => {
      if (t.tasks && t.tasks.length > 0) return true;
      return t.subtopics?.some((s: any) => s.tasks && s.tasks.length > 0);
    });
  });
  if (hasTasks) score++;

  const { lastActivity } = computeGoalProgress(goal.projects || []);
  if (lastActivity) {
    const daysSince = Math.floor((Date.now() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));
    if (daysSince <= 7) score++;
  }

  return Math.round((score / maxScore) * 100);
};

const enrichGoal = (goal: any) => {
  const projects = goal.projects || [];
  const { progress, totalTasks, completedTasks, lastActivity } = computeGoalProgress(projects);
  const clarityScore = computeClarityScore(goal);

  return {
    ...goal,
    progress,
    totalTasks,
    completedTasks,
    projectCount: projects.length,
    clarityScore,
    lastActivity,
  };
};

export const getAllGoals = async (userId: string) => {
  const goals = await prisma.goal.findMany({
    where: { userId },
    include: {
      projects: {
        include: deepProjectInclude,
      },
    },
    orderBy: [{ position: "asc" }, { createdAt: "desc" }],
  });

  return goals.map(enrichGoal);
};

export const getGoalById = async (goalId: string, userId: string) => {
  const goal = await prisma.goal.findFirst({
    where: { id: goalId, userId },
    include: {
      projects: {
        include: deepProjectInclude,
        orderBy: { position: "asc" },
      },
    },
  });

  if (!goal) return null;
  return enrichGoal(goal);
};

export const createGoal = async (userId: string, input: GoalInput) => {
  const count = await prisma.goal.count({ where: { userId } });

  const goal = await prisma.goal.create({
    data: {
      title: input.title,
      description: input.description,
      color: input.color,
      deadline: input.deadline ? new Date(input.deadline) : undefined,
      position: count,
      userId,
    },
    include: {
      projects: {
        include: deepProjectInclude,
      },
    },
  });

  return enrichGoal(goal);
};

export const updateGoal = async (goalId: string, userId: string, input: GoalUpdateInput) => {
  const existing = await prisma.goal.findFirst({ where: { id: goalId, userId } });
  if (!existing) return null;

  const data: any = {};
  if (input.title !== undefined) data.title = input.title;
  if (input.description !== undefined) data.description = input.description;
  if (input.color !== undefined) data.color = input.color;
  if (input.status !== undefined) data.status = input.status;
  if (input.deadline !== undefined) data.deadline = input.deadline ? new Date(input.deadline) : null;
  if (input.archived !== undefined) data.archived = input.archived;
  if (input.position !== undefined) data.position = input.position;

  const goal = await prisma.goal.update({
    where: { id: goalId },
    data,
    include: {
      projects: {
        include: deepProjectInclude,
      },
    },
  });

  return enrichGoal(goal);
};

export const deleteGoal = async (goalId: string, userId: string) => {
  const existing = await prisma.goal.findFirst({ where: { id: goalId, userId } });
  if (!existing) return false;

  await prisma.project.updateMany({
    where: { goalId },
    data: { goalId: null },
  });

  await prisma.goal.delete({ where: { id: goalId } });
  return true;
};

export const linkProjectToGoal = async (goalId: string, projectId: string, userId: string) => {
  const goal = await prisma.goal.findFirst({ where: { id: goalId, userId } });
  if (!goal) return null;

  const project = await prisma.project.findFirst({ where: { id: projectId, userId } });
  if (!project) return null;

  return prisma.project.update({
    where: { id: projectId },
    data: { goalId },
    include: { category: true },
  });
};

export const unlinkProjectFromGoal = async (projectId: string, userId: string) => {
  const project = await prisma.project.findFirst({ where: { id: projectId, userId } });
  if (!project) return null;

  return prisma.project.update({
    where: { id: projectId },
    data: { goalId: null },
    include: { category: true },
  });
};

export const getProjectContribution = (project: any, allProjects: any[]) => {
  const projectWeight = project.weight || 1;
  const totalWeight = allProjects.reduce((sum: number, p: any) => sum + (p.weight || 1), 0);
  const contributionPercent = totalWeight > 0 ? Math.round((projectWeight / totalWeight) * 100) : 0;
  const stats = computeProjectProgress(project);

  return {
    projectId: project.id,
    title: project.title,
    weight: projectWeight,
    contributionPercent,
    ...stats,
  };
};

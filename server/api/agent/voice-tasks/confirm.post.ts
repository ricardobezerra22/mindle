import { prisma } from "../../../utils/prisma";
import { sanitizeInput, sessionCache } from "../../../services/agentService";
import type { PreviewTask, NewCategory, PreviewSubTask } from "../../../../app/types/index";
import { Priority, TaskStatus } from "../../../../app/types/index";

const VALID_PRIORITIES = new Set<string>(Object.values(Priority));
const MAX_TITLE = 500;
const MAX_DESC = 2000;
const MAX_SUBTASKS = 20;
const PALETTE = [
  "#6faf8e", "#7eb5d6", "#e88c8c", "#f0c27f", "#a78bfa",
  "#34d399", "#fb923c", "#60a5fa", "#f472b6", "#a3e635",
  "#38bdf8", "#c084fc",
];

function stripHtml(s: string): string {
  return s.replace(/<\/?[a-z][^>]*>/gi, "").trim();
}

function isValidDate(s: string): boolean {
  return !isNaN(new Date(s).getTime());
}

export default defineEventHandler(async (event) => {
  const userId = event.context.userId;
  const body = await readBody(event);
  const tasks: unknown = body?.tasks;
  const newCategoriesRaw: unknown = body?.newCategories;

  const clientSessionId: string | undefined = typeof body?.sessionId === "string" ? body.sessionId : undefined;
  const cachedSession = clientSessionId ? sessionCache.get(clientSessionId) : undefined;
  let sessionId: string;
  if (cachedSession && cachedSession.userId === userId && Date.now() < cachedSession.expiresAt) {
    sessionCache.delete(clientSessionId!);
    sessionId = clientSessionId!;
  } else {
    sessionId = crypto.randomUUID();
  }

  if (!Array.isArray(tasks) || tasks.length === 0) {
    return sendError(event, "tasks array is required", 400);
  }
  if (tasks.length > 50) {
    return sendError(event, "Máximo de 50 tarefas por vez", 400);
  }

  const incomingTitles = (tasks as PreviewTask[])
    .map(t => String(t.title ?? "").trim().toLowerCase())
    .filter(Boolean);
  const duplicateInBatch = incomingTitles.find(
    (t, i) => incomingTitles.indexOf(t) !== i,
  );
  if (duplicateInBatch) {
    return sendError(event, `Títulos duplicados na lista: "${duplicateInBatch}"`, 400);
  }

  const existingTitles = await prisma.task.findMany({
    where: { userId, title: { in: (tasks as PreviewTask[]).map(t => String(t.title ?? "").trim()) } },
    select: { title: true },
  });
  if (existingTitles.length > 0) {
    return sendError(event, `Já existe uma tarefa com o título: "${existingTitles[0]!.title}"`, 409);
  }

  const existingCategories = await prisma.taskCategory.findMany({
    where: { userId },
    select: { id: true, name: true, color: true },
  });
  const existingCategoryIds = new Set(existingCategories.map(c => c.id));
  const usedColors = new Set(existingCategories.map(c => c.color));

  const newCategoriesInput: NewCategory[] = Array.isArray(newCategoriesRaw)
    ? (newCategoriesRaw as NewCategory[]).filter(
        c => c && typeof c.name === "string" && c.name.trim(),
      )
    : [];

  function pickColor(): string {
    for (const color of PALETTE) {
      if (!usedColors.has(color)) {
        usedColors.add(color);
        return color;
      }
    }
    return PALETTE[Math.floor(Math.random() * PALETTE.length)]!;
  }

  let catError: string | null = null;

  let created: Awaited<ReturnType<typeof prisma.task.findMany>>;
  try {
    created = await prisma.$transaction(async (tx) => {
      const nameToId = new Map<string, string>();

      for (const nc of newCategoriesInput) {
        const name = stripHtml(nc.name).slice(0, 50);
        if (!name) continue;
        const existing = existingCategories.find(
          c => c.name.toLowerCase() === name.toLowerCase(),
        );
        if (existing) {
          nameToId.set(name.toLowerCase(), existing.id);
        } else {
          const cat = await tx.taskCategory.create({
            data: { name, color: pickColor(), userId },
          });
          nameToId.set(name.toLowerCase(), cat.id);
          existingCategoryIds.add(cat.id);
        }
      }

      const results = [];
      let position = Date.now();

      for (const raw of tasks) {
        const t = raw as PreviewTask;

        const title = stripHtml(String(t.title ?? "")).slice(0, MAX_TITLE);
        if (!title) continue;

        const priority = VALID_PRIORITIES.has(t.priority) ? t.priority : Priority.MEDIUM;

        const description = t.description
          ? stripHtml(String(t.description)).slice(0, MAX_DESC)
          : undefined;

        const dueDate = t.dueDate && isValidDate(t.dueDate) ? new Date(t.dueDate) : undefined;

        let categoryId: string | undefined;
        if (t.categoryId && existingCategoryIds.has(t.categoryId)) {
          categoryId = t.categoryId;
        } else if (t.proposedCategoryName) {
          categoryId = nameToId.get(t.proposedCategoryName.toLowerCase());
        } else if (t.categoryName) {
          categoryId = nameToId.get(t.categoryName.toLowerCase());
        }

        if (!categoryId) {
          catError = `Tarefa "${title}" não tem categoria válida`;
          throw new Error("category_validation");
        }

        const task = await tx.task.create({
          data: {
            title,
            description,
            status: TaskStatus.NOT_STARTED,
            priority: priority as Priority,
            dueDate,
            categoryId,
            isFavorite: false,
            position: position++,
            userId,
          },
          include: { category: true, subTasks: true },
        });

        const rawSubTasks = Array.isArray(t.subTasks) ? (t.subTasks as PreviewSubTask[]) : [];
        if (rawSubTasks.length > 0) {
          await tx.subTask.createMany({
            data: rawSubTasks
              .slice(0, MAX_SUBTASKS)
              .map(s => sanitizeInput(stripHtml(String(s.title ?? ""))).slice(0, MAX_TITLE))
              .filter(Boolean)
              .map(stTitle => ({ title: stTitle, done: false, taskId: task.id })),
          });
        }

        results.push(task);
      }

      return results;
    });
  } catch (err) {
    if (catError) return sendError(event, catError, 400);
    throw err;
  }

  await prisma.agentAuditLog.create({
    data: {
      userId,
      sessionId,
      step: "confirm",
      action: "tasks_created",
      inputText: JSON.stringify({ taskCount: created.length, newCategoriesCount: newCategoriesInput.length }),
      outputJson: JSON.stringify({ createdIds: created.map(t => t.id) }),
    },
  }).catch(() => {});

  return sendSuccess(event, { tasks: created, count: created.length }, 201);
});

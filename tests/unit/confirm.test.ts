import { describe, it, expect, vi, beforeEach } from "vitest";

import { sessionCache } from "../../server/services/agentService";

const mockTx = vi.hoisted(() => ({
  taskCategory: { create: vi.fn() },
  task: { create: vi.fn() },
  subTask: { createMany: vi.fn() },
}));

const mockPrisma = vi.hoisted(() => ({
  task: { findMany: vi.fn() },
  taskCategory: { findMany: vi.fn() },
  agentAuditLog: { create: vi.fn().mockResolvedValue({}) },
  $transaction: vi.fn(),
}));

vi.mock("../../server/utils/prisma", () => ({ prisma: mockPrisma }));

vi.mock("../../server/services/agentService", () => {
  const sessionCache = new Map<string, { userId: string; expiresAt: number }>();
  return {
    sanitizeInput: (t: string) => t.trim(),
    sessionCache,
  };
});

async function loadHandler() {
  const mod = await import("../../server/api/agent/voice-tasks/confirm.post.ts");
  return mod.default as (event: unknown) => Promise<unknown>;
}

beforeEach(() => {
  vi.clearAllMocks();
  mockPrisma.task.findMany.mockResolvedValue([]);
  mockPrisma.taskCategory.findMany.mockResolvedValue([]);
  mockPrisma.agentAuditLog.create.mockResolvedValue({});
  mockTx.taskCategory.create.mockResolvedValue({ id: "new-cat-id" });
  mockTx.task.create.mockResolvedValue({ id: "t1", title: "Task", subTasks: [] });
  mockTx.subTask.createMany.mockResolvedValue({});
  mockPrisma.$transaction.mockImplementation((fn: (tx: typeof mockTx) => unknown) => fn(mockTx));
  vi.stubGlobal("readBody", vi.fn(async (event: { _body: unknown }) => event._body));
  vi.stubGlobal("crypto", { randomUUID: () => "test-uuid" });
});

const makeEvent = (body: unknown, userId = "u1") => ({ context: { userId }, _body: body });

describe("confirm handler", () => {
  it("returns 400 when tasks array is empty", async () => {
    const handler = await loadHandler();
    vi.stubGlobal("readBody", vi.fn().mockResolvedValue({ tasks: [] }));
    const res = await handler(makeEvent({ tasks: [] })) as { success: boolean; error: string };
    expect(res.success).toBe(false);
    expect(res.error).toContain("required");
  });

  it("returns 400 when tasks.length > 50", async () => {
    const handler = await loadHandler();
    const tasks = Array.from({ length: 51 }, (_, i) => ({ title: `Task ${i}`, categoryId: "c1" }));
    vi.stubGlobal("readBody", vi.fn().mockResolvedValue({ tasks }));
    const res = await handler(makeEvent({})) as { success: boolean; error: string };
    expect(res.success).toBe(false);
    expect(res.error).toContain("50");
  });

  it("returns 400 when a task has no valid category", async () => {
    const handler = await loadHandler();
    mockPrisma.taskCategory.findMany.mockResolvedValue([]);
    const task = { title: "No Cat Task", categoryId: null, proposedCategoryName: null };
    vi.stubGlobal("readBody", vi.fn().mockResolvedValue({ tasks: [task], newCategories: [] }));
    const res = await handler(makeEvent({})) as { success: boolean; error: string };
    expect(res.success).toBe(false);
    expect(res.error).toContain("No Cat Task");
  });

  it("creates task with existing categoryId and returns success", async () => {
    const handler = await loadHandler();
    mockPrisma.taskCategory.findMany.mockResolvedValue([{ id: "cat1", name: "Work", color: "#fff" }]);
    const task = { title: "My Task", categoryId: "cat1", priority: "HIGH" };
    vi.stubGlobal("readBody", vi.fn().mockResolvedValue({ tasks: [task], newCategories: [] }));
    mockPrisma.$transaction.mockImplementation(async (fn: (tx: typeof mockTx) => unknown) => {
      return [await fn(mockTx)];
    });
    const res = await handler(makeEvent({})) as { success: boolean; data: { count: number } };
    expect(res.success).toBe(true);
    expect(res.data.count).toBe(1);
  });

  it("slices subtasks at MAX_SUBTASKS (20)", async () => {
    const handler = await loadHandler();
    mockPrisma.taskCategory.findMany.mockResolvedValue([{ id: "cat1", name: "Work", color: "#fff" }]);
    const subTasks = Array.from({ length: 25 }, (_, i) => ({ title: `Sub ${i}` }));
    const task = { title: "Big Task", categoryId: "cat1", subTasks };
    vi.stubGlobal("readBody", vi.fn().mockResolvedValue({ tasks: [task], newCategories: [] }));
    mockPrisma.$transaction.mockImplementation(async (fn: (tx: typeof mockTx) => unknown) => {
      return [await fn(mockTx)];
    });
    await handler(makeEvent({}));
    const call = mockTx.subTask.createMany.mock.calls[0]?.[0] as { data: unknown[] } | undefined;
    expect(call?.data.length).toBeLessThanOrEqual(20);
  });

  it("uses valid sessionCache entry and deletes it", async () => {
    const handler = await loadHandler();
    mockPrisma.taskCategory.findMany.mockResolvedValue([{ id: "cat1", name: "Work", color: "#fff" }]);
    const sid = "valid-session";
    sessionCache.set(sid, { userId: "u1", expiresAt: Date.now() + 60_000 });
    const task = { title: "Sess Task", categoryId: "cat1" };
    vi.stubGlobal("readBody", vi.fn().mockResolvedValue({ tasks: [task], newCategories: [], sessionId: sid }));
    mockPrisma.$transaction.mockImplementation(async (fn: (tx: typeof mockTx) => unknown) => {
      return [await fn(mockTx)];
    });
    await handler(makeEvent({}));
    expect(sessionCache.has(sid)).toBe(false);
  });

  it("generates new UUID when sessionId userId doesn't match", async () => {
    const handler = await loadHandler();
    mockPrisma.taskCategory.findMany.mockResolvedValue([{ id: "cat1", name: "Work", color: "#fff" }]);
    const sid = "mismatched-session";
    sessionCache.set(sid, { userId: "other-user", expiresAt: Date.now() + 60_000 });
    const task = { title: "Task", categoryId: "cat1" };
    vi.stubGlobal("readBody", vi.fn().mockResolvedValue({ tasks: [task], newCategories: [], sessionId: sid }));
    mockPrisma.$transaction.mockImplementation(async (fn: (tx: typeof mockTx) => unknown) => {
      return [await fn(mockTx)];
    });
    const res = await handler(makeEvent({})) as { success: boolean };
    expect(res.success).toBe(true);
    expect(sessionCache.has(sid)).toBe(true);
    sessionCache.delete(sid);
  });

  it("resolves categoryId via proposedCategoryName (creates new category in tx)", async () => {
    const handler = await loadHandler();
    mockPrisma.taskCategory.findMany.mockResolvedValue([]);
    const task = { title: "Proposed Task", categoryId: null, proposedCategoryName: "Hobbies" };
    vi.stubGlobal("readBody", vi.fn().mockResolvedValue({ tasks: [task], newCategories: [{ name: "Hobbies", color: "#abc" }] }));
    mockTx.taskCategory.create.mockResolvedValue({ id: "hobby-id" });
    mockPrisma.$transaction.mockImplementation(async (fn: (tx: typeof mockTx) => unknown) => {
      return [await fn(mockTx)];
    });
    const res = await handler(makeEvent({})) as { success: boolean; data: { count: number } };
    expect(res.success).toBe(true);
    expect(mockTx.taskCategory.create).toHaveBeenCalled();
  });

  it("resolves categoryId via categoryName fallback", async () => {
    const handler = await loadHandler();
    mockPrisma.taskCategory.findMany.mockResolvedValue([]);
    const task = { title: "NameFallback Task", categoryId: null, proposedCategoryName: null, categoryName: "Fitness" };
    vi.stubGlobal("readBody", vi.fn().mockResolvedValue({ tasks: [task], newCategories: [{ name: "Fitness", color: "#abc" }] }));
    mockTx.taskCategory.create.mockResolvedValue({ id: "fitness-id" });
    mockPrisma.$transaction.mockImplementation(async (fn: (tx: typeof mockTx) => unknown) => {
      return [await fn(mockTx)];
    });
    const res = await handler(makeEvent({})) as { success: boolean; data: { count: number } };
    expect(res.success).toBe(true);
  });

  it("re-throws non-category transaction errors", async () => {
    const handler = await loadHandler();
    mockPrisma.taskCategory.findMany.mockResolvedValue([{ id: "cat1", name: "Work", color: "#fff" }]);
    const task = { title: "Boom", categoryId: "cat1" };
    vi.stubGlobal("readBody", vi.fn().mockResolvedValue({ tasks: [task], newCategories: [] }));
    mockPrisma.$transaction.mockRejectedValue(new Error("DB timeout"));
    await expect(handler(makeEvent({}))).rejects.toThrow("DB timeout");
  });
});

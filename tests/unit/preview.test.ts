import { describe, it, expect, vi, beforeEach } from "vitest";

import handler from "../../server/api/agent/voice-tasks/preview.post.ts";

const mockRunPreviewAgent = vi.hoisted(() => vi.fn());
const mockSessionCache = vi.hoisted(() => new Map<string, { userId: string; expiresAt: number }>());

vi.mock("../../server/services/agentService", () => ({
  runPreviewAgent: mockRunPreviewAgent,
  sanitizeInput: (t: string) => t.trim(),
  sessionCache: mockSessionCache,
}));

const makeEvent = (body: unknown, userId = "u1") => ({ context: { userId }, _body: body });

beforeEach(() => {
  vi.clearAllMocks();
  mockSessionCache.clear();
  vi.stubGlobal("readBody", vi.fn(async (event: { _body: unknown }) => event._body));
  vi.stubGlobal("crypto", { randomUUID: () => "preview-uuid" });
});

describe("preview handler", () => {
  it("returns 400 when text is missing", async () => {
    vi.stubGlobal("readBody", vi.fn().mockResolvedValue({}));
    const res = await handler(makeEvent({})) as { success: boolean; error: string };
    expect(res.success).toBe(false);
    expect(res.error).toContain("required");
  });

  it("returns 400 when text is not a string", async () => {
    vi.stubGlobal("readBody", vi.fn().mockResolvedValue({ text: 42 }));
    const res = await handler(makeEvent({ text: 42 })) as { success: boolean };
    expect(res.success).toBe(false);
  });

  it("returns 400 when sanitized text is empty (whitespace only)", async () => {
    vi.stubGlobal("readBody", vi.fn().mockResolvedValue({ text: "   " }));
    const res = await handler(makeEvent({ text: "   " })) as { success: boolean; error: string };
    expect(res.success).toBe(false);
    expect(res.error).toContain("inválido");
  });

  it("returns success with sessionId on valid input", async () => {
    const agentResult = { tasks: [], newCategories: [], summary: "ok" };
    mockRunPreviewAgent.mockResolvedValue(agentResult);
    vi.stubGlobal("readBody", vi.fn().mockResolvedValue({ text: "criar tarefa" }));
    const res = await handler(makeEvent({ text: "criar tarefa" })) as { success: boolean; data: { sessionId: string } };
    expect(res.success).toBe(true);
    expect(res.data.sessionId).toBeDefined();
  });

  it("returns 500 when runPreviewAgent throws", async () => {
    mockRunPreviewAgent.mockRejectedValue(new Error("ADK failure"));
    vi.stubGlobal("readBody", vi.fn().mockResolvedValue({ text: "criar tarefa" }));
    const res = await handler(makeEvent({ text: "criar tarefa" })) as { success: boolean; error: string };
    expect(res.success).toBe(false);
    expect(res.error).toContain("Erro");
  });

  it("sets sessionCache only on success (not on error)", async () => {
    mockRunPreviewAgent.mockRejectedValue(new Error("fail"));
    vi.stubGlobal("readBody", vi.fn().mockResolvedValue({ text: "criar tarefa" }));
    await handler(makeEvent({}));
    expect(mockSessionCache.size).toBe(0);
  });
});

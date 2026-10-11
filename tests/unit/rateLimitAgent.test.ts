import { describe, it, expect, vi, beforeEach } from "vitest";

describe("rateLimitAgent", () => {
  let handler: (event: unknown) => void;

  beforeEach(async () => {
    vi.resetModules();
    vi.stubGlobal("defineEventHandler", (fn: (e: unknown) => unknown) => fn);
    vi.stubGlobal("createError", ({ statusCode, message }: { statusCode: number; message: string }) => {
      const err = new Error(message) as Error & { statusCode: number };
      err.statusCode = statusCode;
      return err;
    });
    const mod = await import("../../server/middleware/rateLimitAgent");
    handler = mod.default as (event: unknown) => void;
  });

  const makeEvent = (path: string, userId?: string) => ({
    path,
    context: { userId },
  });

  it("skips paths not in LIMITS", () => {
    expect(handler(makeEvent("/api/tasks/create", "u1"))).toBeUndefined();
  });

  it("skips requests with no userId", () => {
    expect(handler(makeEvent("/api/agent/voice-tasks/preview"))).toBeUndefined();
  });

  it("creates a new bucket on first request", () => {
    expect(() => handler(makeEvent("/api/agent/voice-tasks/preview", "u1"))).not.toThrow();
  });

  it("increments the bucket on subsequent requests within the window", () => {
    for (let i = 0; i < 9; i++) {
      expect(() => handler(makeEvent("/api/agent/voice-tasks/preview", "u1"))).not.toThrow();
    }
  });

  it("throws 429 when limit is reached", () => {
    for (let i = 0; i < 10; i++) {
      handler(makeEvent("/api/agent/voice-tasks/preview", "u1"));
    }
    expect(() => handler(makeEvent("/api/agent/voice-tasks/preview", "u1"))).toThrow();
    try {
      handler(makeEvent("/api/agent/voice-tasks/preview", "u1"));
    } catch (err: unknown) {
      expect((err as { statusCode: number }).statusCode).toBe(429);
    }
  });

  it("resets the bucket after the window expires", () => {
    const now = Date.now();
    const dateSpy = vi.spyOn(Date, "now");
    dateSpy.mockReturnValue(now);

    for (let i = 0; i < 10; i++) handler(makeEvent("/api/agent/voice-tasks/preview", "u1"));
    expect(() => handler(makeEvent("/api/agent/voice-tasks/preview", "u1"))).toThrow();

    dateSpy.mockReturnValue(now + 61_000);
    expect(() => handler(makeEvent("/api/agent/voice-tasks/preview", "u1"))).not.toThrow();
    dateSpy.mockRestore();
  });

  it("confirm route has higher limit (30) than preview (10)", () => {
    for (let i = 0; i < 30; i++) {
      expect(() => handler(makeEvent("/api/agent/voice-tasks/confirm", "u1"))).not.toThrow();
    }
    expect(() => handler(makeEvent("/api/agent/voice-tasks/confirm", "u1"))).toThrow();
  });

  it("prunes expired buckets from other users on each request", () => {
    const now = Date.now();
    const dateSpy = vi.spyOn(Date, "now");
    dateSpy.mockReturnValue(now);
    handler(makeEvent("/api/agent/voice-tasks/preview", "old-user"));

    dateSpy.mockReturnValue(now + 61_000);
    expect(() => handler(makeEvent("/api/agent/voice-tasks/preview", "new-user"))).not.toThrow();
    dateSpy.mockRestore();
  });
});

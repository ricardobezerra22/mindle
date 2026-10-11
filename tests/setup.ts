import { vi } from "vitest";

vi.stubGlobal("defineEventHandler", (fn: (e: unknown) => unknown) => fn);
vi.stubGlobal("readBody", vi.fn());
vi.stubGlobal("sendSuccess", (_e: unknown, data: unknown, _status?: number) => ({ success: true, data }));
vi.stubGlobal("sendError", (_e: unknown, message: string, _status?: number) => ({ success: false, error: message }));
vi.stubGlobal("createError", ({ statusCode, message }: { statusCode: number; message: string }) => {
  const err = new Error(message) as Error & { statusCode: number };
  err.statusCode = statusCode;
  return err;
});

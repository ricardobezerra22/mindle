import { runPreviewAgent, sanitizeInput, sessionCache } from "../../../services/agentService";

export default defineEventHandler(async (event) => {
  const userId = event.context.userId;
  const body = await readBody(event);
  const { text } = body ?? {};

  if (!text || typeof text !== "string") {
    return sendError(event, "text is required", 400);
  }
  if (sanitizeInput(text).length === 0) {
    return sendError(event, "Texto inválido ou muito curto", 400);
  }

  const sessionId = crypto.randomUUID();

  try {
    const result = await runPreviewAgent(userId, text, sessionId);
    sessionCache.set(sessionId, { userId, expiresAt: Date.now() + 5 * 60_000 });
    return sendSuccess(event, { ...result, sessionId });
  } catch (error) {
    const err = error as Error;
    console.error("Agent preview error:", {
      message: err.message,
      stack: err.stack,
      userId,
      sessionId,
    });
    return sendError(
      event,
      "Erro ao processar sua solicitação. Tente novamente.",
      500,
    );
  }
});

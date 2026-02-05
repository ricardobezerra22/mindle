import { getAuthUser } from "../utils/auth";

export default defineEventHandler((event) => {
  const path = getRequestURL(event).pathname;

  if (!path.startsWith("/api/")) return;
  if (path.startsWith("/api/auth/")) return;

  const userId = getAuthUser(event);
  if (!userId) {
    throw createError({
      statusCode: 401,
      statusMessage: "Não autorizado",
    });
  }

  event.context.userId = userId;
});

import { getAuthUser } from "../utils/auth";

export default defineEventHandler(async (event) => {
  const path = getRequestURL(event).pathname;

  if (!path.startsWith("/api/")) return;
  if (path.startsWith("/api/auth/")) return;

  const userId = await getAuthUser(event);
  if (!userId) {
    throw createError({
      statusCode: 401,
      statusMessage: "Não autorizado",
    });
  }

  event.context.userId = userId;
});

import { sendDailyTrackingToAll } from "../../services/emailService";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const query = getQuery(event);
  const authHeader = getHeader(event, "authorization");

  const secret = (query.secret as string) || authHeader?.replace("Bearer ", "");

  if (!secret || secret !== config.cronSecret) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  try {
    const result = await sendDailyTrackingToAll();
    return { success: true, ...result };
  } catch (error) {
    console.error("Cron daily-tracking error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to send daily tracking emails",
    });
  }
});

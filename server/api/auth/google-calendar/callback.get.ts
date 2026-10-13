import { getAuthUser } from "../../../utils/auth";
import { exchangeCode } from "../../../utils/googleCalendar";
import { prisma } from "../../../utils/prisma";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const error = query.error as string | undefined;

  if (error) {
    return sendRedirect(
      event,
      `/settings?calendar_error=${encodeURIComponent(error)}`,
    );
  }

  const code = query.code as string | undefined;
  if (!code) {
    return sendRedirect(event, "/settings?calendar_error=no_code");
  }

  const userId = await getAuthUser(event);
  if (!userId) {
    return sendRedirect(event, "/settings?calendar_error=unauthorized");
  }

  try {
    const tokens = await exchangeCode(code);
    await prisma.user.update({
      where: { id: userId },
      data: {
        googleAccessToken: tokens.access_token ?? null,
        googleRefreshToken: tokens.refresh_token ?? null,
        googleTokenExpiresAt: tokens.expiry_date
          ? new Date(tokens.expiry_date)
          : null,
        calendarConnected: true,
      },
    });
    return sendRedirect(event, "/settings?calendar_status=connected");
  } catch {
    return sendRedirect(event, "/settings?calendar_error=token_exchange_failed");
  }
});

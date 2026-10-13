import { requireAuth } from "../../../utils/auth";
import { getAuthUrl } from "../../../utils/googleCalendar";

export default defineEventHandler(async (event) => {
  await requireAuth(event);
  return sendRedirect(event, getAuthUrl());
});

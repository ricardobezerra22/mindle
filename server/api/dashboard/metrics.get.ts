import { getDashboardMetrics } from "../../services/dashboardService";

export default defineEventHandler(async (event) => {
  const userId = await requireAuth(event);
  const query = getQuery(event);

  const now = new Date();
  let startDate: Date;
  let endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

  if (query.startDate && query.endDate) {
    startDate = new Date(query.startDate as string);
    endDate = new Date(query.endDate as string);
  } else {
    const period = (query.period as string) || "30d";
    switch (period) {
      case "today":
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case "7d":
        startDate = new Date(now.getTime() - 7 * 86400000);
        break;
      case "30d":
        startDate = new Date(now.getTime() - 30 * 86400000);
        break;
      case "this-month":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case "last-month":
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        endDate = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 86400000);
    }
  }

  const metrics = await getDashboardMetrics(userId, startDate, endDate);

  return sendSuccess(event, metrics);
});

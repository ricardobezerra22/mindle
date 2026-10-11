import { prisma } from "../../../utils/prisma";

export default defineEventHandler(async (event) => {
  const userId = event.context.userId;
  const query = getQuery(event);
  const limit = Math.min(Number(query.limit) || 20, 100);
  const offset = Number(query.offset) || 0;

  const [logs, total] = await Promise.all([
    prisma.agentAuditLog.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    }),
    prisma.agentAuditLog.count({ where: { userId } }),
  ]);

  return sendSuccess(event, { logs, total, limit, offset });
});

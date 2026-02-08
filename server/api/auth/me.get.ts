import { prisma } from "../../utils/prisma";
import { getAuthUser } from "../../utils/auth";

export default defineEventHandler(async (event) => {
  try {
    const userId = await getAuthUser(event);
    if (!userId) {
      return sendError(event, "Não autorizado", 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, createdAt: true },
    });

    if (!user) {
      return sendError(event, "Usuário não encontrado", 404);
    }

    return sendSuccess(event, user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return sendError(event, "Erro ao buscar usuário", 500);
  }
});

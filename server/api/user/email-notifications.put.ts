import { prisma } from "../../utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const userId = event.context.userId;
    const body = await readBody(event);
    const { enabled } = body;

    if (typeof enabled !== "boolean") {
      return sendError(event, "Campo 'enabled' é obrigatório", 400);
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { emailNotifications: enabled },
      select: { emailNotifications: true },
    });

    return sendSuccess(event, user);
  } catch (error) {
    console.error("Error updating email notifications:", error);
    return sendError(event, "Erro ao atualizar notificações", 500);
  }
});

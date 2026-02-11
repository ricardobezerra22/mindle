import type { H3Event } from "h3";
import { getResend } from "../../utils/resend";
import { requireAuth } from "../../utils/auth";
import { sendSuccess, sendError } from "../../utils/response";
import { prisma } from "../../utils/prisma";

interface SupportBody {
  subject: string;
  message: string;
}

export default defineEventHandler(async (event: H3Event) => {
  const userId = await requireAuth(event);
  const body = await readBody<SupportBody>(event);

  if (!body.subject?.trim() || !body.message?.trim()) {
    return sendError(event, "Assunto e mensagem são obrigatórios", 400);
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true },
  });

  if (!user) {
    return sendError(event, "Usuário não encontrado", 404);
  }

  try {
    const resend = getResend();

    await resend.emails.send({
      from: "Mindle Suporte <suporte@mindle.space>",
      to: ["suporte@mindle.space"],
      replyTo: user.email,
      subject: `[Feedback] ${body.subject.trim()}`,
      text: [
        `De: ${user.name} (${user.email})`,
        `Assunto: ${body.subject.trim()}`,
        "",
        body.message.trim(),
      ].join("\n"),
    });

    return sendSuccess(event, { sent: true }, 201);
  } catch (err) {
    console.error("[support] Error sending email:", err);
    return sendError(event, "Erro ao enviar feedback", 500);
  }
});

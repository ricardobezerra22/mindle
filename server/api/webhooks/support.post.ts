import { Webhook } from "svix";
import type { H3Event } from "h3";
import { prisma } from "../../utils/prisma";
import { getResend } from "../../utils/resend";

interface ResendEmailEvent {
  type: string;
  data: {
    from: string;
    to: string[];
    subject: string;
    text?: string;
    html?: string;
    attachments?: Array<{
      filename: string;
      content_type: string;
      url?: string;
    }>;
  };
}

export default defineEventHandler(async (event: H3Event) => {
  const config = useRuntimeConfig();
  const secret = config.resendWebhookSecret;

  if (!secret) {
    console.error("[webhook/support] RESEND_WEBHOOK_SECRET not configured");
    throw createError({
      statusCode: 500,
      statusMessage: "Webhook secret not configured",
    });
  }

  const headers = getHeaders(event);
  const svixId = headers["svix-id"];
  const svixTimestamp = headers["svix-timestamp"];
  const svixSignature = headers["svix-signature"];

  if (!svixId || !svixTimestamp || !svixSignature) {
    console.error("[webhook/support] Missing svix headers");
    throw createError({
      statusCode: 400,
      statusMessage: "Missing webhook signature headers",
    });
  }

  const rawBody = await readRawBody(event);
  if (!rawBody) {
    throw createError({ statusCode: 400, statusMessage: "Empty request body" });
  }

  let payload: ResendEmailEvent;
  try {
    const wh = new Webhook(secret);
    payload = wh.verify(rawBody, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as ResendEmailEvent;
  } catch (err) {
    console.error("[webhook/support] Signature verification failed:", err);
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid webhook signature",
    });
  }

  if (payload.type !== "email.received") {
    return { received: true, processed: false };
  }

  const { from, subject, text, html, attachments } = payload.data;

  const emailAddress = from.includes("<")
    ? from.match(/<(.+)>/)?.[1] || from
    : from;

  let userId: string | undefined;
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: emailAddress.toLowerCase() },
      select: { id: true },
    });
    if (existingUser) {
      userId = existingUser.id;
    }
  } catch (err) {
    console.error("[webhook/support] Error looking up user:", err);
  }

  const ticket = await prisma.supportTicket.create({
    data: {
      from: emailAddress.toLowerCase(),
      subject: subject || "(sem assunto)",
      text: text || null,
      html: html || null,
      attachments:
        attachments?.map((a) => ({
          filename: a.filename,
          contentType: a.content_type,
          url: a.url || null,
        })) || [],
      ...(userId && { userId }),
    },
  });

  console.log(
    `[webhook/support] Ticket created: ${ticket.id} from ${emailAddress}`,
  );

  try {
    const resend = getResend();
    await resend.emails.send({
      from: "Mindle Suporte <suporte@mindle.space>",
      to: [emailAddress.toLowerCase()],
      subject: `Re: ${subject || "(sem assunto)"}`,
      text: [
        "Olá!",
        "",
        "Recebemos sua mensagem e ela já está sendo analisada pela nossa equipe.",
        `Seu ticket de referência é: #${ticket.id.slice(-6).toUpperCase()}`,
        "",
        "Responderemos o mais breve possível.",
        "",
        "Obrigado por entrar em contato!",
        "Equipe Mindle",
      ].join("\n"),
    });
  } catch (err) {
    console.error("[webhook/support] Error sending auto-reply:", err);
  }

  return { received: true, processed: true, ticketId: ticket.id };
});

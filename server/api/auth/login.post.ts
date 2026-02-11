import { prisma } from "../../utils/prisma";
import { comparePassword, generateToken } from "../../utils/auth";
import { sendWelcomeEmail } from "../../services/emailService";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { email, password } = body;

    if (!email || !password) {
      return sendError(event, "Email e senha são obrigatórios", 400);
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return sendError(event, "Email ou senha incorretos", 401);
    }

    if (!user.password) {
      return sendError(event, "Esta conta usa login com Google. Use o botão do Google para entrar.", 401);
    }

    const valid = await comparePassword(password, user.password);
    if (!valid) {
      return sendError(event, "Email ou senha incorretos", 401);
    }

    if (!user.isActive) {
      return sendError(event, "Sua conta está inativa. Entre em contato com o administrador para ser ativado.", 403);
    }

    const token = await generateToken(user.id);

    setCookie(event, "auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    if (!user.welcomeEmailSent) {
      sendWelcomeEmail(user.id, user.email, user.name).catch(() => {});
    }

    return sendSuccess(event, {
      id: user.id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error("Error logging in:", error);
    return sendError(event, "Erro ao fazer login", 500);
  }
});

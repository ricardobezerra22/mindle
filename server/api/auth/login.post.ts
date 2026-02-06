import { prisma } from "../../utils/prisma";
import { comparePassword, generateToken } from "../../utils/auth";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { email, password } = body;

    if (!email || !password) {
      return sendError(event, "Email e senha são obrigatórios", 400);
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) {
      return sendError(event, "Email ou senha incorretos", 401);
    }

    const valid = await comparePassword(password, user.password);
    if (!valid) {
      return sendError(event, "Email ou senha incorretos", 401);
    }

    if (!user.isActive) {
      return sendError(event, "Sua conta está inativa. Entre em contato com o administrador para ser ativado.", 403);
    }

    const token = generateToken(user.id);

    setCookie(event, "auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

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

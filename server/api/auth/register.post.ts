import { prisma } from "../../utils/prisma";
import { hashPassword, generateToken } from "../../utils/auth";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { name, email, password } = body;

    if (!email || !password || !name) {
      return sendError(event, "Nome, email e senha são obrigatórios", 400);
    }

    if (password.length < 6) {
      return sendError(event, "A senha deve ter pelo menos 6 caracteres", 400);
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return sendError(event, "Este email já está em uso", 409);
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        isActive: true,
      },
    });

    const token = await generateToken(user.id);

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
    }, 201);
  } catch (error) {
    console.error("Error registering user:", error);
    return sendError(event, "Erro ao criar conta", 500);
  }
});

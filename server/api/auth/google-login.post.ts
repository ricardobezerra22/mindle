import { createRemoteJWKSet, jwtVerify } from "jose";
import { prisma } from "../../utils/prisma";
import { generateToken } from "../../utils/auth";

const GOOGLE_JWKS = createRemoteJWKSet(
  new URL("https://www.googleapis.com/oauth2/v3/certs"),
);

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { credential } = body;

    if (!credential) {
      return sendError(event, "Token do Google é obrigatório", 400);
    }

    const clientId = process.env.NUXT_PUBLIC_GOOGLE_CLIENT_ID;
    const { payload } = await jwtVerify(credential, GOOGLE_JWKS, {
      issuer: ["https://accounts.google.com", "accounts.google.com"],
      audience: clientId,
    });

    const {
      sub: googleId,
      email,
      name,
    } = payload as {
      sub: string;
      email: string;
      name: string;
    };

    if (!email) {
      return sendError(event, "Email não encontrado no token do Google", 400);
    }

    let user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      if (!user.googleId) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { googleId },
        });
      }
    } else {
      user = await prisma.user.create({
        data: {
          name: name || email.split("@")[0],
          email,
          googleId,
          isActive: true,
        },
      });
    }

    if (!user.isActive) {
      return sendError(
        event,
        "Sua conta está inativa. Entre em contato com o administrador.",
        403,
      );
    }

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
    });
  } catch (error) {
    console.error("Error with Google login:", error);
    return sendError(event, "Erro ao fazer login com Google", 500);
  }
});

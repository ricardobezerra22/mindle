import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import type { H3Event } from "h3";

const getSecret = () => {
  const secret = process.env.JWT_SECRET || "mindle-secret-key-change-in-production";
  return new TextEncoder().encode(secret);
};

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 12);
};

export const comparePassword = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const generateToken = async (userId: string): Promise<string> => {
  return new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .setIssuedAt()
    .sign(getSecret());
};

export const verifyToken = async (token: string): Promise<{ userId: string } | null> => {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as { userId: string };
  } catch {
    return null;
  }
};

export const getAuthUser = async (event: H3Event): Promise<string | null> => {
  const token = getCookie(event, "auth-token");
  if (!token) return null;

  const payload = await verifyToken(token);
  return payload?.userId || null;
};

export const requireAuth = async (event: H3Event): Promise<string> => {
  const userId = await getAuthUser(event);
  if (!userId) {
    throw createError({
      statusCode: 401,
      statusMessage: "Não autorizado",
    });
  }
  return userId;
};

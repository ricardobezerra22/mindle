import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { H3Event } from "h3";

const JWT_SECRET = process.env.JWT_SECRET || "mindle-secret-key-change-in-production";
const JWT_EXPIRES_IN = "7d";

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 12);
};

export const comparePassword = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const verifyToken = (token: string): { userId: string } | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string };
  } catch {
    return null;
  }
};

export const getAuthUser = (event: H3Event): string | null => {
  const token = getCookie(event, "auth-token");
  if (!token) return null;

  const payload = verifyToken(token);
  return payload?.userId || null;
};

export const requireAuth = (event: H3Event): string => {
  const userId = getAuthUser(event);
  if (!userId) {
    throw createError({
      statusCode: 401,
      statusMessage: "Não autorizado",
    });
  }
  return userId;
};

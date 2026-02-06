export default defineEventHandler(async (event) => {
  setCookie(event, "auth-token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
  deleteCookie(event, "auth-token", { path: "/" });
  return sendSuccess(event, { message: "Logout realizado" });
});

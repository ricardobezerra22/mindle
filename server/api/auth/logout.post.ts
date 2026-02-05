export default defineEventHandler(async (event) => {
  deleteCookie(event, "auth-token", { path: "/" });
  return sendSuccess(event, { message: "Logout realizado" });
});

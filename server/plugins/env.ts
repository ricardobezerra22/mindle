const REQUIRED = [
  "DATABASE_URL",
  "JWT_SECRET",
  "NUXT_PUBLIC_GOOGLE_CLIENT_ID",
  "OPENROUTER_API_KEY",
] as const;

const OPTIONAL = ["OPENROUTER_MODEL", "NUXT_RESEND_API_KEY"] as const;

export default defineNitroPlugin(() => {
  const missing = REQUIRED.filter((k) => !process.env[k]);

  if (missing.length > 0) {
    const list = missing.map((k) => `  - ${k}`).join("\n");
    console.error(`[env] Missing required environment variables:\n${list}`);
  }

  for (const k of OPTIONAL) {
    if (!process.env[k]) {
      console.warn(`[env] Optional variable not set: ${k}`);
    }
  }
});

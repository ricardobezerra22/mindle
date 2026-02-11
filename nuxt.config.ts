// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "@nuxt/eslint",
    "@nuxt/ui",
    "nuxt-toast",
    "@pinia/nuxt",
    "nuxt-google-auth",
    "@vue-email/nuxt",
  ],
  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },

  css: ["~/assets/css/main.css"],
  runtimeConfig: {
    jwtSecret:
      process.env.JWT_SECRET || "mindle-secret-key-change-in-production",
    public: {
      googleClientId: process.env.NUXT_PUBLIC_GOOGLE_CLIENT_ID,
    },
    resendApiKey: process.env.NUXT_RESEND_API_KEY,
  },

  compatibilityDate: "2025-01-15",

  eslint: {
    config: {
      stylistic: {
        semi: true,
        quotes: "double",
        commaDangle: "always-multiline",
        braceStyle: "1tbs",
        indent: 2,
      },
    },
  },
  googleAuth: {
    clientId: process.env.NUXT_PUBLIC_GOOGLE_CLIENT_ID,
    autoLoadScript: true,
    promptOneTap: true,
    enableServerVerify: true,
  },
  pinia: {
    storesDirs: ["./app/stores/**", "./app/stores/**"],
  },
});

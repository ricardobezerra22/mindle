// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "@nuxt/eslint",
    "@nuxt/ui",
    "nuxt-toast",
    "@pinia/nuxt",
    "nuxt-google-auth",
  ],
  pinia: {
    storesDirs: ["./app/stores/**", "./app/stores/**"],
  },
  googleAuth: {
    clientId: process.env.NUXT_PUBLIC_GOOGLE_CLIENT_ID,
    autoLoadScript: true,
    promptOneTap: true,
    enableServerVerify: true,
  },
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
  },

  compatibilityDate: "2025-01-15",

  eslint: {
    config: {
      stylistic: {
        commaDangle: "never",
        braceStyle: "1tbs",
      },
    },
  },
});

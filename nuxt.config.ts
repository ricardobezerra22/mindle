// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  modules: [
    "@nuxt/eslint",
    "@nuxt/ui",
    "nuxt-toast",
    "@pinia/nuxt",
    "nuxt-google-auth",
    "@vue-email/nuxt",
    "@nuxtjs/i18n",
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
    cronApiKey: process.env.CRON_API_KEY,
    googleCalendarClientId: process.env.GOOGLE_CALENDAR_CLIENT_ID,
    googleCalendarClientSecret: process.env.GOOGLE_CALENDAR_CLIENT_SECRET,
    googleCalendarRedirectUri: process.env.GOOGLE_CALENDAR_REDIRECT_URI,
  },

  compatibilityDate: "2025-01-15",
  vite: {
    plugins: [tailwindcss()],
  },

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

  i18n: {
    defaultLocale: "pt",
    strategy: "no_prefix",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      redirectOn: "root",
      fallbackLocale: "en",
    },
    langDir: "locales/",
    locales: [
      { code: "pt", file: "pt.json", name: "Português" },
      { code: "en", file: "en.json", name: "English" },
    ],
  },

  pinia: {
    storesDirs: ["./app/stores/**", "./app/stores/**"],
  },
});

<script setup lang="ts">
import { Analytics } from "@vercel/analytics/nuxt";

const { t, locale } = useI18n();

useHead({
  meta: [{ name: "viewport", content: "width=device-width, initial-scale=1" }],
  link: [{ rel: "icon", href: "/favicon.ico" }],
  htmlAttrs: {
    lang: computed(() => locale.value),
  },
});
usePalette();
const title = computed(() => t("app.title"));
const description = computed(() => t("app.description"));

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
});
</script>

<template>
  <div data-vaul-drawer-wrapper>
    <NuxtLayout>
      <NuxtPage />
      <Analytics />
    </NuxtLayout>
    <ClientOnly>
      <UiToast />
    </ClientOnly>
  </div>
</template>

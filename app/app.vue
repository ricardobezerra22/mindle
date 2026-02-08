<script setup lang="ts">
import { Analytics } from "@vercel/analytics/nuxt";

useHead({
  meta: [{ name: "viewport", content: "width=device-width, initial-scale=1" }],
  link: [{ rel: "icon", href: "/favicon.ico" }],
  htmlAttrs: {
    lang: "pt",
  },
});
const title = "Mindle - Gestão de Tarefas e Produtividade";
const description
  = "Sistema completo de gestão de tarefas, planner, foco e bem-estar.";

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

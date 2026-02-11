<template>
  <div class="layout-default">
    <LayoutSidebar />

    <div class="layout-main">
      <LayoutHeader :title="pageTitle" />

      <main class="layout-content">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();

const pageTitle = computed(() => {
  const titles: Record<string, string> = {
    "/": "Dashboard",
    "/tasks": "Tarefas",
    "/projects": "Projetos",
    "/planner/week": "Planner Semanal",
    "/planner/month": "Planner Mensal",
    "/focus": "Foco",
    "/habits": "Hábitos",
    "/finance": "Finanças",
    "/settings": "Configurações",
  };
  return titles[route.path] || "Mindle";
});
</script>

<style scoped>
.layout-default {
  display: flex;
  height: 100vh;
  height: 100dvh;
  background-color: var(--color-background);
  overflow: hidden;
}

.layout-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100vh;
  height: 100dvh;
  min-width: 0;
}

.layout-content {
  flex: 1;
  padding: var(--spacing-lg);
  overflow-y: auto;
}
</style>

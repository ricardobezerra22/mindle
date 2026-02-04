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
    "/planner/week": "Planner Semanal",
    "/planner/month": "Planner Mensal",
    "/focus": "Foco",
    "/well-being": "Bem-estar",
    "/finance": "Finanças",
    "/settings": "Configurações",
  };
  return titles[route.path] || "Mindle";
});
</script>

<style scoped>
.layout-default {
  display: flex;
  min-height: 100vh;
  background-color: var(--color-background);
}

.layout-main {
  flex: 1;
  margin-left: 240px;
  display: flex;
  flex-direction: column;
}

.layout-content {
  flex: 1;
  padding: var(--spacing-lg);
  overflow-y: auto;
}
</style>

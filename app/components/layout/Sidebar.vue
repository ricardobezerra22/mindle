<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <h2 class="sidebar-logo">Mindle</h2>
    </div>

    <nav class="sidebar-nav">
      <NuxtLink to="/" class="nav-item" active-class="active">
        <Icon name="lucide:layout-dashboard" />
        <span>Dashboard</span>
      </NuxtLink>

      <NuxtLink to="/tasks" class="nav-item" active-class="active">
        <Icon name="lucide:list-checks" />
        <span>Tarefas</span>
      </NuxtLink>

      <div class="nav-group">
        <span class="nav-group-title">Planner</span>
        <NuxtLink to="/planner/week" class="nav-item" active-class="active">
          <Icon name="lucide:calendar-days" />
          <span>Semanal</span>
        </NuxtLink>
        <NuxtLink to="/planner/month" class="nav-item" active-class="active">
          <Icon name="lucide:calendar" />
          <span>Mensal</span>
        </NuxtLink>
      </div>

      <NuxtLink to="/focus" class="nav-item" active-class="active">
        <Icon name="lucide:target" />
        <span>Foco</span>
      </NuxtLink>

      <NuxtLink to="/well-being" class="nav-item" active-class="active">
        <Icon name="lucide:heart" />
        <span>Bem-estar</span>
      </NuxtLink>

      <NuxtLink to="/finance" class="nav-item" active-class="active">
        <Icon name="lucide:wallet" />
        <span>Finanças</span>
      </NuxtLink>

      <NuxtLink to="/settings" class="nav-item" active-class="active">
        <Icon name="lucide:settings" />
        <span>Configurações</span>
      </NuxtLink>
    </nav>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 240px;
  height: 100vh;
  background-color: var(--color-surface);
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
}

.sidebar-header {
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
}

.sidebar-logo {
  font-size: 24px;
  font-weight: 600;
  color: var(--color-primary);
  margin: 0;
}

.sidebar-nav {
  flex: 1;
  padding: var(--spacing-md);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  overflow-y: auto;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-sm);
  color: var(--color-text-secondary);
  text-decoration: none;
  font-size: 14px;
  font-weight: 400;
  transition: all 0.2s ease;
}

.nav-item:hover {
  background-color: var(--color-background);
  color: var(--color-text-primary);
}

.nav-item.active {
  background-color: var(--color-primary);
  color: white;
}

.nav-item :deep(svg) {
  width: 20px;
  height: 20px;
}

.nav-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  margin-top: var(--spacing-sm);
}

.nav-group-title {
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text-secondary);
  padding: var(--spacing-xs) var(--spacing-md);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.nav-group .nav-item {
  padding-left: var(--spacing-lg);
}
</style>

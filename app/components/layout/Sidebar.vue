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

      <NuxtLink to="/habits" class="nav-item" active-class="active">
        <Icon name="lucide:heart" />
        <span>Hábitos</span>
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

    <div class="sidebar-footer">
      <div class="user-info">
        <div class="user-avatar">
          {{ userInitial }}
        </div>
        <div class="user-details">
          <span class="user-name">{{ userName }}</span>
          <span class="user-email">{{ userEmail }}</span>
        </div>
      </div>
      <button class="logout-btn" @click="handleLogout">
        <Icon name="lucide:log-out" size="18" />
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useAuth } from "../../composables/useAuth";
// import { useToast } from "../../composables/useToast";

const { user, logout } = useAuth();
const toast = useToast();

const userName = computed(() => user.value?.name || "Usuário");
const userEmail = computed(() => user.value?.email || "");
const userInitial = computed(() =>
  (user.value?.name || "U").charAt(0).toUpperCase(),
);

const handleLogout = async () => {
  toast.info({ title: "Saindo..." });
  await logout();
};
</script>

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

.sidebar-footer {
  padding: var(--spacing-md);
  border-top: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.user-info {
  flex: 1;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  min-width: 0;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--color-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  flex-shrink: 0;
}

.user-details {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.user-name {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-email {
  font-size: 11px;
  color: var(--color-text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.logout-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: var(--color-text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.logout-btn:hover {
  background: #fef2f2;
  color: #dc2626;
}
</style>

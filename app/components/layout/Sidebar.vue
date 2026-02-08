<template>
  <div
    ref="swipeTarget"
    :class="['swipe-zone', { active: isMobile && !isExpanded }]"
  />

  <Transition name="backdrop">
    <div
      v-if="isMobile && isExpanded"
      class="sidebar-backdrop"
      @click="isExpanded = false"
    />
  </Transition>

  <aside :class="['sidebar', { expanded: isExpanded, mobile: isMobile }]">
    <div class="sidebar-header">
      <button
        class="toggle-btn"
        title="Menu"
        @click="isExpanded = !isExpanded"
      >
        <Icon
          name="lucide:brain"
          class="brand-icon"
        />
      </button>
      <Transition name="fade">
        <span
          v-if="isExpanded"
          class="brand-text"
        >Mindle</span>
      </Transition>
      <Transition name="fade">
        <button
          v-if="isExpanded"
          class="collapse-btn"
          @click="isExpanded = false"
        >
          <Icon name="lucide:panel-left-close" />
        </button>
      </Transition>
    </div>

    <nav class="sidebar-nav">
      <NuxtLink
        to="/"
        class="nav-item"
        exact-active-class="active"
        :title="!isExpanded ? 'Dashboard' : undefined"
        @click="closeMobile"
      >
        <Icon name="lucide:layout-dashboard" />
        <Transition name="fade"><span v-if="isExpanded">Dashboard</span></Transition>
      </NuxtLink>

      <NuxtLink
        to="/tasks"
        class="nav-item"
        active-class="active"
        :title="!isExpanded ? 'Tarefas' : undefined"
        @click="closeMobile"
      >
        <Icon name="lucide:list-checks" />
        <Transition name="fade"><span v-if="isExpanded">Tarefas</span></Transition>
      </NuxtLink>

      <div
        v-if="isExpanded"
        class="nav-group"
      >
        <span class="nav-group-title">Planner</span>
        <NuxtLink
          to="/planner/week"
          class="nav-item"
          active-class="active"
          @click="closeMobile"
        >
          <Icon name="lucide:calendar-days" />
          <span>Semanal</span>
        </NuxtLink>
        <NuxtLink
          to="/planner/month"
          class="nav-item"
          active-class="active"
          @click="closeMobile"
        >
          <Icon name="lucide:calendar" />
          <span>Mensal</span>
        </NuxtLink>
      </div>
      <template v-else>
        <NuxtLink
          to="/planner/week"
          class="nav-item"
          active-class="active"
          title="Planner Semanal"
          @click="closeMobile"
        >
          <Icon name="lucide:calendar-days" />
        </NuxtLink>
        <NuxtLink
          to="/planner/month"
          class="nav-item"
          active-class="active"
          title="Planner Mensal"
          @click="closeMobile"
        >
          <Icon name="lucide:calendar" />
        </NuxtLink>
      </template>

      <NuxtLink
        to="/focus"
        class="nav-item"
        active-class="active"
        :title="!isExpanded ? 'Foco' : undefined"
        @click="closeMobile"
      >
        <Icon name="lucide:target" />
        <Transition name="fade"><span v-if="isExpanded">Foco</span></Transition>
      </NuxtLink>

      <NuxtLink
        to="/habits"
        class="nav-item"
        active-class="active"
        :title="!isExpanded ? 'Hábitos' : undefined"
        @click="closeMobile"
      >
        <Icon name="lucide:heart" />
        <Transition name="fade"><span v-if="isExpanded">Hábitos</span></Transition>
      </NuxtLink>

      <NuxtLink
        to="/finance"
        class="nav-item"
        active-class="active"
        :title="!isExpanded ? 'Finanças' : undefined"
        @click="closeMobile"
      >
        <Icon name="lucide:wallet" />
        <Transition name="fade"><span v-if="isExpanded">Finanças</span></Transition>
      </NuxtLink>
    </nav>

    <div class="sidebar-footer">
      <NuxtLink
        to="/settings"
        class="nav-item"
        active-class="active"
        :title="!isExpanded ? 'Configurações' : undefined"
        @click="closeMobile"
      >
        <Icon name="lucide:settings" />
        <Transition name="fade"><span v-if="isExpanded">Configurações</span></Transition>
      </NuxtLink>

      <div
        v-if="isExpanded"
        class="user-section"
      >
        <div class="user-info">
          <div class="user-avatar">
            {{ userInitial }}
          </div>
          <div class="user-details">
            <span class="user-name">{{ userName }}</span>
            <span class="user-email">{{ userEmail }}</span>
          </div>
        </div>
        <button
          class="logout-btn"
          title="Sair"
          @click="handleLogout"
        >
          <Icon name="lucide:log-out" />
        </button>
      </div>
      <button
        v-else
        class="nav-item logout-rail"
        title="Sair"
        @click="handleLogout"
      >
        <Icon name="lucide:log-out" />
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useAuth } from "../../composables/useAuth";

const { user, logout } = useAuth();
const toast = useToast();

const isExpanded = ref(false);
const isMobile = ref(false);
const swipeTarget = ref<HTMLElement | null>(null);

const userName = computed(() => user.value?.name || "Usuário");
const userEmail = computed(() => user.value?.email || "");
const userInitial = computed(() =>
  (user.value?.name || "U").charAt(0).toUpperCase(),
);

const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768;
  if (isMobile.value) isExpanded.value = false;
};

const closeMobile = () => {
  if (isMobile.value) isExpanded.value = false;
};

const handleLogout = async () => {
  toast.info({ title: "Saindo..." });
  isExpanded.value = false;
  await logout();
};

let touchStartX = 0;
let touchStartY = 0;

const onTouchStart = (e: TouchEvent) => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
};

const onTouchEnd = (e: TouchEvent) => {
  const touchEndX = e.changedTouches[0].clientX;
  const touchEndY = e.changedTouches[0].clientY;
  const deltaX = touchEndX - touchStartX;
  const deltaY = Math.abs(touchEndY - touchStartY);

  if (deltaX > 60 && deltaY < 80 && touchStartX < 40) {
    isExpanded.value = true;
  }
};

onMounted(() => {
  checkMobile();
  window.addEventListener("resize", checkMobile);
  document.addEventListener("touchstart", onTouchStart, { passive: true });
  document.addEventListener("touchend", onTouchEnd, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener("resize", checkMobile);
  document.removeEventListener("touchstart", onTouchStart);
  document.removeEventListener("touchend", onTouchEnd);
});
</script>

<style scoped>
.swipe-zone {
  display: none;
}

.swipe-zone.active {
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  width: 20px;
  height: 100%;
  z-index: 200;
}

.sidebar-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 199;
}

.backdrop-enter-active,
.backdrop-leave-active {
  transition: opacity 0.25s ease;
}

.backdrop-enter-from,
.backdrop-leave-to {
  opacity: 0;
}

.sidebar {
  width: 60px;
  height: 100vh;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  background-color: var(--color-surface);
  border-right: 1px solid var(--color-border);
  flex-shrink: 0;
  position: sticky;
  top: 0;
  transition: width 0.25s ease;
  overflow: hidden;
  z-index: 50;
}

.sidebar.expanded {
  width: 240px;
}

.sidebar-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm);
  min-height: 56px;
  border-bottom: 1px solid var(--color-border);
}

.toggle-btn {
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: var(--radius-md);
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.toggle-btn:hover {
  background-color: var(--color-background);
}

.brand-icon {
  width: 26px;
  height: 26px;
  color: var(--color-primary);
}

.brand-text {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-primary);
  white-space: nowrap;
  flex: 1;
}

.collapse-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: var(--radius-sm);
  color: var(--color-text-secondary);
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.collapse-btn:hover {
  background-color: var(--color-background);
  color: var(--color-text-primary);
}

.collapse-btn :deep(svg) {
  width: 18px;
  height: 18px;
}

.sidebar-nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: var(--spacing-sm);
  overflow-y: auto;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm);
  border-radius: var(--radius-md);
  color: var(--color-text-secondary);
  text-decoration: none;
  font-size: 14px;
  font-weight: 400;
  transition: all 0.2s ease;
  white-space: nowrap;
  min-height: 42px;
  cursor: pointer;
}

.sidebar:not(.expanded) .nav-item {
  justify-content: center;
  padding: var(--spacing-sm);
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
  flex-shrink: 0;
}

.nav-group {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-top: var(--spacing-xs);
}

.nav-group-title {
  font-size: 11px;
  font-weight: 500;
  color: var(--color-text-secondary);
  padding: var(--spacing-xs) var(--spacing-sm);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.nav-group .nav-item {
  padding-left: var(--spacing-lg);
}

.sidebar-footer {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: var(--spacing-sm);
  border-top: 1px solid var(--color-border);
}

.user-section {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm);
  margin-top: var(--spacing-xs);
}

.user-info {
  flex: 1;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  min-width: 0;
}

.user-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: var(--color-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
  flex-shrink: 0;
}

.user-details {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.user-name {
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-email {
  font-size: 10px;
  color: var(--color-text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.logout-btn {
  width: 30px;
  height: 30px;
  border: none;
  border-radius: var(--radius-sm);
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

.logout-btn :deep(svg) {
  width: 18px;
  height: 18px;
}

.logout-rail {
  border: none;
  background: transparent;
}

.logout-rail:hover {
  background: #fef2f2 !important;
  color: #dc2626 !important;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    width: 0;
    z-index: 200;
    border-right: none;
    box-shadow: none;
    transition:
      width 0.25s ease,
      box-shadow 0.25s ease;
  }

  .sidebar.expanded {
    width: 260px;
    box-shadow: 4px 0 24px rgba(0, 0, 0, 0.15);
  }

  .sidebar:not(.expanded) .sidebar-header,
  .sidebar:not(.expanded) .sidebar-nav,
  .sidebar:not(.expanded) .sidebar-footer {
    display: none;
  }
}
</style>

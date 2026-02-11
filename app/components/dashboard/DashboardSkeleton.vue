<template>
  <div class="skeleton-dashboard">
    <div class="skeleton-filter">
      <div
        v-for="i in 5"
        :key="i"
        class="skeleton-pill"
      />
    </div>

    <div class="skeleton-kpi-grid">
      <div
        v-for="i in 6"
        :key="i"
        class="skeleton-kpi"
      >
        <div class="sk-icon" />
        <div class="sk-value" />
        <div class="sk-label" />
      </div>
    </div>

    <div class="skeleton-charts">
      <div class="skeleton-chart-card">
        <div class="sk-chart-title" />
        <div class="sk-chart-body" />
      </div>
      <div class="skeleton-chart-card">
        <div class="sk-chart-title" />
        <div class="sk-chart-body" />
      </div>
    </div>

    <div class="skeleton-insight">
      <div class="sk-line long" />
      <div class="sk-line medium" />
      <div class="sk-line short" />
      <div class="sk-line medium" />
    </div>
  </div>
</template>

<style scoped>
.skeleton-dashboard {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.skeleton-filter {
  display: flex;
  gap: 6px;
}

.skeleton-pill {
  width: 72px;
  height: 32px;
  border-radius: 20px;
  background: var(--color-border);
  animation: pulse 1.5s infinite;
}

.skeleton-kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: var(--spacing-md);
}

.skeleton-kpi {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.sk-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: var(--color-border);
  animation: pulse 1.5s infinite;
}

.sk-value {
  width: 80px;
  height: 28px;
  border-radius: var(--radius-sm);
  background: var(--color-border);
  animation: pulse 1.5s infinite;
}

.sk-label {
  width: 100px;
  height: 14px;
  border-radius: var(--radius-sm);
  background: var(--color-border);
  animation: pulse 1.5s infinite;
}

.skeleton-charts {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
}

.skeleton-chart-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.sk-chart-title {
  width: 140px;
  height: 16px;
  border-radius: var(--radius-sm);
  background: var(--color-border);
  animation: pulse 1.5s infinite;
}

.sk-chart-body {
  height: 180px;
  border-radius: var(--radius-md);
  background: var(--color-border);
  animation: pulse 1.5s infinite;
}

.skeleton-insight {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.sk-line {
  height: 14px;
  border-radius: var(--radius-sm);
  background: var(--color-border);
  animation: pulse 1.5s infinite;
}

.sk-line.long { width: 90%; }
.sk-line.medium { width: 65%; }
.sk-line.short { width: 40%; }

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

@media (max-width: 768px) {
  .skeleton-charts {
    grid-template-columns: 1fr;
  }

  .skeleton-kpi-grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>

<template>
  <div class="card">
    <slot />
  </div>
</template>

<style scoped>
.card {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}
</style>

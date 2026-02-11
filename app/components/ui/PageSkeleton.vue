<template>
  <div class="page-skeleton">
    <slot />
  </div>
</template>

<style scoped>
.page-skeleton {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>

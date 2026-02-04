<template>
  <div class="layout-focus">
    <main class="focus-content">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.layout-focus {
  min-height: 100vh;
  background-color: var(--color-background);
  display: flex;
  align-items: center;
  justify-content: center;
}

.focus-content {
  width: 100%;
  max-width: 800px;
  padding: var(--spacing-xl);
}
</style>

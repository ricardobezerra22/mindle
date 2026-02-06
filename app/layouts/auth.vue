<template>
  <div class="auth-layout">
    <div class="auth-container">
      <div class="auth-brand">
        <h1 class="brand-name">Mindle</h1>
        <p class="brand-tagline">Clareza, foco e calma.</p>
      </div>
      <slot />
    </div>
  </div>
</template>

<style scoped lang="css">
.auth-layout {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-background);
}

.auth-container {
  width: 100%;
  max-width: 420px;
}

.auth-brand {
  text-align: center;
  margin-bottom: var(--spacing-xl);
}

.brand-name {
  font-size: 32px;
  font-weight: 600;
  color: var(--color-primary);
  margin: 0;
  letter-spacing: -0.5px;
}

.brand-tagline {
  font-size: 15px;
  color: var(--color-text-secondary);
  margin: var(--spacing-xs) 0 0 0;
}
</style>

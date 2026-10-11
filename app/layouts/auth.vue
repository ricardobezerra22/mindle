<template>
  <div class="auth-layout">
    <div class="auth-container">
      <div class="auth-brand">
        <h1 class="brand-name">
          Mindle
        </h1>
        <p class="brand-tagline">
          Clareza, foco e calma.
        </p>
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
  background: color-mix(in srgb, var(--color-background) 94%, var(--color-primary) 6%);
  position: relative;
  overflow: hidden;
}

.auth-layout::before {
  content: "";
  position: absolute;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    color-mix(in srgb, var(--color-primary) 28%, transparent) 0%,
    transparent 70%
  );
  top: -200px;
  right: -150px;
  pointer-events: none;
}

.auth-layout::after {
  content: "";
  position: absolute;
  width: 480px;
  height: 480px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    color-mix(in srgb, var(--color-primary) 18%, transparent) 0%,
    transparent 70%
  );
  bottom: -140px;
  left: -100px;
  pointer-events: none;
}

.auth-container {
  width: 100%;
  max-width: 420px;
  position: relative;
  z-index: 1;
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

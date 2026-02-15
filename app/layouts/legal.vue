<script setup lang="ts">
const route = useRoute();

const sections = [
  { label: "Privacidade", path: "/privacidade" },
  { label: "Termos de Serviço", path: "/termos" },
  { label: "Cookies", path: "/cookies" },
];

const isActive = (path: string) => route.path === path;
</script>

<template>
  <div class="legal-layout">
    <nav class="legal-navbar">
      <div class="navbar-container">
        <NuxtLink to="/" class="navbar-logo">
          <img src="/mindle-logo.png" alt="Mindle" class="logo-img" />
          <span>Mindle</span>
        </NuxtLink>
      </div>
    </nav>

    <div class="legal-container">
      <aside class="legal-sidebar">
        <div class="sidebar-header">
          <h3>Documentos Legais</h3>
        </div>
        <nav class="sidebar-nav">
          <NuxtLink
            v-for="section in sections"
            :key="section.path"
            :to="section.path"
            :class="['sidebar-link', { active: isActive(section.path) }]"
          >
            {{ section.label }}
          </NuxtLink>
        </nav>
      </aside>

      <main class="legal-content">
        <slot />
      </main>
    </div>

    <footer class="legal-footer">
      <div class="footer-container">
        <p>&copy; 2025 Mindle Inc. Todos os direitos reservados.</p>
        <div class="footer-links">
          <NuxtLink to="/">Voltar para Home</NuxtLink>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.legal-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--color-background);
  color: var(--color-text-primary);
}

/* Navbar */
.legal-navbar {
  background-color: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.navbar-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: var(--color-text-primary);
  font-weight: 600;
  font-size: 1.125rem;
  transition: opacity 0.3s;
}

.navbar-logo:hover {
  opacity: 0.8;
}

.logo-box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: var(--color-primary);
  color: white;
  border-radius: 6px;
  font-weight: 700;
  font-size: 0.875rem;
}

.logo-img {
  width: 32px;
  height: 32px;
  object-fit: contain;
  display: block;
}

/* Main Container */
.legal-container {
  display: flex;
  flex: 1;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  gap: 2rem;
  padding: 2rem 1.5rem;
}

/* Sidebar */
.legal-sidebar {
  width: 280px;
  flex-shrink: 0;
}

.sidebar-header {
  margin-bottom: 1.5rem;
}

.sidebar-header h3 {
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-secondary);
  margin: 0;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.sidebar-link {
  display: block;
  padding: 0.75rem 1rem;
  border-radius: var(--radius-md);
  text-decoration: none;
  color: var(--color-text-secondary);
  transition: all 0.3s;
  border-left: 3px solid transparent;
  font-size: 0.9375rem;
}

.sidebar-link:hover {
  background-color: var(--color-surface);
  color: var(--color-text-primary);
}

.sidebar-link.active {
  background-color: var(--color-surface);
  color: var(--color-primary);
  border-left-color: var(--color-primary);
  font-weight: 600;
}

/* Content */
.legal-content {
  flex: 1;
  min-width: 0;
}

.legal-content :deep(h1) {
  font-size: 2.25rem;
  margin-bottom: 2rem;
  margin-top: 0;
  color: var(--color-primary);
}

.legal-content :deep(h2) {
  font-size: 1.5rem;
  margin-top: 2rem;
  margin-bottom: 1rem;
  color: var(--color-text-primary);
  font-weight: 600;
}

.legal-content :deep(p) {
  line-height: 1.6;
  margin-bottom: 1rem;
  color: var(--color-text-secondary);
}

.legal-content :deep(ul) {
  margin-left: 1.5rem;
  margin-bottom: 1rem;
}

.legal-content :deep(li) {
  margin-bottom: 0.5rem;
  color: var(--color-text-secondary);
  line-height: 1.6;
}

.legal-content :deep(a) {
  color: var(--color-primary);
  text-decoration: none;
  transition: opacity 0.3s;
}

.legal-content :deep(a:hover) {
  text-decoration: underline;
  opacity: 0.8;
}

/* Footer */
.legal-footer {
  background-color: var(--color-surface);
  border-top: 1px solid var(--color-border);
  padding: 2rem 0;
  margin-top: auto;
}

.footer-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
}

.footer-container p {
  margin: 0;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}

.footer-links {
  display: flex;
  gap: 1.5rem;
}

.footer-links a {
  font-size: 0.875rem;
  color: var(--color-primary);
  text-decoration: none;
  transition: opacity 0.3s;
}

.footer-links a:hover {
  opacity: 0.8;
  text-decoration: underline;
}

/* Responsive */
@media (max-width: 768px) {
  .legal-container {
    flex-direction: column;
    gap: 1.5rem;
    padding: 1.5rem 1rem;
  }

  .legal-sidebar {
    width: 100%;
  }

  .sidebar-nav {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
  }

  .sidebar-link {
    text-align: center;
    border-left: none;
    border-bottom: 3px solid transparent;
  }

  .sidebar-link.active {
    border-left: none;
    border-bottom-color: var(--color-primary);
  }

  .legal-content :deep(h1) {
    font-size: 1.75rem;
  }

  .legal-content :deep(h2) {
    font-size: 1.25rem;
  }

  .footer-container {
    flex-direction: column;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .navbar-container {
    padding: 0 1rem;
  }

  .legal-container {
    padding: 1rem;
  }

  .sidebar-nav {
    grid-template-columns: 1fr;
  }

  .legal-content :deep(h1) {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .legal-content :deep(h2) {
    font-size: 1.125rem;
    margin-top: 1.5rem;
  }
}
</style>

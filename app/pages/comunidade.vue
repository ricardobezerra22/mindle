<script setup lang="ts">
definePageMeta({
  layout: false,
});

const { t } = useI18n();

useHead({
  title: computed(() => t("community.metaTitle")),
  meta: [
    {
      name: "description",
      content: computed(() => t("community.metaDescription")),
    },
  ],
});
</script>

<template>
  <div class="community-page">
    <div class="container py-12">
      <h1 class="text-4xl font-bold mb-8">{{ $t("community.comunidadeMindle") }}</h1>

      <div class="community-content max-w-4xl">
        <div class="section mb-12">
          <h2>{{ $t("community.junteSeANossa") }}</h2>
          <p>{{ $t("community.aComunidadeMindleE") }}</p>
        </div>

        <div class="section mb-12">
          <h2>{{ $t("community.discord") }}</h2>
          <p>{{ $t("community.conecteSeComOutros") }}</p>
          <p>
            <a
              href="https://discord.gg/mindle"
              target="_blank"
              class="btn-link"
            >{{ $t("community.entrarNoDiscord") }}</a>
          </p>
        </div>

        <div class="section mb-12">
          <h2>{{ $t("community.forum") }}</h2>
          <p>{{ $t("community.nossoForumEUm") }}</p>
        </div>

        <div class="section">
          <h2>{{ $t("community.eventos") }}</h2>
          <p>{{ $t("community.participamosRegularmenteDeWebinars") }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.community-page {
  min-height: 100vh;
  background-color: var(--color-background);
  color: var(--color-text-primary);
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

h1 {
  color: var(--color-primary);
}

h2 {
  color: var(--color-text-primary);
  margin-bottom: 1rem;
  font-weight: 600;
  font-size: 1.5rem;
}

p {
  line-height: 1.6;
  margin-bottom: 1rem;
  color: var(--color-text-secondary);
}

.section {
  padding-bottom: 2rem;
}

.btn-link {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: var(--color-primary);
  color: white;
  border-radius: var(--radius-md);
  text-decoration: none;
  font-weight: 600;
  transition: background-color 0.3s;
}

.btn-link:hover {
  background-color: var(--color-primary-dark);
}

a {
  color: var(--color-primary);
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>

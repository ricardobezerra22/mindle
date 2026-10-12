<script setup lang="ts">
definePageMeta({
  layout: false,
});

const { t } = useI18n();

useHead({
  title: computed(() => t("blog.metaTitle")),
  meta: [
    {
      name: "description",
      content: computed(() => t("blog.metaDescription")),
    },
  ],
});
</script>

<template>
  <div class="blog-page">
    <div class="container py-12">
      <h1 class="text-4xl font-bold mb-8">{{ $t("blog.blogMindle") }}</h1>

      <div class="blog-content max-w-4xl">
        <div class="blog-post mb-12">
          <h2>{{ $t("blog.produtividadeParaMentesNeurodiversas") }}</h2>
          <p class="text-sm text-gray-500 mb-4">{{ $t("blog.publicadoEm15De") }}</p>
          <p>{{ $t("blog.entenderComoSuaMente") }}</p>
          <p>{{ $t("blog.oMindleFoiProjetado") }}</p>
        </div>

        <div class="blog-post mb-12">
          <h2>{{ $t("blog.aImportanciaDoFoco") }}</h2>
          <p class="text-sm text-gray-500 mb-4">{{ $t("blog.publicadoEm10De") }}</p>
          <p>{{ $t("blog.focoProfundoEA") }}</p>
          <p>{{ $t("blog.descubraComoUsarA") }}</p>
        </div>

        <div class="blog-post">
          <h2>{{ $t("blog.construindoHabitosQueDuram") }}</h2>
          <p class="text-sm text-gray-500 mb-4">{{ $t("blog.publicadoEm5De") }}</p>
          <p>{{ $t("blog.habitosSaoOFundamento") }}</p>
          <p>{{ $t("blog.aprendaAsEstrategiasComprovadas") }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.blog-page {
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
  margin-bottom: 0.5rem;
  font-weight: 600;
  font-size: 1.5rem;
}

p {
  line-height: 1.6;
  margin-bottom: 1rem;
  color: var(--color-text-secondary);
}

.blog-post {
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--color-border);
}

.blog-post:last-child {
  border-bottom: none;
}
</style>

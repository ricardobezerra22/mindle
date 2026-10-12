<script setup lang="ts">
definePageMeta({
  layout: "default",
});

const { t } = useI18n();

useHead({
  title: computed(() => t("methodology.metaTitle")),
  meta: [
    {
      name: "description",
      content: computed(() => t("methodology.metaDescription")),
    },
  ],
});
</script>

<template>
  <div class="methodology-page">
    <div class="container py-12">
      <h1 class="text-4xl font-bold mb-8">{{ $t("methodology.metodologiaMindle") }}</h1>

      <div class="methodology-content max-w-4xl">
        <div class="intro mb-12">
          <p class="text-lg">{{ $t("methodology.aMetodologiaMindleE") }}</p>
        </div>

        <div class="pillar mb-12">
          <h2>{{ $t("methodology.1Organizar") }}</h2>
          <p>{{ $t("methodology.oPrimeiroPassoE") }}</p>
          <ul>
            <li>{{ $t("methodology.crieTarefasComTitulos") }}</li>
            <li>{{ $t("methodology.adicioneDescricoesEContexto") }}</li>
            <li>{{ $t("methodology.organizePorCategoriasE") }}</li>
            <li>{{ $t("methodology.definaPrioridadesEDatas") }}</li>
          </ul>
        </div>

        <div class="pillar mb-12">
          <h2>{{ $t("methodology.2Executar") }}</h2>
          <p>{{ $t("methodology.comSuasTarefasOrganizadas") }}</p>
          <ul>
            <li>{{ $t("methodology.ativeOModoFoco") }}</li>
            <li>{{ $t("methodology.useOTimerDe") }}</li>
            <li>{{ $t("methodology.minimizeDistracoes") }}</li>
            <li>{{ $t("methodology.marqueTarefasComoConcluidas") }}</li>
          </ul>
        </div>

        <div class="pillar mb-12">
          <h2>{{ $t("methodology.3Consolidar") }}</h2>
          <p>{{ $t("methodology.aRepeticaoCriaHabitos") }}</p>
          <ul>
            <li>{{ $t("methodology.crieHabitosQueDeseja") }}</li>
            <li>{{ $t("methodology.marqueComoConcluidoDiariamente") }}</li>
            <li>{{ $t("methodology.vejaSuaSequenciaCrescer") }}</li>
            <li>{{ $t("methodology.recebaRecompensasVisuais") }}</li>
          </ul>
        </div>

        <div class="pillar">
          <h2>{{ $t("methodology.4Conquistar") }}</h2>
          <p>{{ $t("methodology.cadaPequenaAcaoAlimenta") }}</p>
          <ul>
            <li>{{ $t("methodology.definaMetasDeLongo") }}</li>
            <li>{{ $t("methodology.conecteTarefasAsMetas") }}</li>
            <li>{{ $t("methodology.rastreieProgressoVisualmente") }}</li>
            <li>{{ $t("methodology.celebreConquistas") }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.methodology-page {
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
  color: var(--color-primary);
  margin-bottom: 1rem;
  font-weight: 600;
  font-size: 1.5rem;
}

p {
  line-height: 1.6;
  margin-bottom: 1rem;
  color: var(--color-text-secondary);
}

.intro p {
  font-size: 1.125rem;
  color: var(--color-text-primary);
}

.pillar {
  padding-bottom: 2rem;
  border-left: 4px solid var(--color-primary);
  padding-left: 1.5rem;
}

ul {
  margin-left: 1.5rem;
  margin-bottom: 1rem;
}

li {
  margin-bottom: 0.5rem;
  color: var(--color-text-secondary);
}
</style>

<script setup lang="ts">
definePageMeta({
  layout: "default",
});

const { t } = useI18n();

useHead({
  title: computed(() => t("resources.metaTitle")),
  meta: [
    {
      name: "description",
      content: computed(() => t("resources.metaDescription")),
    },
  ],
});
</script>

<template>
  <div class="resources-page">
    <div class="container py-12">
      <h1 class="text-4xl font-bold mb-8">{{ $t("resources.recursosMindle") }}</h1>

      <div class="resources-content max-w-4xl">
        <div class="resource-item mb-12">
          <h2>{{ $t("resources.gestaoDeTarefas") }}</h2>
          <p>{{ $t("resources.organizeSuasTarefasEm") }}</p>
          <ul>
            <li>{{ $t("resources.tarefasComMultiplosNiveis") }}</li>
            <li>{{ $t("resources.categorizacaoAutomatica") }}</li>
            <li>{{ $t("resources.priorizacaoInteligente") }}</li>
            <li>{{ $t("resources.rastreamentoDeProgresso") }}</li>
          </ul>
        </div>

        <div class="resource-item mb-12">
          <h2>{{ $t("resources.modoFoco") }}</h2>
          <p>{{ $t("resources.elimineDistracoesEEntre") }}</p>
          <ul>
            <li>{{ $t("resources.timerDePomodoroCustomizavel") }}</li>
            <li>{{ $t("resources.bloqueioDeDistracoes") }}</li>
            <li>{{ $t("resources.historicoDeSessoes") }}</li>
            <li>{{ $t("resources.analiseDeProdutividade") }}</li>
          </ul>
        </div>

        <div class="resource-item mb-12">
          <h2>{{ $t("resources.rastreamentoDeHabitos") }}</h2>
          <p>{{ $t("resources.construaHabitosDuradourosCom") }}</p>
          <ul>
            <li>{{ $t("resources.habitosDiariosComSequencia") }}</li>
            <li>{{ $t("resources.feedbackVisualBolhasDe") }}</li>
            <li>{{ $t("resources.analiseDeConsistencia") }}</li>
            <li>{{ $t("resources.lembretesPersonalizados") }}</li>
          </ul>
        </div>

        <div class="resource-item mb-12">
          <h2>{{ $t("resources.plannerSemanal") }}</h2>
          <p>{{ $t("resources.visualizeSuaSemanaEm") }}</p>
          <ul>
            <li>{{ $t("resources.visualizacaoDeCalendario") }}</li>
            <li>{{ $t("resources.dragAndDropDe") }}</li>
            <li>{{ $t("resources.visaoGeralSemanal") }}</li>
            <li>{{ $t("resources.planejamentoDeLongoPrazo") }}</li>
          </ul>
        </div>

        <div class="resource-item mb-12">
          <h2>{{ $t("resources.metricasEInsights") }}</h2>
          <p>{{ $t("resources.entendaSeusPadroesDe") }}</p>
          <ul>
            <li>{{ $t("resources.dashboardDeMetricas") }}</li>
            <li>{{ $t("resources.rastreamentoDeHumor") }}</li>
            <li>{{ $t("resources.analiseDeEnergia") }}</li>
            <li>{{ $t("resources.insightsPersonalizados") }}</li>
          </ul>
        </div>

        <div class="resource-item">
          <h2>{{ $t("resources.sincronizacaoEmTempoReal") }}</h2>
          <p>{{ $t("resources.seusDadosSaoSincronizados") }}</p>
          <ul>
            <li>{{ $t("resources.sincronizacaoMultiDispositivo") }}</li>
            <li>{{ $t("resources.acessoOffline") }}</li>
            <li>{{ $t("resources.backupAutomatico") }}</li>
            <li>{{ $t("resources.segurancaDeDados") }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.resources-page {
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
  margin-bottom: 0.75rem;
  font-weight: 600;
  font-size: 1.25rem;
}

p {
  line-height: 1.6;
  margin-bottom: 1rem;
  color: var(--color-text-secondary);
}

.resource-item {
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--color-border);
}

.resource-item:last-child {
  border-bottom: none;
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

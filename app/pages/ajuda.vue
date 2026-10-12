<script setup lang="ts">
definePageMeta({
  layout: false,
});

const { t } = useI18n();

useHead({
  title: computed(() => t("help.metaTitle")),
  meta: [
    {
      name: "description",
      content: computed(() => t("help.metaDescription")),
    },
  ],
});
</script>

<template>
  <div class="help-page">
    <div class="container py-12">
      <h1 class="text-4xl font-bold mb-8">{{ $t("help.centralDeAjuda") }}</h1>

      <div class="help-content max-w-4xl">
        <div class="faq-item mb-8">
          <h2>{{ $t("help.comoFacoParaCriar") }}</h2>
          <p>{{ $t("help.cliqueNoBotaoNova") }}</p>
        </div>

        <div class="faq-item mb-8">
          <h2>{{ $t("help.comoFuncionaOModo") }}</h2>
          <p>{{ $t("help.oModoFocoBloqueia") }}</p>
        </div>

        <div class="faq-item mb-8">
          <h2>{{ $t("help.comoPossoRastrearMeus") }}</h2>
          <p>{{ $t("help.naSecaoDeHabitos") }}</p>
        </div>

        <div class="faq-item mb-8">
          <h2>{{ $t("help.comoFuncionaOPlanner") }}</h2>
          <p>{{ $t("help.oPlannerPermiteQue") }}</p>
        </div>

        <div class="faq-item mb-8">
          <h2>{{ $t("help.possoSincronizarComOutros") }}</h2>
          <p>{{ $t("help.atualmenteOMindleFunciona") }}</p>
        </div>

        <div class="faq-item">
          <h2>{{ $t("help.precisoDeMaisAjuda") }}</h2>
          <p> {{ $t("help.entreEmContatoConosco") }} <a href="mailto:support@mindle.space">support@mindle.space</a> {{ $t("help.ouVisiteNossaComunidade") }} </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.help-page {
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
  color: var(--color-text-secondary);
}

.faq-item {
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--color-border);
}

.faq-item:last-child {
  border-bottom: none;
}

a {
  color: var(--color-primary);
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>

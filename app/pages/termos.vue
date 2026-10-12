<script setup lang="ts">
definePageMeta({
  layout: "legal",
});

const { t } = useI18n();

useHead({
  title: computed(() => t("terms.metaTitle")),
  meta: [
    {
      name: "description",
      content: computed(() => t("terms.metaDescription")),
    },
  ],
});
</script>

<template>
  <div>
    <h1>{{ $t("terms.termosDeServico") }}</h1>

    <h2>{{ $t("terms.1AceitacaoDosTermos") }}</h2>
    <p>{{ $t("terms.aoAcessarEUsar") }}</p>

    <h2>{{ $t("terms.2UsoDaLicenca") }}</h2>
    <p>{{ $t("terms.eConcedidaAVoce") }}</p>

    <h2>{{ $t("terms.3IsencaoDeResponsabilidade") }}</h2>
    <p>{{ $t("terms.oMindleEFornecido") }}</p>

    <h2>{{ $t("terms.4LimitacaoDeResponsabilidade") }}</h2>
    <p>{{ $t("terms.emNenhumCasoA") }}</p>

    <h2>{{ $t("terms.5ModificacoesDosTermos") }}</h2>
    <p>{{ $t("terms.reservamosODireitoDe") }}</p>

    <h2>{{ $t("terms.6Contato") }}</h2>
    <p> {{ $t("terms.seVoceTiverDuvidas") }} <a href="mailto:legal@mindle.space">legal@mindle.space</a>.
    </p>
  </div>
</template>

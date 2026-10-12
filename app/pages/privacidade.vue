<script setup lang="ts">
definePageMeta({
  layout: "legal",
});

const { t } = useI18n();

useHead({
  title: computed(() => t("privacy.metaTitle")),
  meta: [
    {
      name: "description",
      content: computed(() => t("privacy.metaDescription")),
    },
  ],
});
</script>

<template>
  <div>
    <h1>{{ $t("privacy.politicaDePrivacidade") }}</h1>

    <h2>{{ $t("privacy.1Introducao") }}</h2>
    <p>{{ $t("privacy.aMindleNosNosso") }}</p>

    <h2>{{ $t("privacy.2ColetaDeDados") }}</h2>
    <p>{{ $t("privacy.coletamosVariosTiposDe") }}</p>
    <ul>
      <li>{{ $t("privacy.dadosDeContaNome") }}</li>
      <li>{{ $t("privacy.dadosDeUsoTarefas") }}</li>
      <li>{{ $t("privacy.dadosTecnicosIpNavegador") }}</li>
    </ul>

    <h2>{{ $t("privacy.3UsoDeDados") }}</h2>
    <p>{{ $t("privacy.aMindleUsaOs") }}</p>
    <ul>
      <li>{{ $t("privacy.fornecerEManterNosso") }}</li>
      <li>{{ $t("privacy.notificarVoceSobreMudancas") }}</li>
      <li>{{ $t("privacy.permitirQueVoceParticipe") }}</li>
      <li>{{ $t("privacy.fornecerSuporteAoCliente") }}</li>
      <li>{{ $t("privacy.coletarAnalisesParaMelhorar") }}</li>
    </ul>

    <h2>{{ $t("privacy.4SegurancaDeDados") }}</h2>
    <p>{{ $t("privacy.aSegurancaDeSeus") }}</p>

    <h2>{{ $t("privacy.5Contato") }}</h2>
    <p> {{ $t("privacy.seVoceTiverDuvidas") }} <a href="mailto:privacy@mindle.space">privacy@mindle.space</a>.
    </p>
  </div>
</template>

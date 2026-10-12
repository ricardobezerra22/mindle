<script setup lang="ts">
definePageMeta({
  layout: "legal",
});

const { t } = useI18n();

useHead({
  title: computed(() => t("cookies.metaTitle")),
  meta: [
    {
      name: "description",
      content: computed(() => t("cookies.metaDescription")),
    },
  ],
});
</script>

<template>
  <div>
    <h1>{{ $t("cookies.politicaDeCookies") }}</h1>

    <h2>{{ $t("cookies.1OQueSao") }}</h2>
    <p>{{ $t("cookies.cookiesSaoPequenosArquivos") }}</p>

    <h2>{{ $t("cookies.2ComoUsamosCookies") }}</h2>
    <p>{{ $t("cookies.usamosCookiesPara") }}</p>
    <ul>
      <li>{{ $t("cookies.manterVoceConectadoA") }}</li>
      <li>{{ $t("cookies.lembrarSuasPreferencias") }}</li>
      <li>{{ $t("cookies.analisarComoVoceUsa") }}</li>
      <li>{{ $t("cookies.melhorarAFuncionalidadeDo") }}</li>
    </ul>

    <h2>{{ $t("cookies.3TiposDeCookies") }}</h2>
    <ul>
      <li><strong>{{ $t("cookies.cookiesEssenciais") }}</strong> {{ $t("cookies.necessariosParaOFuncionamento") }}</li>
      <li><strong>{{ $t("cookies.cookiesDeAnalise") }}</strong> {{ $t("cookies.ajudamNosAEntender") }}</li>
      <li><strong>{{ $t("cookies.cookiesDePreferencia") }}</strong> {{ $t("cookies.lembramSuasEscolhasE") }}</li>
    </ul>

    <h2>{{ $t("cookies.4ControleDeCookies") }}</h2>
    <p> {{ $t("cookies.vocePodeControlarE") }} <a
        href="https://www.allaboutcookies.org/"
        target="_blank"
      >allaboutcookies.org</a>.
    </p>

    <h2>{{ $t("cookies.5Contato") }}</h2>
    <p> {{ $t("cookies.seVoceTiverDuvidas") }} <a href="mailto:privacy@mindle.space">privacy@mindle.space</a>.
    </p>
  </div>
</template>

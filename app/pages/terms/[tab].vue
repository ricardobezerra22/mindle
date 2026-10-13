<script setup lang="ts">
definePageMeta({ layout: false });

const { t } = useI18n();
const route = useRoute();

const TABS = ["service", "privacy", "cookies"] as const;
type Tab = (typeof TABS)[number];

const tab = computed(() => {
  const t = route.params.tab as string;
  return TABS.includes(t as Tab) ? (t as Tab) : "service";
});

if (!TABS.includes(route.params.tab as Tab)) {
  await navigateTo("/terms/service", { replace: true });
}

const tabLabels: Record<Tab, string> = {
  service: t("legal.terms"),
  privacy: t("legal.privacy"),
  cookies: t("legal.cookies"),
};

useHead({
  title: computed(() => `${tabLabels[tab.value]} - Mindle`),
});
</script>

<template>
  <div class="terms-page">
    <nav class="terms-nav">
      <NuxtLink
        to="/"
        class="nav-logo"
      >
        <img
          src="/mindle-logo.png"
          alt="Mindle"
          class="logo-img"
        />
        <span>Mindle</span>
      </NuxtLink>
    </nav>

    <div class="terms-container">
      <div class="tabs-row">
        <NuxtLink
          v-for="t in TABS"
          :key="t"
          :to="`/terms/${t}`"
          :class="['tab', { active: tab === t }]"
        >
          {{ tabLabels[t] }}
        </NuxtLink>
      </div>

      <main class="terms-content">
        <template v-if="tab === 'service'">
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
          <p>
            {{ $t("terms.seVoceTiverDuvidas") }}
            <a href="mailto:legal@mindle.space">legal@mindle.space</a>.
          </p>
        </template>

        <template v-else-if="tab === 'privacy'">
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
          <p>
            {{ $t("privacy.seVoceTiverDuvidas") }}
            <a href="mailto:privacy@mindle.space">privacy@mindle.space</a>.
          </p>
        </template>

        <template v-else>
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
            <li>
              <strong>{{ $t("cookies.cookiesEssenciais") }}</strong>
              {{ $t("cookies.necessariosParaOFuncionamento") }}
            </li>
            <li>
              <strong>{{ $t("cookies.cookiesDeAnalise") }}</strong>
              {{ $t("cookies.ajudamNosAEntender") }}
            </li>
            <li>
              <strong>{{ $t("cookies.cookiesDePreferencia") }}</strong>
              {{ $t("cookies.lembramSuasEscolhasE") }}
            </li>
          </ul>
          <h2>{{ $t("cookies.4ControleDeCookies") }}</h2>
          <p>
            {{ $t("cookies.vocePodeControlarE") }}
            <a
              href="https://www.allaboutcookies.org/"
              target="_blank"
            >allaboutcookies.org</a>.
          </p>
          <h2>{{ $t("cookies.5Contato") }}</h2>
          <p>
            {{ $t("cookies.seVoceTiverDuvidas") }}
            <a href="mailto:privacy@mindle.space">privacy@mindle.space</a>.
          </p>
        </template>
      </main>
    </div>

    <footer class="terms-footer">
      <p>{{ $t("legal.copyright") }}</p>
      <NuxtLink
        to="/"
        class="footer-link"
      >
        {{ $t("legal.voltarParaHome") }}
      </NuxtLink>
    </footer>
  </div>
</template>

<style scoped>
.terms-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--color-background);
  color: var(--color-text-primary);
}

.terms-nav {
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  padding: 1rem 1.5rem;
  position: sticky;
  top: 0;
  z-index: 10;
}

.nav-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: var(--color-text-primary);
  font-weight: 600;
  font-size: 1.125rem;
  width: fit-content;
}

.nav-logo:hover {
  opacity: 0.8;
}

.logo-img {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.terms-container {
  flex: 1;
  max-width: 760px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

.tabs-row {
  display: flex;
  gap: 4px;
  margin-bottom: 2rem;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 0;
}

.tab {
  padding: 10px 18px;
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--color-text-secondary);
  text-decoration: none;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  transition: all 0.2s ease;
}

.tab:hover {
  color: var(--color-text-primary);
}

.tab.active {
  color: var(--color-primary-dark);
  border-bottom-color: var(--color-primary-dark);
}

.terms-content h1 {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-primary-dark);
  margin: 0 0 1.75rem;
}

.terms-content h2 {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 1.75rem 0 0.625rem;
}

.terms-content p {
  line-height: 1.7;
  color: var(--color-text-secondary);
  margin: 0 0 1rem;
}

.terms-content ul {
  margin: 0 0 1rem 1.5rem;
}

.terms-content li {
  line-height: 1.7;
  color: var(--color-text-secondary);
  margin-bottom: 0.375rem;
}

.terms-content a {
  color: var(--color-primary-dark);
  text-decoration: underline;
  text-underline-offset: 2px;
}

.terms-footer {
  background: var(--color-surface);
  border-top: 1px solid var(--color-border);
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}

.footer-link {
  color: var(--color-primary-dark);
  text-decoration: none;
  transition: opacity 0.2s ease;
}

.footer-link:hover {
  opacity: 0.75;
}

@media (max-width: 600px) {
  .terms-container {
    padding: 1.5rem 1rem;
  }

  .tabs-row {
    gap: 0;
  }

  .tab {
    flex: 1;
    text-align: center;
    padding: 10px 8px;
    font-size: 0.875rem;
  }

  .terms-content h1 {
    font-size: 1.5rem;
  }

  .terms-footer {
    flex-direction: column;
    text-align: center;
  }
}
</style>

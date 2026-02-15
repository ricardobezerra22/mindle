<script setup lang="ts">
definePageMeta({
  layout: false,
});

useHead({
  title: "Comunidade - Mindle",
  meta: [
    {
      name: "description",
      content: "Conecte-se com outras pessoas que usam Mindle e compartilhe experiências.",
    },
  ],
});
</script>

<template>
  <div class="community-page">
    <div class="container py-12">
      <h1 class="text-4xl font-bold mb-8">Comunidade Mindle</h1>

      <div class="community-content max-w-4xl">
        <div class="section mb-12">
          <h2>Junte-se à Nossa Comunidade</h2>
          <p>
            A comunidade Mindle é um espaço seguro e acolhedor para pessoas neurodiversas compartilharem suas
            experiências, dicas e apoio mútuo.
          </p>
        </div>

        <div class="section mb-12">
          <h2>Discord</h2>
          <p>
            Conecte-se com outros usuários do Mindle em nosso servidor Discord. Compartilhe dicas, faça perguntas e
            celebre suas vitórias juntos.
          </p>
          <p>
            <a href="https://discord.gg/mindle" target="_blank" class="btn-link">Entrar no Discord</a>
          </p>
        </div>

        <div class="section mb-12">
          <h2>Fórum</h2>
          <p>
            Nosso fórum é um lugar para discussões mais profundas sobre produtividade, ADHD e bem-estar. Faça
            perguntas, compartilhe recursos e aprenda com a comunidade.
          </p>
        </div>

        <div class="section">
          <h2>Eventos</h2>
          <p>
            Participamos regularmente de webinars, workshops e encontros da comunidade. Fique atento para as próximas
            datas!
          </p>
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

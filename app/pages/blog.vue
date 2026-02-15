<script setup lang="ts">
definePageMeta({
  layout: false,
});

useHead({
  title: "Blog - Mindle",
  meta: [
    {
      name: "description",
      content: "Leia artigos e dicas sobre produtividade, ADHD e bem-estar.",
    },
  ],
});
</script>

<template>
  <div class="blog-page">
    <div class="container py-12">
      <h1 class="text-4xl font-bold mb-8">Blog Mindle</h1>

      <div class="blog-content max-w-4xl">
        <div class="blog-post mb-12">
          <h2>Produtividade para Mentes Neurodiversas</h2>
          <p class="text-sm text-gray-500 mb-4">Publicado em 15 de Fevereiro, 2025</p>
          <p>
            Entender como sua mente funciona é o primeiro passo para construir um sistema de produtividade que realmente
            funciona. Para pessoas com ADHD, a abordagem tradicional de gestão de tarefas frequentemente falha porque não
            leva em conta as características únicas do cérebro neurodiverso.
          </p>
          <p>
            O Mindle foi projetado especificamente para trabalhar com seu cérebro, não contra ele. Com recursos como
            timers integrados, feedback visual imediato e gamificação de hábitos, você pode finalmente construir uma
            rotina que funciona.
          </p>
        </div>

        <div class="blog-post mb-12">
          <h2>A Importância do Foco Profundo</h2>
          <p class="text-sm text-gray-500 mb-4">Publicado em 10 de Fevereiro, 2025</p>
          <p>
            Foco profundo é a capacidade de concentrar-se totalmente em uma tarefa desafiadora sem distração. Para
            pessoas com ADHD, isso pode ser especialmente difícil, mas também incrivelmente recompensador.
          </p>
          <p>
            Descubra como usar a técnica de Pomodoro adaptada, criar um ambiente sem distrações e usar o Mindle para
            rastrear suas sessões de foco.
          </p>
        </div>

        <div class="blog-post">
          <h2>Construindo Hábitos que Duram</h2>
          <p class="text-sm text-gray-500 mb-4">Publicado em 5 de Fevereiro, 2025</p>
          <p>
            Hábitos são o fundamento de uma vida produtiva e saudável. Mas como você constrói hábitos quando seu cérebro
            funciona diferente? A chave está em começar pequeno, rastrear progresso visualmente e celebrar vitórias.
          </p>
          <p>
            Aprenda as estratégias comprovadas para construir hábitos duradouros com o Mindle.
          </p>
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

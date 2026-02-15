<script setup lang="ts">
definePageMeta({
  layout: "default",
});

useHead({
  title: "Metodologia Mindle - O Fluxo Interconectado",
  meta: [
    {
      name: "description",
      content:
        "Conheça a metodologia Mindle: Organizar, Executar, Consolidar e Conquistar. Um sistema interconectado para mentes neurodiversas.",
    },
  ],
});
</script>

<template>
  <div class="methodology-page">
    <div class="container py-12">
      <h1 class="text-4xl font-bold mb-8">Metodologia Mindle</h1>

      <div class="methodology-content max-w-4xl">
        <div class="intro mb-12">
          <p class="text-lg">
            A metodologia Mindle é baseada em um sistema interconectado de quatro pilares que trabalham juntos para
            transformar intenção em ação.
          </p>
        </div>

        <div class="pillar mb-12">
          <h2>1. Organizar</h2>
          <p>
            O primeiro passo é despejar todas as suas ideias, tarefas e metas no Mindle. Não se preocupe com a ordem
            ou prioridade neste momento. O sistema categoriza e prioriza automaticamente, ajudando você a ver claramente
            o que precisa ser feito.
          </p>
          <ul>
            <li>Crie tarefas com títulos claros</li>
            <li>Adicione descrições e contexto</li>
            <li>Organize por categorias e projetos</li>
            <li>Defina prioridades e datas de vencimento</li>
          </ul>
        </div>

        <div class="pillar mb-12">
          <h2>2. Executar</h2>
          <p>
            Com suas tarefas organizadas, é hora de agir. O modo Foco do Mindle bloqueia distrações e permite que você
            se concentre em uma coisa de cada vez. Use o timer integrado para sessões de foco profundo.
          </p>
          <ul>
            <li>Ative o modo Foco para uma tarefa</li>
            <li>Use o timer de Pomodoro (25 minutos)</li>
            <li>Minimize distrações</li>
            <li>Marque tarefas como concluídas</li>
          </ul>
        </div>

        <div class="pillar mb-12">
          <h2>3. Consolidar</h2>
          <p>
            A repetição cria hábitos. Rastreie seus hábitos diários no Mindle e veja sua sequência crescer. O feedback
            visual imediato (bolhas de hábito) fornece satisfação real ao completar ações.
          </p>
          <ul>
            <li>Crie hábitos que deseja desenvolver</li>
            <li>Marque como concluído diariamente</li>
            <li>Veja sua sequência crescer</li>
            <li>Receba recompensas visuais</li>
          </ul>
        </div>

        <div class="pillar">
          <h2>4. Conquistar</h2>
          <p>
            Cada pequena ação alimenta suas grandes metas. Use o Mindle para rastrear o progresso em direção aos seus
            objetivos de longo prazo. Veja como tarefas diárias e hábitos se conectam às suas metas maiores.
          </p>
          <ul>
            <li>Defina metas de longo prazo</li>
            <li>Conecte tarefas às metas</li>
            <li>Rastreie progresso visualmente</li>
            <li>Celebre conquistas</li>
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

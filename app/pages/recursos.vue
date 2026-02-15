<script setup lang="ts">
definePageMeta({
  layout: "default",
});

useHead({
  title: "Recursos - Mindle",
  meta: [
    {
      name: "description",
      content: "Explore os recursos principais do Mindle e como eles podem ajudar você.",
    },
  ],
});
</script>

<template>
  <div class="resources-page">
    <div class="container py-12">
      <h1 class="text-4xl font-bold mb-8">Recursos Mindle</h1>

      <div class="resources-content max-w-4xl">
        <div class="resource-item mb-12">
          <h2>Gestão de Tarefas</h2>
          <p>
            Organize suas tarefas em categorias, defina prioridades e datas de vencimento. Crie subtarefas para quebrar
            projetos grandes em passos menores e gerenciáveis.
          </p>
          <ul>
            <li>Tarefas com múltiplos níveis</li>
            <li>Categorização automática</li>
            <li>Priorização inteligente</li>
            <li>Rastreamento de progresso</li>
          </ul>
        </div>

        <div class="resource-item mb-12">
          <h2>Modo Foco</h2>
          <p>
            Elimine distrações e entre em um estado de foco profundo. O timer integrado ajuda você a manter sessões
            produtivas e rastreia seu tempo de foco ao longo do tempo.
          </p>
          <ul>
            <li>Timer de Pomodoro customizável</li>
            <li>Bloqueio de distrações</li>
            <li>Histórico de sessões</li>
            <li>Análise de produtividade</li>
          </ul>
        </div>

        <div class="resource-item mb-12">
          <h2>Rastreamento de Hábitos</h2>
          <p>
            Construa hábitos duradouros com feedback visual imediato. Veja sua sequência crescer e celebre suas
            vitórias com recompensas visuais satisfatórias.
          </p>
          <ul>
            <li>Hábitos diários com sequência</li>
            <li>Feedback visual (bolhas de hábito)</li>
            <li>Análise de consistência</li>
            <li>Lembretes personalizados</li>
          </ul>
        </div>

        <div class="resource-item mb-12">
          <h2>Planner Semanal</h2>
          <p>
            Visualize sua semana em um calendário interativo. Arraste e solte tarefas para reorganizar sua agenda e
            planeje com antecedência.
          </p>
          <ul>
            <li>Visualização de calendário</li>
            <li>Drag and drop de tarefas</li>
            <li>Visão geral semanal</li>
            <li>Planejamento de longo prazo</li>
          </ul>
        </div>

        <div class="resource-item mb-12">
          <h2>Métricas e Insights</h2>
          <p>
            Entenda seus padrões de produtividade. Rastreie seu humor, energia e correlacione com sua produtividade
            para otimizar seu desempenho.
          </p>
          <ul>
            <li>Dashboard de métricas</li>
            <li>Rastreamento de humor</li>
            <li>Análise de energia</li>
            <li>Insights personalizados</li>
          </ul>
        </div>

        <div class="resource-item">
          <h2>Sincronização em Tempo Real</h2>
          <p>
            Seus dados são sincronizados em tempo real entre todos os seus dispositivos. Comece uma tarefa no desktop
            e continue no celular sem problemas.
          </p>
          <ul>
            <li>Sincronização multi-dispositivo</li>
            <li>Acesso offline</li>
            <li>Backup automático</li>
            <li>Segurança de dados</li>
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

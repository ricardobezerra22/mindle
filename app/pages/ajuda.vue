<script setup lang="ts">
definePageMeta({
  layout: false,
});

useHead({
  title: "Central de Ajuda - Mindle",
  meta: [
    {
      name: "description",
      content: "Encontre respostas para suas dúvidas sobre o Mindle.",
    },
  ],
});
</script>

<template>
  <div class="help-page">
    <div class="container py-12">
      <h1 class="text-4xl font-bold mb-8">Central de Ajuda</h1>

      <div class="help-content max-w-4xl">
        <div class="faq-item mb-8">
          <h2>Como faço para criar uma tarefa?</h2>
          <p>
            Clique no botão "Nova Tarefa" na página de tarefas. Preencha o título, descrição, prioridade e data de
            vencimento. Você também pode adicionar subtarefas e categorias.
          </p>
        </div>

        <div class="faq-item mb-8">
          <h2>Como funciona o modo Foco?</h2>
          <p>
            O modo Foco bloqueia distrações e permite que você se concentre em uma única tarefa. Use o timer integrado
            para sessões de Pomodoro e rastreie seu progresso.
          </p>
        </div>

        <div class="faq-item mb-8">
          <h2>Como posso rastrear meus hábitos?</h2>
          <p>
            Na seção de Hábitos, crie novos hábitos que deseja desenvolver. Marque como concluído diariamente e veja
            sua sequência crescer. O Mindle fornece feedback visual para motivá-lo.
          </p>
        </div>

        <div class="faq-item mb-8">
          <h2>Como funciona o Planner?</h2>
          <p>
            O Planner permite que você visualize suas tarefas em um calendário. Você pode arrastar e soltar tarefas
            para reorganizar sua semana e planejar com antecedência.
          </p>
        </div>

        <div class="faq-item mb-8">
          <h2>Posso sincronizar com outros aplicativos?</h2>
          <p>
            Atualmente, o Mindle funciona como um sistema independente. Estamos trabalhando em integrações com outros
            aplicativos populares.
          </p>
        </div>

        <div class="faq-item">
          <h2>Preciso de mais ajuda?</h2>
          <p>
            Entre em contato conosco em
            <a href="mailto:support@mindle.space">support@mindle.space</a> ou visite nossa comunidade no Discord.
          </p>
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

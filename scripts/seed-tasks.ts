import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const USER_EMAIL = process.argv[2] ?? "niverton.neves@gmail.com";

const TASKS = [
  { title: "Revisar relatório financeiro para enviar ao cliente", priority: "HIGH",  dueDate: "2026-10-16", category: "Trabalho" },
  { title: "Corrigir bugs críticos identificados em produção",    priority: "HIGH",  dueDate: "2026-10-12", category: "Desenvolvimento" },
  { title: "Preparar apresentação de resultados do trimestre",    priority: "HIGH",  dueDate: "2026-10-15", category: "Trabalho" },
  { title: "Responder aos emails pendentes de clientes",          priority: "MEDIUM",dueDate: "2026-10-13", category: "Comunicação" },
  { title: "Implementar autenticação com OAuth2",                 priority: "HIGH",  dueDate: "2026-10-20", category: "Desenvolvimento" },
  { title: "Atualizar documentação técnica da API",               priority: "MEDIUM",dueDate: "2026-10-16", category: "Documentação" },
  { title: "Rever orçamento mensal e despesas recorrentes",       priority: "HIGH",  dueDate: "2026-10-14", category: "Finanças" },
  { title: "Agendar reunião de alinhamento com a equipa",         priority: "MEDIUM",dueDate: "2026-10-13", category: "Reuniões" },
  { title: "Escrever testes unitários para o módulo de pagamentos",priority: "HIGH", dueDate: "2026-10-19", category: "Desenvolvimento" },
  { title: "Fazer deploy da nova versão para staging",            priority: "HIGH",  dueDate: "2026-10-15", category: "DevOps" },
  { title: "Organizar tarefas pendentes no Jira",                 priority: "LOW",   dueDate: "2026-10-17", category: "Organização" },
  { title: "Estudar conceitos de arquitetura orientada a eventos",priority: "MEDIUM",dueDate: "2026-10-22", category: "Aprendizagem" },
  { title: "Preparar feedback de desempenho para a equipa",       priority: "MEDIUM",dueDate: "2026-10-21", category: "Gestão" },
  { title: "Otimizar consultas SQL lentas",                       priority: "HIGH",  dueDate: "2026-10-16", category: "Desenvolvimento" },
  { title: "Renovar certificado SSL do ambiente de produção",     priority: "HIGH",  dueDate: "2026-10-12", category: "Infraestrutura" },
  { title: "Criar wireframes para a nova funcionalidade",         priority: "MEDIUM",dueDate: "2026-10-20", category: "Design" },
  { title: "Validar acessibilidade WCAG nas páginas principais",  priority: "HIGH",  dueDate: "2026-10-19", category: "Qualidade" },
  { title: "Fazer backup e verificar integridade da base de dados",priority: "HIGH", dueDate: "2026-10-14", category: "Infraestrutura" },
  { title: "Planear objetivos e prioridades da próxima semana",   priority: "LOW",   dueDate: "2026-10-18", category: "Planeamento" },
  { title: "Enviar proposta comercial atualizada ao potencial cliente",priority:"HIGH",dueDate:"2026-10-16",category:"Comercial" },
] as const;

const PALETTE = [
  "#6faf8e","#7eb5d6","#e88c8c","#f0c27f","#a78bfa",
  "#34d399","#fb923c","#60a5fa","#f472b6","#a3e635",
  "#38bdf8","#c084fc","#f9a8d4","#86efac","#fcd34d",
];

async function main() {
  const user = await prisma.user.findUnique({ where: { email: USER_EMAIL }, select: { id: true } });
  if (!user) throw new Error(`User not found: ${USER_EMAIL}`);

  const existingCats = await prisma.taskCategory.findMany({
    where: { userId: user.id },
    select: { id: true, name: true, color: true },
  });
  const catMap = new Map(existingCats.map(c => [c.name, c.id]));
  const usedColors = new Set(existingCats.map(c => c.color));

  let paletteIdx = 0;
  function nextColor() {
    while (paletteIdx < PALETTE.length && usedColors.has(PALETTE[paletteIdx]!)) paletteIdx++;
    const color = PALETTE[paletteIdx] ?? PALETTE[paletteIdx % PALETTE.length]!;
    usedColors.add(color);
    paletteIdx++;
    return color;
  }

  const neededCategories = [...new Set(TASKS.map(t => t.category))];
  for (const name of neededCategories) {
    if (!catMap.has(name)) {
      const cat = await prisma.taskCategory.create({ data: { name, color: nextColor(), userId: user.id } });
      catMap.set(name, cat.id);
      console.log(`  + category: ${name}`);
    }
  }

  const lastTask = await prisma.task.findFirst({
    where: { userId: user.id },
    orderBy: { position: "desc" },
    select: { position: true },
  });
  let pos = (lastTask?.position ?? 0) + 1;

  for (const t of TASKS) {
    const categoryId = catMap.get(t.category)!;
    await prisma.task.create({
      data: {
        title: t.title,
        priority: t.priority,
        dueDate: new Date(t.dueDate),
        categoryId,
        status: "NOT_STARTED",
        isFavorite: false,
        position: pos++,
        userId: user.id,
        timeSpent: 0,
      },
    });
    console.log(`  ✓ ${t.title}`);
  }

  console.log(`\nDone: ${TASKS.length} tasks inserted.`);
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());

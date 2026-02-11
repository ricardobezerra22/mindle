interface DailyTrackingData {
  name: string;
  pendingTasks: number;
  dueTodayTasks: number;
  overdueTasks: number;
  activeGoals: number;
  goalAtRisk: number;
  streakHabits: number;
  totalHabits: number;
}
const baseStyles = `
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #1f2d2b;
  line-height: 1.6;
`;

export const buildLayout = (content: string) => `
<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
<body style="margin:0;padding:0;background-color:#f7faf9;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f7faf9;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.06);">
        <tr><td style="padding:32px 40px 0;text-align:center;">
          <span style="font-size:24px;font-weight:700;color:#6faf8e;${baseStyles}">mindle</span>
        </td></tr>
        <tr><td style="padding:24px 40px 32px;${baseStyles}">
          ${content}
        </td></tr>
        <tr><td style="padding:20px 40px;border-top:1px solid #e3ece9;text-align:center;${baseStyles}">
          <p style="font-size:12px;color:#6b7c7a;margin:0;">
            Você recebeu este email porque tem uma conta no <a href="https://mindle.space" style="color:#6faf8e;text-decoration:none;">Mindle</a>.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
`;

export const welcomeTemplate = (name: string) =>
  buildLayout(`
  <h1 style="font-size:22px;font-weight:700;margin:0 0 8px;color:#1f2d2b;">
    Bem-vindo ao Mindle, ${name}! 🌿
  </h1>
  <p style="font-size:15px;color:#6b7c7a;margin:0 0 24px;">
    Estamos felizes em ter você aqui. O Mindle foi feito para te ajudar a organizar suas tarefas, projetos e metas com clareza e foco.
  </p>

  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
    <tr>
      <td style="padding:16px 20px;background:#f0f7f4;border-radius:10px;">
        <p style="margin:0 0 12px;font-size:14px;font-weight:600;color:#1f2d2b;">O que você pode fazer:</p>
        <table cellpadding="0" cellspacing="0">
          <tr><td style="padding:4px 0;font-size:14px;color:#1f2d2b;">✅ Criar e organizar <strong>tarefas</strong> com prioridades</td></tr>
          <tr><td style="padding:4px 0;font-size:14px;color:#1f2d2b;">📁 Estruturar <strong>projetos</strong> com tópicos e subtópicos</td></tr>
          <tr><td style="padding:4px 0;font-size:14px;color:#1f2d2b;">🎯 Definir <strong>metas</strong> e acompanhar seu progresso</td></tr>
          <tr><td style="padding:4px 0;font-size:14px;color:#1f2d2b;">📅 Planejar sua semana com o <strong>planner</strong></td></tr>
          <tr><td style="padding:4px 0;font-size:14px;color:#1f2d2b;">🧘 Manter <strong>hábitos</strong> saudáveis</td></tr>
        </table>
      </td>
    </tr>
  </table>

  <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
    <tr><td style="background:#6faf8e;border-radius:8px;padding:12px 28px;">
      <a href="https://mindle.space" style="color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;display:inline-block;">
        Acessar o Mindle →
      </a>
    </td></tr>
  </table>

  <p style="font-size:13px;color:#6b7c7a;margin:24px 0 0;text-align:center;">
    Qualquer dúvida, estamos aqui para ajudar.
  </p>
`);

export const dailyTrackingTemplate = (data: DailyTrackingData) => {
  const greeting = getGreeting();

  const urgentItems: string[] = [];
  if (data.overdueTasks > 0) {
    urgentItems.push(
      `⚠️ <strong>${data.overdueTasks}</strong> tarefa${data.overdueTasks > 1 ? "s" : ""} atrasada${data.overdueTasks > 1 ? "s" : ""}`,
    );
  }
  if (data.dueTodayTasks > 0) {
    urgentItems.push(
      `📌 <strong>${data.dueTodayTasks}</strong> tarefa${data.dueTodayTasks > 1 ? "s" : ""} para hoje`,
    );
  }
  if (data.goalAtRisk > 0) {
    urgentItems.push(
      `🔥 <strong>${data.goalAtRisk}</strong> meta${data.goalAtRisk > 1 ? "s" : ""} em risco`,
    );
  }

  const urgentSection =
    urgentItems.length > 0
      ? `<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
        <tr><td style="padding:14px 18px;background:#fef3c7;border-radius:8px;border-left:4px solid #f59e0b;">
          ${urgentItems.map((item) => `<p style="margin:4px 0;font-size:14px;color:#92400e;">${item}</p>`).join("")}
        </td></tr>
      </table>`
      : "";

  return buildLayout(`
    <h1 style="font-size:20px;font-weight:700;margin:0 0 4px;color:#1f2d2b;">
      ${greeting}, ${data.name}! ☀️
    </h1>
    <p style="font-size:14px;color:#6b7c7a;margin:0 0 20px;">
      Aqui está o resumo do seu dia no Mindle.
    </p>

    ${urgentSection}

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
      <tr>
        <td width="50%" style="padding:12px 16px;background:#f0f7f4;border-radius:8px;">
          <p style="font-size:11px;font-weight:600;color:#6b7c7a;margin:0;text-transform:uppercase;letter-spacing:0.5px;">Tarefas pendentes</p>
          <p style="font-size:24px;font-weight:700;color:#1f2d2b;margin:4px 0 0;">${data.pendingTasks}</p>
        </td>
        <td width="8"></td>
        <td width="50%" style="padding:12px 16px;background:#f0f7f4;border-radius:8px;">
          <p style="font-size:11px;font-weight:600;color:#6b7c7a;margin:0;text-transform:uppercase;letter-spacing:0.5px;">Metas ativas</p>
          <p style="font-size:24px;font-weight:700;color:#1f2d2b;margin:4px 0 0;">${data.activeGoals}</p>
        </td>
      </tr>
    </table>

    ${
      data.totalHabits > 0
        ? `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
      <tr><td style="padding:12px 16px;background:#f0f7f4;border-radius:8px;">
        <p style="font-size:11px;font-weight:600;color:#6b7c7a;margin:0;text-transform:uppercase;letter-spacing:0.5px;">Hábitos</p>
        <p style="font-size:14px;color:#1f2d2b;margin:6px 0 0;">
          ${
            data.streakHabits > 0
              ? `🔥 <strong>${data.streakHabits}</strong> de ${data.totalHabits} hábitos em dia`
              : `Nenhum hábito registrado ontem. Hoje é um novo dia!`
          }
        </p>
      </td></tr>
    </table>`
        : ""
    }

    <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
      <tr><td style="background:#6faf8e;border-radius:8px;padding:12px 28px;">
        <a href="https://mindle.space" style="color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;display:inline-block;">
          Abrir o Mindle →
        </a>
      </td></tr>
    </table>

    <p style="font-size:13px;color:#6b7c7a;margin:20px 0 0;text-align:center;">
      Um passo de cada vez. Você consegue. 💪
    </p>
  `);
};
export const buildDailySubject = (
  overdue: number,
  today: number,
  pending: number,
): string => {
  if (overdue > 0)
    return `⚠️ ${overdue} tarefa${overdue > 1 ? "s" : ""} atrasada${overdue > 1 ? "s" : ""} — Seu resumo diário`;
  if (today > 0)
    return `📌 ${today} tarefa${today > 1 ? "s" : ""} para hoje — Seu resumo diário`;
  if (pending > 0)
    return `📋 ${pending} tarefa${pending > 1 ? "s" : ""} pendente${pending > 1 ? "s" : ""} — Seu resumo diário`;
  return "☀️ Seu resumo diário — Mindle";
};
export const getGreeting = () => {
  const hour = new Date().getUTCHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
};

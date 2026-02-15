<script setup>
definePageMeta({
  layout: "none",
});

useHead({
  title: "Mindle - Clareza Mental para ADHD | Gestão de Tarefas e Produtividade",
  meta: [
    {
      name: "description",
      content:
        "Mindle: O ecossistema que organiza sua vida, reduz a ansiedade e conecta tarefas, hábitos e metas em um único lugar. Projetado para neurodiversidade.",
    },
    {
      name: "keywords",
      content:
        "ADHD, gestão de tarefas, produtividade, hábitos, foco, bem-estar, neurodiversidade, planner",
    },
    {
      property: "og:title",
      content: "Mindle - Clareza Mental para ADHD",
    },
    {
      property: "og:description",
      content:
        "Sistema interconectado de gestão de tarefas, hábitos, foco e bem-estar para mentes neurodiversas.",
    },
    {
      property: "og:type",
      content: "website",
    },
    {
      name: "twitter:card",
      content: "summary_large_image",
    },
    {
      name: "twitter:title",
      content: "Mindle - Clareza Mental para ADHD",
    },
    {
      name: "twitter:description",
      content:
        "Organize sua vida, reduza ansiedade e conecte tarefas, hábitos e metas em um único lugar.",
    },
    {
      name: "viewport",
      content: "width=device-width, initial-scale=1",
    },
    {
      name: "theme-color",
      content: "#6faf8e",
    },
  ],
  link: [
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    {
      rel: "preconnect",
      href: "https://fonts.gstatic.com",
      crossorigin: "anonymous",
    },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap",
    },
  ],
});
</script>

<template>
  <div class="mindle-landing">
    <nav class="navbar">
      <div
        class="container flex justify-between items-center"
        style="width: 100%"
      >
        <div class="flex items-center gap-2">
          <img src="/mindle-logo.png" alt="Mindle" class="logo-img" />
          <span class="logo-text">Mindle</span>
        </div>
        <div class="nav-links">
          <a href="#metodologia">Método</a>
          <a href="#recursos">Recursos</a>
        </div>
        <div class="nav-actions">
          <NuxtLink
            to="/auth/login"
            class="login-link"
            >Login</NuxtLink
          >
          <NuxtLink
            to="/auth/login"
            class="btn btn-dark"
            >Começar</NuxtLink
          >
        </div>
      </div>
    </nav>

    <header class="hero">
      <div class="bg-grid"></div>
      <div class="blob-1"></div>
      <div class="blob-2"></div>

      <div class="container">
        <div class="tag">
          <div class="ping">
            <span class="ping-circle"></span>
            <span class="ping-dot"></span>
          </div>
          Design focado em neurodiversidade
        </div>

        <h1>
          Clareza mental para transformar
          <br
            style="display: none"
            class="md-break"
          />
          <span>
            intenção em ação.
            <svg
              preserveAspectRatio="none"
              viewBox="0 0 100 10"
            >
              <path
                d="M0 5 Q 50 10 100 5"
                fill="none"
                stroke="currentColor"
                stroke-width="3"
              ></path>
            </svg>
          </span>
        </h1>

        <p>
          O ecossistema que organiza sua vida, reduz a ansiedade e conecta
          tarefas, hábitos e metas em um fluxo único e natural.
        </p>

        <div class="hero-buttons">
          <NuxtLink
            to="/"
            class="btn btn-primary"
          >
            Começar gratuitamente
            <Icon
              name="lucide:arrow-right"
              size="20"
            />
          </NuxtLink>
          <button class="btn btn-outline">
            <Icon
              name="lucide:play"
              size="20"
              style="color: var(--text-light)"
            />
            Ver como funciona
          </button>
        </div>

        <div class="mockup-container">
          <div class="mockup-gradient"></div>
          <div class="mockup-window">
            <div class="mockup-header">
              <div class="mockup-dots">
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
            <div class="mockup-body">
              <div class="mockup-sidebar">
                <div
                  class="flex items-center gap-3"
                  style="margin-bottom: 2.5rem; padding-left: 0.5rem"
                >
                  <div
                    style="
                      width: 24px;
                      height: 24px;
                      border-radius: 4px;
                      background: var(--primary);
                    "
                  ></div>
                  <span style="font-weight: 700; color: var(--text-main)"
                    >Mindle</span
                  >
                </div>
                <div>
                  <div class="sidebar-item active">
                    <Icon
                      name="lucide:layout-dashboard"
                      size="18"
                    />
                    Dashboard
                  </div>
                  <div class="sidebar-item">
                    <Icon
                      name="lucide:check-circle"
                      size="18"
                    />
                    Tarefas
                  </div>
                  <div class="sidebar-item">
                    <Icon
                      name="lucide:timer"
                      size="18"
                    />
                    Foco
                  </div>
                </div>
              </div>

              <div class="mockup-main">
                <div style="max-width: 800px; margin: 0 auto">
                  <div
                    class="flex justify-between"
                    style="align-items: flex-end; margin-bottom: 2rem"
                  >
                    <div class="mockup-greeting">
                      <h2>Bom dia, Alex 👋</h2>
                      <p>Sua mente está focada em 3 prioridades hoje.</p>
                    </div>
                    <div style="text-align: right">
                      <div
                        style="
                          font-size: 0.875rem;
                          font-weight: 500;
                          color: var(--text-muted);
                        "
                      >
                        Nível de Energia
                      </div>
                      <div class="energy-bar">
                        <div></div>
                        <div></div>
                        <div></div>
                      </div>
                    </div>
                  </div>

                  <div class="stats-grid">
                    <div class="stat-card">
                      <div class="stat-card-header">
                        <span>Sessão Foco</span>
                        <Icon
                          name="lucide:timer"
                          size="20"
                          style="color: var(--primary)"
                        />
                      </div>
                      <div class="stat-value">25:00</div>
                      <div
                        style="
                          font-size: 0.75rem;
                          color: var(--text-light);
                          margin-top: 4px;
                        "
                      >
                        Pronto para começar?
                      </div>
                    </div>
                    <div class="stat-card">
                      <div class="stat-card-header">
                        <span>Tarefas Feitas</span>
                        <Icon
                          name="lucide:check-circle"
                          size="20"
                          style="color: var(--green)"
                        />
                      </div>
                      <div class="stat-value">4/12</div>
                      <div class="progress-bar">
                        <div class="progress-fill"></div>
                      </div>
                    </div>
                    <div class="stat-card">
                      <div class="stat-card-header">
                        <span>Hábito Principal</span>
                        <Icon
                          name="lucide:flame"
                          size="20"
                          style="color: var(--orange)"
                        />
                      </div>
                      <div class="stat-value">5 dias</div>
                      <div
                        style="
                          font-size: 0.75rem;
                          color: var(--text-light);
                          margin-top: 4px;
                        "
                      >
                        Sequência atual
                      </div>
                    </div>
                  </div>

                  <div class="task-list">
                    <h3 style="font-size: 1rem; margin-bottom: 1rem">
                      Em Progresso
                    </h3>

                    <div
                      class="task-item"
                      style="box-shadow: var(--shadow-sm); cursor: pointer"
                    >
                      <div class="task-checkbox"></div>
                      <div style="flex: 1">
                        <div class="task-title">
                          Revisar wireframes do projeto Mindle
                        </div>
                        <div class="task-meta">Design • Hoje</div>
                      </div>
                      <span class="badge">Alta Prioridade</span>
                    </div>

                    <div
                      class="task-item"
                      style="opacity: 0.6"
                    >
                      <div class="task-checkbox"></div>
                      <div style="flex: 1">
                        <div class="task-title">
                          Responder emails de suporte
                        </div>
                        <div class="task-meta">Admin • Amanhã</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <section class="flow-section">
      <div class="container">
        <span class="section-tag">O Fluxo Mindle</span>
        <h2>Um sistema interconectado.</h2>
        <p>
          Não são apenas ferramentas soltas. É um fluxo contínuo onde cada ação
          alimenta a próxima, criando um ciclo virtuoso de realização.
        </p>

        <div class="flow-grid">
          <div class="flow-line"></div>

          <div class="flow-card">
            <div
              class="flow-icon"
              style="background: rgba(59, 130, 246, 0.1); color: var(--blue)"
            >
              <Icon
                name="lucide:list-todo"
                size="32"
              />
            </div>
            <h3>1. Organizar</h3>
            <p>
              Despeje suas ideias. O sistema categoriza e prioriza
              automaticamente suas <strong>Tarefas</strong>.
            </p>
          </div>

          <div class="flow-card">
            <div
              class="flow-icon"
              style="background: var(--primary-light); color: var(--primary)"
            >
              <Icon
                name="lucide:timer"
                size="32"
              />
            </div>
            <h3>2. Executar</h3>
            <p>
              Entre em modo <strong>Foco</strong> profundo. Bloqueie distrações
              e execute uma coisa de cada vez.
            </p>
          </div>

          <div class="flow-card">
            <div
              class="flow-icon"
              style="background: rgba(249, 115, 22, 0.1); color: var(--orange)"
            >
              <Icon
                name="lucide:brain"
                size="32"
              />
            </div>
            <h3>3. Consolidar</h3>
            <p>
              A repetição vira rotina. Seus <strong>Hábitos</strong> são
              rastreados e recompensados visualmente.
            </p>
          </div>

          <div class="flow-card">
            <div
              class="flow-icon"
              style="background: rgba(168, 85, 247, 0.1); color: var(--purple)"
            >
              <Icon
                name="lucide:flag"
                size="32"
              />
            </div>
            <h3>4. Conquistar</h3>
            <p>
              Veja o panorama geral. Cada pequena ação alimenta suas grandes
              <strong>Metas</strong> de vida.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="features-section">
      <div class="container">
        <div class="features-header">
          <h2>Projetado para o cérebro moderno.</h2>
          <p>
            Recursos visuais e táteis que tornam a organização satisfatória.
          </p>
        </div>

        <div class="features-grid">
          <div class="feature-card">
            <h3>Foco Sem Atrito</h3>
            <p>
              Timer integrado diretamente às suas tarefas para reduzir a
              resistência inicial.
            </p>
            <div
              class="feature-ui-box"
              style="align-items: center"
            >
              <div class="timer-top-line"></div>
              <div
                style="
                  font-size: 0.75rem;
                  font-weight: 700;
                  color: var(--text-light);
                  text-transform: uppercase;
                  margin-bottom: 1rem;
                "
              >
                Sessão Atual
              </div>
              <div class="timer-text">24:59</div>

              <div
                class="flex items-center gap-2"
                style="
                  background: var(--card-bg);
                  padding: 0.25rem 0.75rem;
                  border-radius: 99px;
                  border: 1px solid var(--border-color);
                  margin-bottom: 1.5rem;
                "
              >
                <span
                  style="
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: var(--primary);
                  "
                ></span>
                <span style="font-size: 0.75rem; font-weight: 500"
                  >Vinculado: Relatório Q3</span
                >
              </div>

              <div
                class="flex gap-4"
                style="width: 100%"
              >
                <button
                  style="
                    flex: 1;
                    padding: 0.5rem;
                    background: var(--text-main);
                    color: var(--bg-color);
                    border-radius: var(--radius-md);
                    font-weight: 700;
                  "
                >
                  Pausar
                </button>
                <button
                  style="
                    flex: 1;
                    padding: 0.5rem;
                    background: transparent;
                    border: 1px solid var(--border-color);
                    color: var(--text-main);
                    border-radius: var(--radius-md);
                    font-weight: 700;
                  "
                >
                  Parar
                </button>
              </div>
            </div>
          </div>

          <div class="feature-card">
            <h3>Ritmo de Dopamina</h3>
            <p>
              Visualize seu progresso com bolhas de hábito que dão satisfação
              real ao completar.
            </p>
            <div class="feature-ui-box">
              <div
                class="flex justify-between items-center"
                style="margin-bottom: 1rem"
              >
                <span style="font-weight: 700; font-size: 0.875rem"
                  >Beber Água</span
                >
                <span
                  style="
                    font-size: 0.75rem;
                    font-weight: 700;
                    color: var(--primary);
                    background: var(--primary-light);
                    padding: 2px 8px;
                    border-radius: 4px;
                  "
                  >12 dias 🔥</span
                >
              </div>

              <div class="habit-bubbles">
                <div
                  class="bubble"
                  style="background: rgba(111, 175, 142, 0.2)"
                >
                  <div
                    style="
                      width: 12px;
                      height: 12px;
                      border-radius: 50%;
                      background: var(--primary);
                    "
                  ></div>
                </div>
                <div
                  class="bubble"
                  style="background: rgba(111, 175, 142, 0.3)"
                >
                  <div
                    style="
                      width: 16px;
                      height: 16px;
                      border-radius: 50%;
                      background: var(--primary);
                    "
                  ></div>
                </div>
                <div
                  class="bubble"
                  style="background: rgba(111, 175, 142, 0.4)"
                >
                  <div
                    style="
                      width: 20px;
                      height: 20px;
                      border-radius: 50%;
                      background: var(--primary);
                    "
                  ></div>
                </div>
                <div
                  class="bubble"
                  style="background: rgba(111, 175, 142, 0.6)"
                >
                  <Icon
                    name="lucide:check"
                    size="16"
                    style="color: white"
                  />
                </div>
                <div
                  class="bubble"
                  style="
                    background: var(--primary);
                    transform: scale(1.1);
                    box-shadow: var(--shadow-glow);
                    border: 2px solid var(--card-bg-alt);
                  "
                >
                  <Icon
                    name="lucide:check"
                    size="16"
                    style="color: white; stroke-width: 3"
                  />
                </div>
                <div
                  class="bubble"
                  style="border: 2px dashed var(--border-color); opacity: 0.5"
                ></div>
              </div>
              <p
                style="
                  text-align: center;
                  font-size: 0.75rem;
                  color: var(--text-light);
                  margin: 0;
                "
              >
                Continue assim! Só mais 2 dias para o marco.
              </p>
            </div>
          </div>

          <div class="feature-card">
            <h3>Métricas que Importam</h3>
            <p>
              Entenda seus padrões. Acompanhe humor e energia junto com sua
              produtividade.
            </p>
            <div
              class="feature-ui-box"
              style="justify-content: flex-start; padding: 1rem"
            >
              <div class="metric-row">
                <div class="flex items-center gap-3">
                  <div
                    style="
                      padding: 0.5rem;
                      background: rgba(234, 179, 8, 0.1);
                      color: var(--yellow);
                      border-radius: 8px;
                    "
                  >
                    <Icon
                      name="lucide:zap"
                      size="20"
                    />
                  </div>
                  <div>
                    <div
                      style="
                        font-size: 0.7rem;
                        font-weight: 600;
                        text-transform: uppercase;
                        color: var(--text-light);
                      "
                    >
                      Nível de Energia
                    </div>
                    <div style="font-size: 0.875rem; font-weight: 700">
                      Alto
                    </div>
                  </div>
                </div>
                <div class="flex gap-1">
                  <div
                    style="
                      width: 6px;
                      height: 24px;
                      background: var(--yellow);
                      border-radius: 2px;
                    "
                  ></div>
                  <div
                    style="
                      width: 6px;
                      height: 24px;
                      background: var(--yellow);
                      border-radius: 2px;
                    "
                  ></div>
                  <div
                    style="
                      width: 6px;
                      height: 24px;
                      background: var(--yellow);
                      border-radius: 2px;
                    "
                  ></div>
                  <div
                    style="
                      width: 6px;
                      height: 24px;
                      background: var(--border-color);
                      border-radius: 2px;
                    "
                  ></div>
                </div>
              </div>

              <div class="metric-row">
                <div class="flex items-center gap-3">
                  <div
                    style="
                      padding: 0.5rem;
                      background: rgba(168, 85, 247, 0.1);
                      color: var(--purple);
                      border-radius: 8px;
                    "
                  >
                    <Icon
                      name="lucide:smile"
                      size="20"
                    />
                  </div>
                  <div>
                    <div
                      style="
                        font-size: 0.7rem;
                        font-weight: 600;
                        text-transform: uppercase;
                        color: var(--text-light);
                      "
                    >
                      Humor
                    </div>
                    <div style="font-size: 0.875rem; font-weight: 700">
                      Focado
                    </div>
                  </div>
                </div>
                <span style="font-size: 1.5rem">🧘‍♂️</span>
              </div>

              <div
                class="flex justify-between items-center"
                style="padding: 0 0.5rem; margin-top: 0.25rem"
              >
                <span style="font-size: 0.75rem; color: var(--text-light)"
                  >Tarefas completadas hoje</span
                >
                <span style="font-size: 0.875rem; font-weight: 700"
                  >8 / 10</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="metodologia" class="metodologia-section">
      <div class="container">
        <div class="section-header">
          <h2>A Metodologia Mindle</h2>
          <p>Um sistema interconectado de 4 pilares que transformam intenção em ação</p>
        </div>

        <div class="metodologia-grid">
          <div class="metodologia-card">
            <div class="card-number">1</div>
            <h3>Organizar</h3>
            <p>
              Despeje todas as suas ideias, tarefas e metas no Mindle. O sistema categoriza e prioriza automaticamente,
              ajudando você a ver claramente o que precisa ser feito.
            </p>
            <ul>
              <li>Crie tarefas com títulos claros</li>
              <li>Adicione descrições e contexto</li>
              <li>Organize por categorias e projetos</li>
              <li>Defina prioridades e datas</li>
            </ul>
          </div>

          <div class="metodologia-card">
            <div class="card-number">2</div>
            <h3>Executar</h3>
            <p>
              Com suas tarefas organizadas, entre em modo Foco profundo. Bloqueie distrações e execute uma coisa de
              cada vez com o timer integrado.
            </p>
            <ul>
              <li>Ative o modo Foco</li>
              <li>Use o timer de Pomodoro</li>
              <li>Minimize distrações</li>
              <li>Marque tarefas como concluídas</li>
            </ul>
          </div>

          <div class="metodologia-card">
            <div class="card-number">3</div>
            <h3>Consolidar</h3>
            <p>
              A repetição cria hábitos. Rastreie seus hábitos diários e veja sua sequência crescer com feedback visual
              satisfatório.
            </p>
            <ul>
              <li>Crie hábitos para desenvolver</li>
              <li>Marque como concluído diariamente</li>
              <li>Veja sua sequência crescer</li>
              <li>Receba recompensas visuais</li>
            </ul>
          </div>

          <div class="metodologia-card">
            <div class="card-number">4</div>
            <h3>Conquistar</h3>
            <p>
              Cada pequena ação alimenta suas grandes metas. Rastreie o progresso em direção aos seus objetivos de
              longo prazo.
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
    </section>

    <section id="recursos" class="recursos-section">
      <div class="container">
        <div class="section-header">
          <h2>Recursos Principais</h2>
          <p>Tudo que você precisa para organizar sua vida e aumentar sua produtividade</p>
        </div>

        <div class="recursos-grid">
          <div class="recurso-card">
            <h3>Gestão de Tarefas</h3>
            <p>
              Organize suas tarefas em categorias, defina prioridades e datas de vencimento. Crie subtarefas para
              quebrar projetos grandes em passos menores.
            </p>
          </div>

          <div class="recurso-card">
            <h3>Modo Foco</h3>
            <p>
              Elimine distrações e entre em foco profundo. Timer integrado ajuda você a manter sessões produtivas e
              rastreia seu tempo ao longo do tempo.
            </p>
          </div>

          <div class="recurso-card">
            <h3>Rastreamento de Hábitos</h3>
            <p>
              Construa hábitos duradouros com feedback visual imediato. Veja sua sequência crescer e celebre suas
              vitórias com recompensas visuais.
            </p>
          </div>

          <div class="recurso-card">
            <h3>Planner Semanal</h3>
            <p>
              Visualize sua semana em um calendário interativo. Arraste e solte tarefas para reorganizar sua agenda e
              planeje com antecedência.
            </p>
          </div>

          <div class="recurso-card">
            <h3>Métricas e Insights</h3>
            <p>
              Entenda seus padrões de produtividade. Rastreie seu humor, energia e correlacione com sua produtividade
              para otimizar seu desempenho.
            </p>
          </div>

          <div class="recurso-card">
            <h3>Sincronização em Tempo Real</h3>
            <p>
              Seus dados são sincronizados entre todos os seus dispositivos. Comece no desktop e continue no celular
              sem problemas.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="cta-section">
      <div
        class="container"
        style="max-width: 900px"
      >
        <div class="cta-box">
          <h2>Respire. Organize. Avance.</h2>
          <p>
            Sua mente não precisa ser um lugar caótico. Experimente a calma de
            ter um sistema em que você pode confiar.
          </p>
          <NuxtLink
            to="/auth/login"
            class="btn btn-primary"
            >Criar conta gratuita</NuxtLink
          >
          <div
            style="
              margin-top: 1.5rem;
              font-size: 0.875rem;
              color: var(--text-muted);
              font-weight: 500;
            "
          >
            Plano gratuito generoso • Sem cartão de crédito
          </div>
        </div>
      </div>
    </section>

    <footer class="footer">
      <div class="container">
        <div class="footer-grid">
          <div>
            <div
              class="flex items-center gap-2"
              style="margin-bottom: 1.5rem"
            >
              <img src="/mindle-logo.png" alt="Mindle" class="logo-img" style="width: 32px; height: 32px" />
              <span class="logo-text">Mindle</span>
            </div>
            <p style="font-size: 0.875rem; color: var(--text-muted)">
              Construindo ferramentas de pensamento para mentes que não param.
            </p>
          </div>

          <div>
            <h4>Recursos</h4>
            <ul>
              <li><NuxtLink to="/blog">Blog</NuxtLink></li>
              <li><NuxtLink to="/comunidade">Comunidade</NuxtLink></li>
              <li><a href="#metodologia">Metodologia</a></li>
              <li><NuxtLink to="/ajuda">Ajuda</NuxtLink></li>
            </ul>
          </div>

          <div>
            <h4>Produto</h4>
            <ul>
              <li><a href="#recursos">Funcionalidades</a></li>
              <li><a href="#">Integrações</a></li>
              <li><a href="#">Preços</a></li>
              <li><a href="#">Changelog</a></li>
            </ul>
          </div>

          <div>
            <h4>Legal</h4>
            <ul>
              <li><NuxtLink to="/privacidade">Privacidade</NuxtLink></li>
              <li><NuxtLink to="/termos">Termos</NuxtLink></li>
              <li><NuxtLink to="/cookies">Cookies</NuxtLink></li>
            </ul>
          </div>
        </div>

        <div class="footer-bottom">
          <div>© 2023 Mindle Inc. Todos os direitos reservados.</div>
          <div class="social-links">
            <a
              href="#"
              aria-label="Twitter"
              ><Icon
                name="lucide:twitter"
                size="20"
            /></a>
            <a
              href="#"
              aria-label="GitHub"
              ><Icon
                name="lucide:github"
                size="20"
            /></a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style>
/* Landing page styles - using codebase design system (light theme) */

.mindle-landing {
  --primary: #6faf8e;
  --primary-dark: #4e8a6d;
  --primary-light: rgba(111, 175, 142, 0.1);

  --bg-color: #f7faf9;
  --bg-alt: #ffffff;
  --bg-glass: rgba(255, 255, 255, 0.8);

  --text-main: #1f2d2b;
  --text-muted: #6b7c7a;
  --text-light: #94a3b8;

  --border-color: #e3ece9;
  --border-light: #f1f5f9;

  --card-bg: #ffffff;
  --card-bg-alt: #f0f4f3;

  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  --shadow-glow: 0 0 20px rgba(111, 175, 142, 0.2);

  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 14px;
  --radius-xl: 1rem;
  --radius-2xl: 1.5rem;

  --green: #22c55e;
  --orange: #f97316;
  --blue: #3b82f6;
  --purple: #a855f7;
  --yellow: #eab308;
}

/* Base Styles */
body {
  font-family: "Inter", sans-serif;
  background-color: var(--bg-color);
  color: var(--text-main);
  line-height: 1.5;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
  margin: 0;
  padding: 0;
}

.mindle-landing {
  box-sizing: border-box;
}

.mindle-landing *,
.mindle-landing *::before,
.mindle-landing *::after {
  box-sizing: border-box;
}

.mindle-landing a {
  text-decoration: none;
  color: inherit;
}

.mindle-landing ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.mindle-landing button {
  cursor: pointer;
  border: none;
  font-family: inherit;
}

.mindle-landing .container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* Utility Classes */
.flex {
  display: flex;
}
.flex-col {
  flex-direction: column;
}
.items-center {
  align-items: center;
}
.justify-between {
  justify-content: space-between;
}
.justify-center {
  justify-content: center;
}
.gap-2 {
  gap: 0.5rem;
}
.gap-3 {
  gap: 0.75rem;
}
.gap-4 {
  gap: 1rem;
}
.gap-6 {
  gap: 1.5rem;
}
.gap-8 {
  gap: 2rem;
}

/* Navigation */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 80px;
  background: var(--bg-glass);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border-color);
  z-index: 50;
  display: flex;
  align-items: center;
}

.logo-box {
  width: 36px;
  height: 36px;
  background: var(--primary);
  color: white;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.25rem;
  box-shadow: var(--shadow-glow);
}

.logo-img {
  width: 36px;
  height: 36px;
  object-fit: contain;
  display: block;
}

.logo-text {
  font-weight: 700;
  font-size: 1.25rem;
  letter-spacing: -0.025em;
}

.nav-links {
  display: none;
}

.nav-links a {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-muted);
  transition: color 0.3s;
}

.nav-links a:hover {
  color: var(--primary);
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.login-link {
  display: none;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-muted);
}
.login-link:hover {
  color: var(--text-main);
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-lg);
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.3s ease;
  color: white;
}

.btn-dark {
  background-color: var(--primary);
  color: white !important;
  box-shadow: var(--shadow-md);
}

.btn-dark:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
  opacity: 0.9;
}

.btn-primary {
  background-color: var(--primary);
  color: white !important;
  padding: 1rem 2rem;
  font-size: 1.125rem;
  border-radius: var(--radius-xl);
  box-shadow: 0 10px 25px -5px rgba(111, 175, 142, 0.4);
}

.btn-primary:hover {
  background-color: var(--primary-dark);
  transform: translateY(-4px);
}

.btn-outline {
  background-color: var(--card-bg);
  color: var(--text-main);
  border: 1px solid var(--border-color);
  padding: 1rem 2rem;
  font-size: 1.125rem;
  border-radius: var(--radius-xl);
}

.btn-outline:hover {
  background-color: var(--card-bg-alt);
}

/* Hero Section */
.hero {
  padding-top: 150px;
  padding-bottom: 100px;
  text-align: center;
  position: relative;
}

.bg-grid {
  position: absolute;
  inset: 0;
  z-index: -1;
  background-size: 40px 40px;
  background-image:
    linear-gradient(to right, rgba(111, 175, 142, 0.05) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(111, 175, 142, 0.05) 1px, transparent 1px);
}

.blob-1,
.blob-2 {
  position: absolute;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  filter: blur(120px);
  z-index: -1;
  pointer-events: none;
}

.blob-1 {
  top: 0;
  right: 0;
  background: var(--primary-light);
}
.blob-2 {
  bottom: 0;
  left: 0;
  background: rgba(59, 130, 246, 0.05);
}

.tag {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 1rem;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-muted);
  margin-bottom: 2.5rem;
  box-shadow: var(--shadow-sm);
}

.ping {
  position: relative;
  display: flex;
  width: 8px;
  height: 8px;
}

.ping-circle {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: var(--primary);
  border-radius: 50%;
  animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
  opacity: 0.75;
}

.ping-dot {
  position: relative;
  width: 8px;
  height: 8px;
  background-color: var(--primary);
  border-radius: 50%;
}

@keyframes ping {
  75%,
  100% {
    transform: scale(2);
    opacity: 0;
  }
}

.hero h1 {
  font-size: 3rem;
  line-height: 1.1;
  font-weight: 700;
  letter-spacing: -0.025em;
  margin-bottom: 1.5rem;
}

.hero h1 span {
  color: var(--primary);
  position: relative;
  display: inline-block;
}

.hero h1 svg {
  position: absolute;
  width: 100%;
  height: 12px;
  bottom: -4px;
  left: 0;
  color: var(--primary-light);
}

.hero p {
  font-size: 1.25rem;
  color: var(--text-muted);
  max-width: 600px;
  margin: 0 auto 3rem;
  font-weight: 300;
}

.hero-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 5rem;
}

/* Mockup */
.mockup-container {
  position: relative;
  max-width: 1100px;
  margin: 0 auto;
}

.mockup-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, var(--bg-color), transparent);
  z-index: 20;
  pointer-events: none;
}

.mockup-window {
  position: relative;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-2xl);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  text-align: left;
}

.mockup-header {
  height: 48px;
  background: var(--card-bg-alt);
  border-bottom: 1px solid var(--border-light);
  display: flex;
  align-items: center;
  padding: 0 1.5rem;
}

.mockup-dots {
  display: flex;
  gap: 8px;
}
.mockup-dots div {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--text-light);
  opacity: 0.5;
}

.mockup-body {
  display: flex;
  height: 600px;
}

.mockup-sidebar {
  display: none;
  width: 256px;
  border-right: 1px solid var(--border-light);
  padding: 1.5rem;
  background: var(--card-bg);
  flex-direction: column;
}

.sidebar-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 0.75rem;
  border-radius: var(--radius-lg);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-muted);
  margin-bottom: 0.25rem;
}

.sidebar-item.active {
  background: var(--primary-light);
  color: var(--primary);
}

.mockup-main {
  flex: 1;
  background: var(--card-bg-alt);
  padding: 2rem;
  overflow: hidden;
}

.mockup-greeting h2 {
  font-size: 1.5rem;
  margin-bottom: 0.25rem;
  margin-top: 0;
}
.mockup-greeting p {
  color: var(--text-muted);
  font-size: 0.875rem;
  margin: 0;
}

.energy-bar {
  display: flex;
  gap: 4px;
  margin-top: 4px;
}
.energy-bar div {
  height: 8px;
  width: 32px;
  border-radius: 4px;
  background: var(--primary);
}
.energy-bar div:last-child {
  opacity: 0.3;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin: 2rem 0;
}

.stat-card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  padding: 1.25rem;
  border-radius: var(--radius-xl);
}

.stat-card-header {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-muted);
  margin-bottom: 1rem;
}

.stat-value {
  font-size: 1.875rem;
  font-weight: 700;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: var(--border-color);
  border-radius: 99px;
  margin-top: 8px;
}
.progress-fill {
  height: 100%;
  background: var(--green);
  border-radius: 99px;
  width: 33%;
}

.task-list {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  padding: 1.5rem;
}

.task-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  margin-bottom: 0.75rem;
}

.task-checkbox {
  width: 20px;
  height: 20px;
  border: 2px solid var(--text-light);
  border-radius: 4px;
  margin-right: 1rem;
}

.task-title {
  font-weight: 500;
}
.task-meta {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-top: 4px;
}

.badge {
  padding: 0.25rem 0.75rem;
  background: var(--primary-light);
  color: var(--primary);
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 99px;
}

/* Flow Section */
.flow-section {
  padding: 6rem 0;
  background: var(--bg-alt);
  border-top: 1px solid var(--border-color);
  text-align: center;
}

.section-tag {
  color: var(--primary);
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  font-size: 0.875rem;
  display: block;
  margin-bottom: 0.5rem;
}

.flow-section h2 {
  font-size: 2.25rem;
  margin-bottom: 1.5rem;
  margin-top: 0;
}

.flow-section p {
  color: var(--text-muted);
  font-size: 1.125rem;
  max-width: 700px;
  margin: 0 auto 4rem;
}

.flow-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  position: relative;
}

.flow-line {
  display: none;
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(
    to right,
    transparent,
    var(--primary),
    transparent
  );
  transform: translateY(-50%);
  opacity: 0.3;
  z-index: 0;
}

.flow-card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  padding: 2rem;
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-md);
  position: relative;
  z-index: 10;
  transition: all 0.3s ease;
}

.flow-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-lg);
}

.flow-icon {
  width: 64px;
  height: 64px;
  border-radius: var(--radius-2xl);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  transition: transform 0.3s;
}

.flow-card:hover .flow-icon {
  transform: scale(1.1);
}

.flow-card h3 {
  font-size: 1.25rem;
  margin-bottom: 0.75rem;
  margin-top: 0;
}
.flow-card p {
  font-size: 0.875rem;
  margin-bottom: 0;
}

/* Features Section */
.features-section {
  padding: 6rem 0;
  background: var(--bg-color);
}

.features-header {
  text-align: center;
  margin-bottom: 4rem;
}

.features-header h2 {
  font-size: 2.25rem;
  margin-bottom: 1rem;
  margin-top: 0;
}
.features-header p {
  color: var(--text-muted);
  margin: 0;
}

.features-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

.feature-card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-2xl);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  transition: all 0.3s;
}

.feature-card:hover {
  box-shadow: var(--shadow-lg);
}

.feature-card h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  margin-top: 0;
}
.feature-card > p {
  color: var(--text-muted);
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
  margin-top: 0;
}

.feature-ui-box {
  margin-top: auto;
  background: var(--card-bg-alt);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* Specific UI mockups inside features */
.timer-top-line {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: var(--primary);
}

.timer-text {
  font-size: 3rem;
  font-weight: 700;
  font-family: monospace;
  text-align: center;
  margin-bottom: 0.5rem;
}

.habit-bubbles {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}
.bubble {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.metric-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  background: var(--card-bg);
  border-radius: var(--radius-lg);
  margin-bottom: 0.75rem;
  box-shadow: var(--shadow-sm);
}

/* CTA Section */
.cta-section {
  padding: 5rem 0;
}

.cta-box {
  background: var(--primary-light);
  border: 1px solid rgba(111, 175, 142, 0.2);
  border-radius: var(--radius-2xl);
  padding: 3rem 2rem;
  text-align: center;
  position: relative;
  overflow: hidden;
  box-shadow: var(--shadow-glow);
}

.cta-box h2 {
  font-size: 2.25rem;
  margin-bottom: 1.5rem;
  margin-top: 0;
}
.cta-box p {
  font-size: 1.125rem;
  color: var(--text-muted);
  margin-bottom: 2.5rem;
  margin-top: 0;
}

/* Footer */
.footer {
  background: var(--card-bg);
  border-top: 1px solid var(--border-color);
  padding: 4rem 0 2rem;
}

.footer-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  margin-bottom: 3rem;
}

.footer h4 {
  font-size: 1rem;
  margin-bottom: 1rem;
  margin-top: 0;
}
.footer ul li {
  margin-bottom: 0.75rem;
}
.footer ul a {
  color: var(--text-muted);
  font-size: 0.875rem;
  transition: color 0.3s;
}
.footer ul a:hover {
  color: var(--primary);
}

.footer-bottom {
  padding-top: 2rem;
  border-top: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
  font-size: 0.75rem;
  color: var(--text-light);
}

.social-links {
  display: flex;
  gap: 1.5rem;
}
.social-links a:hover {
  color: var(--text-main);
}

/* Media Queries for Responsiveness */
@media (min-width: 768px) {
  .nav-links {
    display: flex;
    gap: 2.5rem;
  }
  .login-link {
    display: block;
  }

  .hero h1 {
    font-size: 4.5rem;
  }
  .hero br.md-break {
    display: block;
  }
  .hero-buttons {
    flex-direction: row;
  }

  .mockup-sidebar {
    display: flex;
  }

  .flow-line {
    display: block;
  }
  .flow-grid {
    grid-template-columns: repeat(4, 1fr);
  }

  .footer-grid {
    grid-template-columns: 2fr 1fr 1fr 1fr;
  }
  .footer-bottom {
    flex-direction: row;
  }
}

/* Metodologia Section */
.metodologia-section {
  padding: 6rem 0;
  background: var(--bg-alt);
  border-top: 1px solid var(--border-color);
}

.section-header {
  text-align: center;
  margin-bottom: 4rem;
}

.section-header h2 {
  font-size: 2.25rem;
  margin-bottom: 1rem;
  margin-top: 0;
  color: var(--primary);
}

.section-header p {
  font-size: 1.125rem;
  color: var(--text-muted);
  margin: 0;
}

.metodologia-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

.metodologia-card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-2xl);
  padding: 2rem;
  position: relative;
  transition: all 0.3s;
}

.metodologia-card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-4px);
}

.card-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: var(--primary-light);
  color: var(--primary);
  border-radius: 50%;
  font-weight: 700;
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.metodologia-card h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  margin-top: 0;
  color: var(--text-main);
}

.metodologia-card p {
  color: var(--text-muted);
  margin-bottom: 1rem;
  line-height: 1.6;
}

.metodologia-card ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.metodologia-card li {
  padding-left: 1.5rem;
  margin-bottom: 0.5rem;
  color: var(--text-muted);
  position: relative;
}

.metodologia-card li:before {
  content: "✓";
  position: absolute;
  left: 0;
  color: var(--primary);
  font-weight: bold;
}

/* Recursos Section */
.recursos-section {
  padding: 6rem 0;
  background: var(--bg-color);
}

.recursos-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

.recurso-card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-2xl);
  padding: 2rem;
  transition: all 0.3s;
}

.recurso-card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-4px);
}

.recurso-card h3 {
  font-size: 1.25rem;
  margin-bottom: 1rem;
  margin-top: 0;
  color: var(--text-main);
}

.recurso-card p {
  color: var(--text-muted);
  margin: 0;
  line-height: 1.6;
}

@media (min-width: 768px) {
  .metodologia-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .recursos-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .metodologia-grid {
    grid-template-columns: repeat(4, 1fr);
  }

  .recursos-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .features-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  .cta-box {
    padding: 4rem 5rem;
  }
  .cta-box h2 {
    font-size: 3rem;
  }
}
</style>

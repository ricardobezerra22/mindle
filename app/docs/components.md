# Design System — Componentes Reutilizáveis

## Button
- Variantes: primary, secondary, ghost
- Estados: default, hover, disabled
- Uso: ações principais e secundárias

## Card
- Container base do sistema
- Padding consistente
- Sombra suave

## TaskItem
- Estados: not-started, in-progress, done
- Props:
  - title
  - status
  - dueDate (opcional)
  - priority (low | medium | high)

## TaskColumn
- Usado no Kanban
- Aceita múltiplos TaskItem
- Título fixo

## PlannerBlock
- Bloco de tempo (hora ou dia)
- Aceita múltiplas tarefas
- Visual limpo (sem overload)

## HabitCheck
- Check simples (feito / não feito)
- Feedback visual positivo
- Sem pontuação ou gamificação

## ProgressIndicator
- Barra ou círculo
- Usado em foco e produtividade

## Header
- Título da página
- Ações principais
- Breadcrumb opcional

## Sidebar
- Navegação principal
- Ícones + texto
- Estado ativo claro

const STATUS_MESSAGES: Record<number, string> = {
  429: "Limite de chamadas atingido. Aguarde 1 minuto e tente novamente.",
  409: "Já existe uma tarefa com este título. Altere e tente novamente.",
  500: "Erro interno do servidor. Tente novamente.",
  400: "Dados inválidos. Verifique as informações e tente novamente.",
  401: "Sessão expirada. Faça login novamente.",
  404: "Recurso não encontrado.",
};

export function resolveApiError(
  err: unknown,
  fallback = "Erro ao processar. Tente novamente.",
): string {
  const fe = err as { statusCode?: number; data?: { error?: string } };
  if (fe.data?.error) return fe.data.error;
  return (
    (fe.statusCode !== undefined ? STATUS_MESSAGES[fe.statusCode] : undefined) ??
    fallback
  );
}

import type {
  PreviewTask,
  AgentPreviewResult,
  NewCategory,
} from "~/types/index";

export type VoiceAgentState =
  | "idle"
  | "listening"
  | "processing"
  | "preview"
  | "confirming"
  | "done"
  | "error";

export type { PreviewTask };

interface SR {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((e: SREvent) => void) | null;
  onerror: ((e: SRErrorEvent) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}
interface SRResult {
  isFinal: boolean;
  0: { transcript: string };
}
interface SRResultList {
  length: number;
  [i: number]: SRResult;
}
interface SREvent {
  resultIndex: number;
  results: SRResultList;
}
interface SRErrorEvent {
  error: string;
}

export function useVoiceAgent() {
  const toast = useToast();
  const state = ref<VoiceAgentState>("idle");
  const transcript = ref("");
  const interimTranscript = ref("");
  const preview = ref<AgentPreviewResult | null>(null);
  const confirmedTasks = ref<PreviewTask[]>([]);
  const error = ref<string | null>(null);
  let sessionId = "";

  let recognition: SR | null = null;

  function initRecognition(): SR | null {
    if (typeof window === "undefined") return null;
    const win = window as unknown as Record<string, new () => SR>;
    const SpeechRecognition =
      win["SpeechRecognition"] || win["webkitSpeechRecognition"];
    if (!SpeechRecognition) return null;
    const r = new SpeechRecognition();
    r.lang = "pt-BR";
    r.continuous = false;
    r.interimResults = true;

    r.onresult = (e: SREvent) => {
      let interim = "";
      let final = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const result = e.results[i]!;
        if (result.isFinal) final += result[0]!.transcript;
        else interim += result[0]!.transcript;
      }
      if (final) transcript.value += final;
      interimTranscript.value = interim;
    };

    r.onerror = (e: SRErrorEvent) => {
      if (e.error === "no-speech" || e.error === "aborted") return;
      if (e.error === "not-allowed" || e.error === "permission-denied") {
        error.value = "Permissão do microfone negada. Use a entrada de texto.";
      } else if (e.error === "network") {
        error.value =
          "Erro de rede no reconhecimento de voz. Use a entrada de texto.";
      } else {
        error.value =
          "Reconhecimento de voz indisponível. Use a entrada de texto.";
      }
      state.value = "error";
    };

    r.onend = () => {
      interimTranscript.value = "";
      if (state.value === "listening") state.value = "idle";
    };

    return r;
  }

  function start() {
    error.value = null;
    transcript.value = "";
    interimTranscript.value = "";
    recognition = initRecognition();
    if (!recognition) {
      error.value = "Seu navegador não suporta reconhecimento de voz.";
      state.value = "error";
      return;
    }
    recognition.start();
    state.value = "listening";
  }

  function stop() {
    recognition?.stop();
    state.value = "idle";
  }

  async function send(text?: string) {
    const input = (text ?? transcript.value).trim();
    if (!input) return;
    state.value = "processing";
    error.value = null;
    try {
      const result = await $fetch<{
        data: AgentPreviewResult & { sessionId: string };
      }>("/api/agent/voice-tasks/preview", {
        method: "POST",
        body: { text: input },
      });
      sessionId = result.data.sessionId ?? "";
      preview.value = result.data;
      state.value = "preview";
    } catch (err: unknown) {
      error.value = resolveApiError(err);
      state.value = "error";
    }
  }

  async function confirm(tasks: PreviewTask[], newCategories: NewCategory[]) {
    state.value = "confirming";
    error.value = null;
    try {
      const result = await $fetch<{
        data: { tasks: PreviewTask[]; count: number };
      }>("/api/agent/voice-tasks/confirm", {
        method: "POST",
        body: { tasks, newCategories, sessionId },
      });
      confirmedTasks.value = result.data.tasks;
      state.value = "done";
      toast.success({
        title: `${result.data.count} tarefa${result.data.count !== 1 ? "s" : ""} criada${result.data.count !== 1 ? "s" : ""} com sucesso!`,
      });
    } catch (err: unknown) {
      error.value = resolveApiError(err);
      state.value = "preview";
      toast.error({ title: error.value });
    }
  }

  function reset() {
    state.value = "idle";
    transcript.value = "";
    interimTranscript.value = "";
    preview.value = null;
    confirmedTasks.value = [];
    error.value = null;
    sessionId = "";
    recognition?.abort();
  }

  return {
    state,
    transcript,
    interimTranscript,
    preview,
    confirmedTasks,
    error,
    start,
    stop,
    send,
    confirm,
    reset,
  };
}

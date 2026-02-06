interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
  duration?: number;
}

export const useToast = () => {
  const toasts = useState<Toast[]>("app-toasts", () => []);

  const show = (
    message: string,
    type: Toast["type"] = "info",
    duration = 2500,
  ) => {
    const id = Date.now().toString() + Math.random().toString(36).slice(2);
    toasts.value = [...toasts.value, { id, message, type, duration }];

    setTimeout(() => {
      toasts.value = toasts.value.filter((t) => t.id !== id);
    }, duration);
  };

  const success = (message: string) => show(message, "success");
  const error = (message: string) => show(message, "error");
  const info = (message: string) => show(message, "info");

  return { toasts, show, success, error, info };
};

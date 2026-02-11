export const useClickOutside = (
  target: Ref<HTMLElement | null>,
  handler: () => void,
) => {
  const listener = (event: MouseEvent) => {
    if (!target.value) return;
    if (target.value.contains(event.target as Node)) return;
    handler();
  };

  onMounted(() => document.addEventListener("click", listener));
  onUnmounted(() => document.removeEventListener("click", listener));
};

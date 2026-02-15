export const useSidebar = () => {
  const isExpanded = useState("sidebar-expanded", () => false);
  const isMobile = useState("sidebar-mobile", () => false);
  const expandedByHover = useState("sidebar-hover", () => false);

  let hoverTimer: ReturnType<typeof setTimeout> | null = null;

  const toggle = () => {
    expandedByHover.value = false;
    isExpanded.value = !isExpanded.value;
  };

  const open = () => {
    expandedByHover.value = false;
    isExpanded.value = true;
  };

  const close = () => {
    expandedByHover.value = false;
    isExpanded.value = false;
  };

  const closeMobile = () => {
    if (isMobile.value) isExpanded.value = false;
  };

  const onMouseEnter = () => {
    if (isMobile.value || isExpanded.value) return;
    hoverTimer = setTimeout(() => {
      expandedByHover.value = true;
      isExpanded.value = true;
    }, 100);
  };

  const onMouseLeave = () => {
    if (hoverTimer) {
      clearTimeout(hoverTimer);
      hoverTimer = null;
    }
    if (expandedByHover.value) {
      expandedByHover.value = false;
      isExpanded.value = false;
    }
  };

  return {
    isExpanded,
    isMobile,
    expandedByHover,
    toggle,
    open,
    close,
    closeMobile,
    onMouseEnter,
    onMouseLeave,
  };
};

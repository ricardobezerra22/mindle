export const useSidebar = () => {
  const isExpanded = useState("sidebar-expanded", () => false);
  const isMobile = useState("sidebar-mobile", () => false);

  const toggle = () => {
    isExpanded.value = !isExpanded.value;
  };

  const open = () => {
    isExpanded.value = true;
  };

  const close = () => {
    isExpanded.value = false;
  };

  const closeMobile = () => {
    if (isMobile.value) isExpanded.value = false;
  };

  return { isExpanded, isMobile, toggle, open, close, closeMobile };
};

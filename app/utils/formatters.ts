export const formatDate = (date: Date): string => {
  const { locale } = useI18n();
  return new Date(date).toLocaleDateString(locale.value, {
    day: "2-digit",
    month: "short",
  });
};

export const formatDateForInput = (date: Date): string => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

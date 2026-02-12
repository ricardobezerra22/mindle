interface DragItem {
  id: string;
  position: number;
}

interface UseDragReorderOptions<T extends DragItem> {
  items: Ref<T[]>;
  onReorder: (items: { id: string; position: number }[]) => Promise<void>;
}

export const useDragReorder = <T extends DragItem>(
  options: UseDragReorderOptions<T>,
) => {
  const draggedId = ref<string | null>(null);
  const dragOverId = ref<string | null>(null);

  const onDragStart = (id: string, event: DragEvent) => {
    draggedId.value = id;
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", id);
    }
  };

  const onDragOver = (id: string, event: DragEvent) => {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = "move";
    }
    dragOverId.value = id;
  };

  const onDragLeave = () => {
    dragOverId.value = null;
  };

  const onDrop = async (targetId: string, event: DragEvent) => {
    event.preventDefault();
    dragOverId.value = null;

    const sourceId = draggedId.value;
    if (!sourceId || sourceId === targetId) {
      draggedId.value = null;
      return;
    }

    const items = options.items.value;
    const sourceIndex = items.findIndex((item) => item.id === sourceId);
    const targetIndex = items.findIndex((item) => item.id === targetId);

    if (sourceIndex === -1 || targetIndex === -1) {
      draggedId.value = null;
      return;
    }

    const [moved] = items.splice(sourceIndex, 1);
    items.splice(targetIndex, 0, moved);

    const reordered = items.map((item, index) => ({
      id: item.id,
      position: index,
    }));

    items.forEach((item, index) => {
      item.position = index;
    });

    draggedId.value = null;

    try {
      await options.onReorder(reordered);
    } catch (e) {
      console.error("Reorder failed:", e);
    }
  };

  const onDragEnd = () => {
    draggedId.value = null;
    dragOverId.value = null;
  };

  const isDragging = (id: string) => draggedId.value === id;
  const isDragOver = (id: string) => dragOverId.value === id;

  return {
    draggedId: readonly(draggedId),
    dragOverId: readonly(dragOverId),
    onDragStart,
    onDragOver,
    onDragLeave,
    onDrop,
    onDragEnd,
    isDragging,
    isDragOver,
  };
};

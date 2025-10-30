import type { MediaItemProps } from "../types/MediaItem";
import ItemCard from "./ItemCard";
import EditModal from "./EditModal";
import ViewModal from "./ViewModal";
import { useMemo } from "react";
import "../style/ItemList.css";

type ItemListProps = {
  items: MediaItemProps[];
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
  onUpdate?: (id: string, updatedItem: MediaItemProps) => void;
  editingItemId: string | null;
  viewItemId: string | null;
  onView?: (id: string) => void;
  mode: "completed" | "planned" | "projects";
  theme: 'light' | 'dark';
  isOwner?: boolean;
  setEditingItemId: (id: string | null) => void;
  onMarkAsCompleted?: (item: MediaItemProps, rating: number) => Promise<void>;
  isArchiveView?: boolean;
  onArchive?: (id: string) => void;
  onRestore?: (id: string) => void;
  onToggleHidden?: (id: string, hidden: boolean) => void;
  user?: any;
};

export default function ItemList({
  items,
  onDelete,
  onEdit,
  onUpdate,
  editingItemId,
  viewItemId,
  onView,
  mode,
  theme,
  onArchive,
  onRestore,
  isOwner,
  user,
  setEditingItemId,
  onMarkAsCompleted,
  onToggleHidden,
  isArchiveView,
}: ItemListProps) {
  const editingItem = useMemo(
    () => items.find((item) => item.id === editingItemId),
    [items, editingItemId]
  );

  const viewingItem = useMemo(
    () => items.find((item) => item.id === viewItemId),
    [items, viewItemId]
  );

  if (!items || items.length === 0) {
    let emptyMessage = "";

    switch (mode) {
      case "completed":
        emptyMessage = 'Список пуст — добавь первый элемент. Например - "Прочитать Гиперион Дэна Симонса"';
        break;
      case "planned":
        emptyMessage = 'Нет запланированных элементов. Добавь то, что хочешь сделать!';
        break;
      case "projects":
        emptyMessage = 'У тебя пока нет проектов. Добавь первый, например, "Выучить японский"';
        break;
      default:
        emptyMessage = "Список пуст.";
    }

    return <p className="item-list-empty">{emptyMessage}</p>;
  }

  return (
    <div className="item-list-container">
      <div className="item-list-grid">
        {items.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            onDelete={() => onDelete?.(item.id)}
            onEdit={(id) => onEdit?.(id)}
            onView={(id) => onView?.(id)}
            mode={mode}
            isOwner={isOwner}
            theme={theme}
            onMarkAsCompleted={onMarkAsCompleted}
            onArchive={onArchive}
            isArchiveView={isArchiveView}
            onRestore={onRestore}
            onToggleHidden={onToggleHidden}
          />
        ))}
      </div>

      {viewingItem && onView && (
        <ViewModal
          item={viewingItem}
          onClose={() => onView("")}
          mode={mode}
          user={user}
        />
      )}

      {editingItem && onUpdate && setEditingItemId && onEdit && !isArchiveView && (
        <EditModal
          item={editingItem}
          onCancel={() => onEdit("")}
          onSave={(updatedItem: MediaItemProps) =>
            onUpdate(editingItem.id, updatedItem)
          }
          mode={mode}
          onClose={() => setEditingItemId(null)}
        />
      )}
    </div>
  );
}

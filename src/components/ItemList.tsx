import type { MediaItemProps } from "../types/MediaItem";
import ItemCard from "./ItemCard";
import EditModal from "./EditModal";
import ViewModal from "./ViewModal";
import { useMemo } from "react";
import "../style/ItemList.css";

type ItemListProps = {
  items: MediaItemProps[];
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onUpdate: (id: string, updatedItem: MediaItemProps) => void;
  editingItemId: string | null;
  viewItemId: string | null;
  onView: (id: string) => void;
  mode: "completed" | "planned";
  theme: 'light' | 'dark';
  isOwner?: boolean;
  setEditingItemId: (id: string | null) => void;
  onMarkAsCompleted?: (item: MediaItemProps, rating: number) => Promise<void>;
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
  isOwner,
  setEditingItemId,
  onMarkAsCompleted,
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
    return <p className="item-list-empty">Список пуст — добавь первый элемент!</p>;
  }

  return (
    <div className="item-list-container">
      <div className="item-list-grid">
        {items.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            onDelete={() => onDelete(item.id)}
            onEdit={onEdit}
            onView={onView}
            mode={mode}
            isOwner={isOwner}
            theme={theme}
            onMarkAsCompleted={onMarkAsCompleted}
          />
        ))}
      </div>

      {viewingItem && (
        <ViewModal item={viewingItem} onClose={() => onView("")} mode={mode} />
      )}

      {editingItem && (
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

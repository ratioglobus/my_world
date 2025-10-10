import type { MediaItemProps } from "../types/MediaItem";
import ItemCard from "./ItemCard";
import EditModal from "./EditModal";
import { useMemo } from "react";
import ViewModal from "./ViewModal";

type ItemListProps = {
  items: MediaItemProps[];
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onUpdate: (id: string, updatedItem: MediaItemProps) => void;
  editingItemId: string | null;
  viewItemId: string | null;
  onView: (id: string) => void;
  mode: "completed" | "planned";
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
    return <p>Список пуст — добавь первый элемент!</p>;
  }

  return (
    <div style={{ width: "100%", maxWidth: "1200px" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "16px",
          width: "100%",
        }}
      >
        {items.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            onDelete={() => onDelete(item.id)}
            onEdit={onEdit}
            onView={onView}
            mode={mode}
          />
        ))}
      </div>

      {viewingItem && (
        <ViewModal
          item={viewingItem}
          onClose={() => onView("")}
          mode={mode}
        />
      )}

      {editingItem && (
        <EditModal
          item={editingItem}
          onCancel={() => onEdit("")}
          onSave={(updatedItem: MediaItemProps) =>
            onUpdate(editingItem.id, updatedItem)
          }
          mode={mode}
        />
      )}
    </div>
  );
}

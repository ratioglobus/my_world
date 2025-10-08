import type { MediaItemProps } from "../types/MediaItem";
import ItemCard from "./ItemCard";
import EditModal from "./EditModal"; // модалка редактирования
import { useMemo } from "react";

type ItemListProps = {
  items: MediaItemProps[];
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onUpdate: (id: string, updatedItem: MediaItemProps) => void;
  editingItemId: string | null;
};

export default function ItemList({
  items,
  onDelete,
  onEdit,
  onUpdate,
  editingItemId,
}: ItemListProps) {
  const editingItem = useMemo(
    () => items.find((item) => item.id === editingItemId),
    [items, editingItemId]
  );

  if (!items || items.length === 0) {
    return <p>Список пуст — добавь первый элемент!</p>;
  }

  return (
    <div style={{ width: "100%", maxWidth: "1200px" }}>
      {/* Сетка карточек */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, auto))",
          gap: "16px",
          width: "100%",
        }}
      >
        {items.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}
      </div>

      {/* Модальное окно редактирования */}
      {editingItem && (
        <EditModal
          item={editingItem}
          onCancel={() => onEdit("")}
          onSave={(updatedItem: MediaItemProps) =>
            onUpdate(editingItem.id, updatedItem)
          }
        />
      )}
    </div>
  );
}

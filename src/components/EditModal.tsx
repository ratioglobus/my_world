import { useState } from "react";
import type { MediaItemProps } from "../types/MediaItem";

type EditModalProps = {
  item: MediaItemProps;
  onCancel: () => void;
  onSave: (updatedItem: MediaItemProps) => void;
};

export default function EditModal({ item, onCancel, onSave }: EditModalProps) {
  const [title, setTitle] = useState(item.title);
  const [type, setType] = useState(item.type);
  const [rating, setRating] = useState(item.rating);
  const [comment, setComment] = useState(item.comment || "");

  const handleSave = () => {
    const updated: MediaItemProps = {
      ...item,
      title,
      type,
      rating,
      comment,
    };
    onSave(updated);
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
        padding: "16px",
      }}
    >
      <div
        style={{
          backgroundColor: "#1f2937",
          color: "#f9fafb",
          borderRadius: "12px",
          padding: "24px",
          width: "100%",
          maxWidth: "500px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.7)",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        <h2 style={{ margin: 0 }}>Редактировать элемент</h2>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Название"
          style={{
            width: "100%",
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid #374151",
            backgroundColor: "#111827",
            color: "#f9fafb",
          }}
        />

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          style={{
            width: "100%",
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid #374151",
            backgroundColor: "#111827",
            color: "#f9fafb",
          }}
        >
          <option value="movie">Фильм</option>
          <option value="series">Сериал</option>
          <option value="book">Книга</option>
        </select>

        <input
          type="number"
          min={1}
          max={10}
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          placeholder="Рейтинг"
          style={{
            width: "100%",
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid #374151",
            backgroundColor: "#111827",
            color: "#f9fafb",
          }}
        />

        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Комментарий"
          style={{
            width: "100%",
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid #374151",
            backgroundColor: "#111827",
            color: "#f9fafb",
          }}
        />

        <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: "8px",
              backgroundColor: "#6b7280",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            ✖ Отмена
          </button>

          <button
            onClick={handleSave}
            style={{
              flex: 1,
              padding: "8px",
              backgroundColor: "#10b981",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            💾 Сохранить
          </button>
        </div>
      </div>
    </div>
  );
}

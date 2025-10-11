import { useState } from "react";
import type { MediaItemProps } from "../types/MediaItem";

type EditModalProps = {
  item: MediaItemProps;
  onCancel: () => void;
  onClose: () => void;
  onSave: (updatedItem: MediaItemProps) => void;
  mode: "completed" | "planned";
};

export default function EditModal({ item, onCancel, onSave, onClose, mode }: EditModalProps) {
  const [title, setTitle] = useState(item.title);
  const [type, setType] = useState(item.type);
  const [rating, setRating] = useState(item.rating);
  const [comment, setComment] = useState(item.comment || "");

  const handleSave = () => {
    const updated: MediaItemProps = {
      ...item,
      title,
      type,
      rating: mode === "planned" ? 0 : rating,
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
      onClick={onClose} // клик по фону закрывает
    >
      <div
        style={{
          backgroundColor: "var(--card-bg)",
          color: "#1e1b4b",
          borderRadius: "12px",
          padding: "24px",
          width: "100%",
          maxWidth: "500px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
        }}
        onClick={(e) => e.stopPropagation()} // предотвращаем закрытие при клике на модалку
      >
        <h2 style={{ margin: 0, textAlign: "center" }}>Редактировать элемент</h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Название"
            style={inputStyle}
          />

          <select value={type} onChange={(e) => setType(e.target.value)} style={inputStyle}>
            <option value="Фильм">Фильм</option>
            <option value="Сериал">Сериал</option>
            <option value="Книга">Книга</option>
            <option value="Аниме">Аниме</option>
            <option value="YouTube видео">YouTube видео</option>
          </select>

          {mode === "completed" && (
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              style={inputStyle}
            >
              {[...Array(10)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          )}

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Комментарий"
            rows={3}
            style={{ ...inputStyle, resize: "none" }}
          />
        </div>

        <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
          <button
            onClick={onCancel}
            style={cancelButtonStyle}
            onMouseOver={(e) => (e.currentTarget.style.opacity = "0.85")}
            onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Отмена
          </button>

          <button
            onClick={handleSave}
            style={saveButtonStyle}
            onMouseOver={(e) => (e.currentTarget.style.opacity = "0.85")}
            onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #a49fe0",
  backgroundColor: "#f3f0ff",
  color: "#1e1b4b",
  fontSize: "1rem",
  boxSizing: "border-box",
  outline: "none",
  transition: "box-shadow 0.2s ease, border-color 0.2s ease",
};

const cancelButtonStyle: React.CSSProperties = {
  flex: 1,
  padding: "10px",
  backgroundColor: "#6b7280",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: 500,
};

const saveButtonStyle: React.CSSProperties = {
  flex: 1,
  padding: "10px",
  backgroundColor: "#10b981",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: 500,
};

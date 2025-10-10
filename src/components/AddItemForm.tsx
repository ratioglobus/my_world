import { useState } from "react";
import type { MediaItemProps } from "../types/MediaItem";

type AddItemFormProps = {
  onAdd: (item: MediaItemProps) => void;
  mode: "completed" | "planned";
};

export default function AddItemForm({ onAdd, mode }: AddItemFormProps) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("Фильм");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const newItem: MediaItemProps = {
      id: Date.now().toString(),
      title,
      type,
      comment: comment || undefined,
      createdAt: new Date().toISOString(),
      ...(mode === "completed" && { rating: Number(rating) }),
    };

    onAdd(newItem);
    setTitle("");
    setType("Фильм");
    setRating(5);
    setComment("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        marginBottom: "12px",
        backgroundColor: "var(--card-bg)",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
        maxWidth: "600px",
        width: "100%",
      }}
    >
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <input
          type="text"
          placeholder="Название"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={inputStyle}
          required
        />

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          style={{ ...inputStyle, flex: "0 0 130px" }}
        >
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
            style={{ ...inputStyle, flex: "0 0 80px" }}
          >
            {[...Array(10)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        )}
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
        <textarea
          placeholder="Комментарий"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={2}
          style={{
            ...inputStyle,
            resize: "none",
            flex: 1,
          }}
        />
        <button
          type="submit"
          style={{
            padding: "10px 10px",
            backgroundColor: "#fff",
            color: "#000",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            minWidth: "120px",
            fontWeight: 500,
            transition: "background-color 0.2s ease",
          }}
        >
          Добавить
        </button>
      </div>
    </form>
  );
}

const inputStyle: React.CSSProperties = {
  flex: "1",
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #374151",
  backgroundColor: "#111827",
  color: "#f9fafb",
  fontSize: "1rem",
  boxSizing: "border-box",
};

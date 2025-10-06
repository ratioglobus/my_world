import { useState } from "react";
import type { MediaItemProps } from "../types/MediaItem";

type AddItemFormProps = {
  onAdd: (item: MediaItemProps) => void;
};

export default function AddItemForm({ onAdd }: AddItemFormProps) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("movie");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const newItem: MediaItemProps = {
      id: Date.now().toString(),
      title,
      type,
      rating: Number(rating),
      comment: comment || undefined,
    };

    onAdd(newItem);

    setTitle("");
    setType("movie");
    setRating(5);
    setComment("");
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "24px" }}>
      <input
        type="text"
        placeholder="Название"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ padding: "8px", marginRight: "8px" }}
        required
      />
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        style={{ padding: "8px", marginRight: "8px" }}
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
        style={{ width: "60px", padding: "8px", marginRight: "8px" }}
      />
      <input
        type="text"
        placeholder="Комментарий"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        style={{ padding: "8px", marginRight: "8px" }}
      />
      <button
        type="submit"
        style={{
          padding: "8px 16px",
          backgroundColor: "#10b981",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        Добавить
      </button>
    </form>
  );
}

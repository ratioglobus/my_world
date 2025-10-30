import { useState } from "react";
import type { MediaItemProps } from "../types/MediaItem";
import "../style/AddItemForm.css";

type AddItemFormProps = {
  onAdd: (item: Omit<MediaItemProps, "id" | "user_id">) => void;
  mode: "completed" | "planned" | "projects";
};

export default function AddItemForm({ onAdd, mode }: AddItemFormProps) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("Фильм");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [priority, setPriority] = useState("Среднее");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newItem: Omit<MediaItemProps, "id" | "user_id"> = {
      title,
      type: mode === "projects" ? "Проект" : type,
      priority,
      comment: comment || undefined,
      createdAt: new Date().toISOString(),
      ...(mode === "completed" && { rating: Number(rating) }),
    };

    onAdd(newItem);
    setTitle("");
    setPriority("Среднее");
    setType("Фильм");
    setRating(5);
    setComment("");
  };

  return (
    <form className="add-item-form" onSubmit={handleSubmit}>
      <div className="add-item-row">
        <input
          type="text"
          placeholder={mode === "projects" ? "Название проекта" : "Название"}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="add-item-input"
          required
        />

        {mode !== "projects" && (
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="add-item-input add-item-select-type"
          >
            <option value="Фильм">Фильм</option>
            <option value="Сериал">Сериал</option>
            <option value="Книга">Книга</option>
            <option value="Аниме">Аниме</option>
            <option value="Игра">Игра</option>
            <option value="Идея">Идея</option>
            <option value="YouTube">YouTube</option>
          </select>
        )}

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="add-item-input add-item-select-type"
        >
          <option value="Среднее">Среднее</option>
          <option value="Важное">Важное</option>
          <option value="Критичное">Критичное</option>
        </select>

        {mode === "completed" && (
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="add-item-input add-item-select-rating"
          >
            {[...Array(10)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="add-item-row">
        <textarea
          placeholder={mode === "projects" ? "Описание проекта" : "Комментарий"}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={2}
          className="add-item-input add-item-textarea"
        />
        <button type="submit" className="add-item-button">
          Добавить
        </button>
      </div>
    </form>
  );
}

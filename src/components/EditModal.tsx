import { useState } from "react";
import type { MediaItemProps } from "../types/MediaItem";
import "../style/EditModal.css";

type EditModalProps = {
  item: MediaItemProps;
  onCancel: () => void;
  onClose: () => void;
  onSave: (updatedItem: MediaItemProps) => void;
  mode: "completed" | "planned";
};

export default function EditModal({
  item,
  onCancel,
  onSave,
  onClose,
  mode,
}: EditModalProps) {
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
    <div className="edit-modal-overlay" onClick={onClose}>
      <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="edit-modal-title">Редактировать элемент</h2>

        <div className="edit-modal-fields">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Название"
            className="edit-modal-input"
          />

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="edit-modal-input"
          >
            <option value="Фильм">Фильм</option>
            <option value="Сериал">Сериал</option>
            <option value="Книга">Книга</option>
            <option value="Аниме">Аниме</option>
            <option value="Игра">Игра</option>
            <option value="YouTube">YouTube</option>
          </select>

          {mode === "completed" && (
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="edit-modal-input"
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
            className="edit-modal-input edit-modal-textarea"
          />
        </div>

        <div className="edit-modal-buttons">
          <button className="edit-btn cancel-btn" onClick={onCancel}>
            Отмена
          </button>
          <button className="edit-btn save-btn" onClick={handleSave}>
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
}

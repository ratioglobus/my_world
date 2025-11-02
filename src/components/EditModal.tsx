import { useState } from "react";
import type { MediaItemProps } from "../types/MediaItem";
import "../style/EditModal.css";

type EditModalProps = {
  item: MediaItemProps;
  onCancel: () => void;
  onClose: () => void;
  onSave: (updatedItem: MediaItemProps) => void;
  mode: "completed" | "planned" | "projects";
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
  const [statusProject, setStatusProject] = useState<
    "Запланировано" | "В процессе" | "Завершено" | "Приостановлено"
  >(item.status || "Запланировано");
  const [rating, setRating] = useState(item.rating ?? 0);
  const [comment, setComment] = useState(item.comment || "");
  const [priority, setPriority] = useState(item.priority);

  const handleSave = () => {
    const updated: MediaItemProps = {
      ...item,
      title,
      type: mode === "projects" ? "Проект" : type,
      priority,
      status: statusProject,
      rating: mode === "planned" ? 0 : rating,
      comment,
    };
    onSave(updated);
    onClose();
  };

  return (
    <div className="edit-modal-overlay" onClick={onClose}>
      <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="edit-modal-title">
          {mode === "projects" ? "Редактировать проект" : "Редактировать элемент"}
        </h2>

        <div className="edit-modal-fields">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={mode === "projects" ? "Название проекта" : "Название"}
            className="edit-modal-input"
          />

          {mode !== "projects" && (
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
              <option value="Идея">Идея</option>
              <option value="YouTube">YouTube</option>
            </select>
          )}

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="edit-modal-input"
          >
            <option value="Среднее">Среднее</option>
            <option value="Важное">Важное</option>
            <option value="Критичное">Критичное</option>
          </select>

          {mode === "projects" && (
            <select
              value={statusProject}
              className="edit-modal-input"
              onChange={(e) =>
                setStatusProject(
                  e.target.value as "Запланировано" | "В процессе" | "Завершено" | "Приостановлено"
                )
              }
            >
              <option value="Запланировано">Запланировано</option>
              <option value="В процессе">В процессе</option>
              <option value="Приостановлено">Приостановлено</option>
              <option value="Завершено">Завершено</option>
            </select>
          )}

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
            placeholder={mode === "projects" ? "Описание проекта" : "Комментарий"}
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

import type { MediaItemProps } from "../types/MediaItem";
import "../style/ViewModal.css";

type ViewModalProps = {
  item: MediaItemProps;
  onClose: () => void;
  mode: "completed" | "planned";
};

export default function ViewModal({ item, onClose, mode }: ViewModalProps) {
  return (
    <div className="view-modal-overlay" onClick={onClose}>
      <div className="view-modal" onClick={(e) => e.stopPropagation()}>
        <button className="view-modal-close" onClick={onClose}>
          ✖
        </button>

        <h2 className="view-modal-title">{item.title}</h2>

        <p className="view-modal-field">
          <strong>Тип:</strong> {item.type}
        </p>

        <p className="view-modal-field">
          <strong>Приоритет:</strong> {item.priority}
        </p>

        {mode === "completed" && (
          <p className="view-modal-field">
            <strong>Рейтинг:</strong> {item.rating}/10
          </p>
        )}

        {item.createdAt && (
          <p className="view-modal-date">
            <strong>Добавлено:</strong>{" "}
            {new Date(item.createdAt).toLocaleDateString("ru-RU")}
          </p>
        )}

        {item.comment && (
          <div className="view-modal-comment">{item.comment}</div>
        )}
      </div>
    </div>
  );
}

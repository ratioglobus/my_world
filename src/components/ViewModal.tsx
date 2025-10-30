import type { MediaItemProps } from "../types/MediaItem";
import "../style/ViewModal.css";
import ProjectSteps from "./ProjectSteps";

type ViewModalProps = {
  item: MediaItemProps;
  onClose: () => void;
  mode: "completed" | "planned" | "projects";
  user?: any;
};

export default function ViewModal({ item, onClose, mode, user }: ViewModalProps) {
  const renderCommentWithLinks = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    return text.split(urlRegex).map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="view-modal-link"
          >
            {part}
          </a>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

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
          <div className="view-modal-comment">
            {renderCommentWithLinks(item.comment)}
          </div>
        )}

        {mode === "projects" && user && (
          <ProjectSteps projectId={item.id} userId={user.id} />
        )}
      </div>
    </div>
  );
}

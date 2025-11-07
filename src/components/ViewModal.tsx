import { useEffect, useRef } from "react";
import type { MediaItemProps } from "../types/MediaItem";
import "../style/ViewModal.css";
import ProjectSteps from "./ProjectSteps";

type ViewModalProps = {
  item: MediaItemProps;
  onClose: () => void;
  mode: "completed" | "planned" | "projects";
  user?: any;
  onProgressUpdate?: () => void;
};

export default function ViewModal({
  item,
  onClose,
  mode,
  user,
  onProgressUpdate,
}: ViewModalProps) {
  const modalRef = useRef<HTMLDivElement | null>(null)

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

  const handleClose = () => {
    try {
      if (onProgressUpdate) onProgressUpdate();
    } finally {
      onClose();
    }
  };

  useEffect(() => {
    return () => {
      onProgressUpdate?.();
    };
  }, [onProgressUpdate]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onProgressUpdate]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [onClose])

  return (
    <div className="view-modal-overlay">
      <div ref={modalRef} className="view-modal">
        <button className="view-modal-close" onClick={handleClose}>
          ✖
        </button>

        <h2 className="view-modal-title">{item.title}</h2>

        <p className="view-modal-field">
          <strong>Тип:</strong> {item.type}
        </p>

        <p className="view-modal-field">
          <strong>Приоритет:</strong> {item.priority}
        </p>

        {mode === "projects" && (
          <p className="view-modal-field">
            <strong>Статус:</strong> {item.status || "—"}
          </p>
        )}

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

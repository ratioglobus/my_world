import type { MediaItemProps } from "../types/MediaItem";
import { useState, useRef, useEffect } from "react";
import "../style/ItemCard.css";
import RatingModal from "./RatingModal";
import { MoreVertical } from "lucide-react";

type ItemCardProps = {
  item: MediaItemProps;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onView: (id: string) => void;
  mode: "completed" | "planned";
  theme: "dark" | "light";
  onMarkAsCompleted?: (item: MediaItemProps, rating: number) => Promise<void>;
  isOwner?: boolean;
  onArchive?: (id: string) => void;
};

export default function ItemCard({
  item,
  onDelete,
  onEdit,
  onView,
  mode,
  theme,
  onMarkAsCompleted,
  onArchive,
  isOwner = true,
}: ItemCardProps) {
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const handleCardClick = () => {
    if (!showRatingModal && !menuOpen) onView(item.id);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className={`item-card ${item.type === "Идея" ? "idea" : ""}`}
      onClick={handleCardClick}
    >
      <div
        className={`priority-bar ${item.priority === "Критичное"
            ? "priority-critical"
            : item.priority === "Важное"
              ? "priority-important"
              : "priority-normal"
          }`}
      />

      <div className="item-card-content">
        <h3 className="item-card-title">{item.title}</h3>

        {item.type === "Идея" ? (
          <img
            src={theme === "dark" ? "/idea-dark.png" : "/idea.png"}
            alt="Идея"
            className="idea-icon"
          />
        ) : (
          <p className="item-card-type">
            {item.type}
            {mode === "completed" && (
              <> · рейтинг – <strong>{item.rating}/10</strong></>
            )}
          </p>
        )}

        <p className="item-card-date">
          Добавлено: {new Date(item.createdAt).toLocaleDateString("ru-RU")}
        </p>

        {item.comment && (
          <p className="item-card-comment" title={item.comment}>
            {item.comment}
          </p>
        )}
      </div>

      {isOwner && (
        <div className="item-card-menu-wrapper" ref={menuRef}>
          <button
            className="menu-button"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((prev) => !prev);
            }}
          >
            <MoreVertical size={20} />
          </button>

          {menuOpen && (
            <div className="menu-dropdown">
              {mode === "planned" && onMarkAsCompleted && (
                <button
                  className="menu-item"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(false);
                    setShowRatingModal(true);
                  }}
                >
                  Оценить
                </button>
              )}

              {onArchive && (
                <button
                  className="menu-item archive"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(false);
                    onArchive(item.id);
                  }}
                >
                  Архивировать
                </button>
              )}

              <button
                className="menu-item"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(false);
                  onEdit(item.id);
                }}
              >
                Изменить
              </button>

              <button
                className="menu-item delete"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(false);
                  onDelete(item.id);
                }}
              >
                Удалить
              </button>
            </div>
          )}

        </div>
      )}

      {showRatingModal && onMarkAsCompleted && (
        <RatingModal
          item={item}
          onSubmit={onMarkAsCompleted}
          onClose={() => setShowRatingModal(false)}
        />
      )}
    </div>
  );
}

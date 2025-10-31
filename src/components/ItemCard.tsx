import type { MediaItemProps } from "../types/MediaItem";
import { useState, useRef, useEffect, useMemo } from "react";
import "../style/ItemCard.css";
import "../style/MyProfilePage.css";
import "../style/ProjectSteps.css";
import RatingModal from "./RatingModal";
import { MoreVertical, EyeOff } from "lucide-react";

type ItemCardProps = {
  item: MediaItemProps;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onView: (id: string) => void;
  mode: "completed" | "planned" | "projects";
  theme: "dark" | "light";
  onMarkAsCompleted?: (item: MediaItemProps, rating: number) => Promise<void>;
  isOwner?: boolean;
  onArchive?: (id: string) => void;
  isArchiveView?: boolean;
  onRestore?: (id: string) => void;
  onToggleHidden?: (id: string, hidden: boolean) => void;
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
  isArchiveView = false,
  onToggleHidden,
  onRestore,
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

  const progress = useMemo(() => {
    if (item.progress != null) {
      const n = Number(item.progress);
      return Number.isFinite(n) ? Math.max(0, Math.min(100, Math.round(n))) : 0;
    }

    const steps = (item as any).steps;
    if (Array.isArray(steps) && steps.length > 0) {
      const isCompleted = (s: any) =>
        Boolean(
          s.completed ??
          s.done ??
          s.is_done ??
          s.is_completed ??
          s.completed_at ??
          s.finished_at
        );
      const total = steps.length;
      const done = steps.filter((s) => isCompleted(s)).length;
      return Math.round((done / total) * 100);
    }

    return 0;
  }, [item]);

  return (
    <div
      className={`item-card ${item.type === "Идея" ? "idea" : ""}`}
      onClick={handleCardClick}
      role="button"
      aria-label={item.title}
    >
      {item.is_hidden && (
        <div
          className="hidden-icon"
          title="Эта карточка скрыта даже в режиме публичного профиля"
        >
          <EyeOff size={18} />
        </div>
      )}
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
              <>
                {" "}
                · рейтинг – <strong>{item.rating}/10</strong>
              </>
            )}
          </p>
        )}

        <p className="item-card-date">
          Добавлено: {new Date(item.createdAt).toLocaleDateString("ru-RU")}
        </p>

        {mode === "projects" && (
          <div className="project-info">
            <div className="project-progress">
              <div
                className="progress-bar"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progress}
              >
                <div
                  className="progress-bar-fill"
                  style={{ width: `${progress ?? 0}%` }}
                />
              </div>
            </div>

            {item.deadline && (
              <p className="project-deadline">
                Дедлайн:{" "}
                <strong>{new Date(item.deadline).toLocaleDateString("ru-RU")}</strong>
              </p>
            )}
          </div>
        )}

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
              {mode === "planned" && onMarkAsCompleted && !isArchiveView && (
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

              {onArchive && !isArchiveView && (
                <button
                  className="menu-item"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(false);
                    onArchive(item.id);
                  }}
                >
                  Архивировать
                </button>
              )}

              {onToggleHidden && (
                <button
                  className="menu-item"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(false);
                    onToggleHidden(item.id, !item.is_hidden);
                  }}
                >
                  {item.is_hidden ? "Показать" : "Скрыть"}
                </button>
              )}

              {!isArchiveView ? (
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
              ) : (
                onRestore && (
                  <button
                    className="menu-item restore"
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpen(false);
                      onRestore(item.id);
                    }}
                  >
                    Вернуть из архива
                  </button>
                )
              )}

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

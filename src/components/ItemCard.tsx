import type { MediaItemProps } from "../types/MediaItem";
import { useState } from "react";
import "../style/ItemCard.css";
import RatingModal from "./RatingModal";

type ItemCardProps = {
  item: MediaItemProps;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onView: (id: string) => void;
  mode: "completed" | "planned";
  onMarkAsCompleted?: (item: MediaItemProps, rating: number) => Promise<void>;
};

export default function ItemCard({
  item,
  onDelete,
  onEdit,
  onView,
  mode,
  onMarkAsCompleted,
}: ItemCardProps) {
  const [showRatingModal, setShowRatingModal] = useState(false);

  const handleCardClick = () => {
    if (!showRatingModal) onView(item.id);
  };

  return (
    <div className="item-card" onClick={handleCardClick}>
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
        <p className="item-card-type">
          {item.type}
          {mode === "completed" && <> · рейтинг – <strong>{item.rating}/10</strong></>}
        </p>
        <p className="item-card-date">
          Добавлено: {new Date(item.createdAt).toLocaleDateString("ru-RU")}
        </p>
        {item.comment && (
          <p className="item-card-comment" title={item.comment}>
            {item.comment}
          </p>
        )}
      </div>



      <div className="item-card-buttons">
        {mode === "planned" && onMarkAsCompleted && (
          <button
            className="item-btn review-btn"
            onClick={(e) => {
              e.stopPropagation();
              setShowRatingModal(true);
            }}
          >
            Оценить
          </button>
        )}

        <button
          className="item-btn edit-btn"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(item.id);
          }}
        >
          Изменить
        </button>

        <button
          className="item-btn delete-btn"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(item.id);
          }}
        >
          Удалить
        </button>
      </div>

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

import type { MediaItemProps } from "../types/MediaItem";
import "../style/ItemCard.css";

type ItemCardProps = {
  item: MediaItemProps;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onView: (id: string) => void;
  mode: "completed" | "planned";
};

export default function ItemCard({
  item,
  onDelete,
  onEdit,
  onView,
  mode,
}: ItemCardProps) {
  return (
    <div className="item-card" onClick={() => onView(item.id)}>
      <div>
        <h3 className="item-card-title">{item.title}</h3>
        <p className="item-card-type">
          {item.type}
          {mode === "completed" && (
            <>
              {" "}
              · рейтинг – <strong>{item.rating}/10</strong>
            </>
          )}
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
        <button
          className="item-btn edit-btn"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(item.id);
          }}
        >
          Редактировать
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
    </div>
  );
}

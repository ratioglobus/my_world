import type { MediaItemProps } from "../types/MediaItem";

type ItemCardProps = {
  item: MediaItemProps;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onView: (id: string) => void;
  mode: "completed" | "planned";
};

export default function ItemCard({ item, onDelete, onEdit, onView, mode  }: ItemCardProps) {
  return (
    <div
      style={{
        backgroundColor: "var(--card-bg)",
        color: "#f9fafb",
        borderRadius: "12px",
        padding: "16px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.5)",
        width: "100%",
        height: "250px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
      onClick={() => onView(item.id)}
    >
      <div>
        <h3 style={{ margin: "0 0 8px 0", fontSize: "1.2rem" }}>{item.title}</h3>
        <p style={{ margin: 0, fontSize: "0.9rem", color: "#d1d5db" }}>
          {item.type}
          {mode === "completed" && <> · рейтинг - <strong>{item.rating}/10</strong></>}
        </p>
        <p style={{ margin: "4px 0", fontSize: "0.8rem", color: "#9ca3af" }}>
          Добавлено: {new Date(item.createdAt).toLocaleDateString("ru-RU")}
        </p>
        {item.comment && (
          <p
            style={{
              marginTop: "8px",
              fontSize: "0.85rem",
              color: "#e5e7eb",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              wordBreak: "break-word",
            }}
            title={item.comment}
          >
            {item.comment}
          </p>
        )}
      </div>

      <div style={{ marginTop: "12px", display: "flex", gap: "8px" }}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(item.id);
          }}
          style={{
            flex: 1,
            padding: "5px",
            backgroundColor: "#3b82f6",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "12px"
          }}
        >
          Редактировать
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(item.id);
          }}
          style={{
            flex: 1,
            padding: "5px",
            backgroundColor: "#ef4444",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "12px"
          }}
        >
          Удалить
        </button>
      </div>
    </div>
  );
}

import type { MediaItemProps } from "../types/MediaItem";

type ItemCardProps = {
  item: MediaItemProps;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onView: (id: string) => void;
  mode: "completed" | "planned";
};

export default function ItemCard({ item, onDelete, onEdit, onView, mode }: ItemCardProps) {
  return (
    <div
      style={{
        backgroundColor: "#f3f0ff",
        color: "#1e1b4b",
        borderRadius: "12px",
        padding: "16px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        width: "100%",
        minHeight: "250px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        boxSizing: "border-box",
        overflow: "hidden",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        cursor: "pointer",
      }}
      onClick={() => onView(item.id)}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = "0 6px 18px rgba(0,0,0,0.25)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
      }}
    >
      <div>
        <h3 style={{ margin: "0 0 8px 0", fontSize: "1.2rem" }}>{item.title}</h3>
        <p style={{ margin: 0, fontSize: "0.9rem", color: "#6b5dd6" }}>
          {item.type}
          {mode === "completed" && <> · рейтинг - <strong>{item.rating}/10</strong></>}
        </p>
        <p style={{ margin: "4px 0", fontSize: "0.8rem", color: "#4b3f91" }}>
          Добавлено: {new Date(item.createdAt).toLocaleDateString("ru-RU")}
        </p>
        {item.comment && (
          <p
            style={{
              marginTop: "8px",
              fontSize: "0.85rem",
              color: "#3b2e70",
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
            padding: "6px",
            backgroundColor: "#764ba2",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "12px",
            transition: "background-color 0.2s ease",
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#5d3d9b")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#764ba2")}
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
            padding: "6px",
            backgroundColor: "#ef4444",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "12px",
            transition: "background-color 0.2s ease",
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#dc2626")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#ef4444")}
        >
          Удалить
        </button>
      </div>
    </div>
  );
}

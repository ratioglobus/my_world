import type { MediaItemProps } from "../types/MediaItem";

type ItemCardProps = {
  item: MediaItemProps;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
};

export default function ItemCard({ item, onDelete, onEdit }: ItemCardProps) {
  return (
    <div
      style={{
        backgroundColor: "#1f2937",
        color: "#f9fafb",
        borderRadius: "12px",
        padding: "16px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.5)",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxSizing: "border-box",
      }}
    >
      <div>
        <h3 style={{ margin: "0 0 8px 0", fontSize: "1.2rem" }}>{item.title}</h3>
        <p style={{ margin: 0, fontSize: "0.9rem", color: "#d1d5db" }}>
          {item.type} · <strong>{item.rating}</strong>
        </p>
        {item.comment && (
          <p style={{ marginTop: "8px", fontSize: "0.85rem", color: "#e5e7eb" }}>
            {item.comment}
          </p>
        )}
      </div>

      <div style={{ marginTop: "12px", display: "flex", gap: "8px" }}>
        <button
          onClick={() => onDelete(item.id)}
          style={{
            flex: 1,
            padding: "8px",
            backgroundColor: "#ef4444",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Удалить
        </button>

        <button
          onClick={() => onEdit(item.id)}
          style={{
            flex: 1,
            padding: "8px",
            backgroundColor: "#3b82f6",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Редактировать
        </button>
      </div>
    </div>
  );
}

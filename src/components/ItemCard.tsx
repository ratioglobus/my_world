import type { MediaItemProps } from "../types/MediaItem";


type ItemCardProps = {
  item: MediaItemProps;
  onDelete: (id: string) => void;
};

export default function ItemCard({ item, onDelete }: ItemCardProps) {
  return (
    <div
      style={{
        backgroundColor: "#1f2937",
        color: "#f9fafb",
        borderRadius: "12px",
        padding: "16px",
        marginBottom: "12px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.5)",
        maxWidth: "400px",
      }}
    >
      <h3 style={{ margin: "0 0 8px 0", fontSize: "1.2rem" }}>{item.title}</h3>
      <p style={{ margin: 0, fontSize: "0.9rem", color: "#d1d5db" }}>
        {item.type} · <strong>{item.rating}</strong>
      </p>
      {item.comment && (
        <p style={{ marginTop: "8px", fontSize: "0.85rem", color: "#e5e7eb" }}>
          {item.comment}
        </p>
      )}
      <button
        onClick={() => onDelete(item.id)}
      >Удалить</button>
    </div>
  );
}

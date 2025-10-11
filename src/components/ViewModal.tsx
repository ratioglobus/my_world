import type { MediaItemProps } from "../types/MediaItem";

type ViewModalProps = {
  item: MediaItemProps;
  onClose: () => void;
  mode: "completed" | "planned";
};

export default function ViewModal({ item, onClose, mode }: ViewModalProps) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
        padding: "16px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "var(--card-bg)",
          color: "#1e1b4b",
          borderRadius: "12px",
          padding: "24px",
          width: "100%",
          maxWidth: "500px",
          maxHeight: "80vh",
          overflowY: "auto",
          boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            background: "none",
            border: "none",
            color: "#9ca3af",
            fontSize: "1.2rem",
            cursor: "pointer",
          }}
        >
          ✖
        </button>

        <h2 style={{ margin: 0, textAlign: "center" }}>{item.title}</h2>

        <p style={{ margin: "4px 0", color: "#1e1b4b" }}>
          <strong>Тип:</strong> {item.type}
        </p>

        {mode === "completed" && (
          <p style={{ margin: "4px 0", color: "#1e1b4b" }}>
            <strong>Рейтинг:</strong> {item.rating}/10
          </p>
        )}

        {item.createdAt && (
          <p style={{ margin: "4px 0", color: "#6b7280", fontSize: "0.9rem" }}>
            <strong>Добавлено:</strong> {new Date(item.createdAt).toLocaleDateString("ru-RU")}
          </p>
        )}

        {item.comment && (
          <div
            style={{
              backgroundColor: "#f3f0ff",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #a49fe0",
              color: "#1e1b4b",
              whiteSpace: "pre-wrap",
              lineHeight: 1.5,
              overflowY: "auto",
              maxHeight: "200px",
            }}
          >
            {item.comment}
          </div>
        )}
      </div>
    </div>
  );
}

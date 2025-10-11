type ConfirmModalProps = {
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({
  message = "Вы уверены?",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
      onClick={onCancel}
    >
      <div
        style={{
          backgroundColor: "var(--card-bg)",
          color: "#000",
          borderRadius: "12px",
          padding: "24px",
          width: "100%",
          maxWidth: "400px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.7)",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <p style={{ margin: 0, textAlign: "center" }}>{message}</p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
          <button
            onClick={onCancel}
            style={{
              padding: "8px 16px",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
              backgroundColor: "#6b7280",
              color: "#fff",
            }}
          >
            Отмена
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: "8px 16px",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
              backgroundColor: "#ef4444",
              color: "#fff",
            }}
          >
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
}

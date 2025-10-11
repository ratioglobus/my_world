import "../style/ConfirmModal.css";

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
    <div className="confirm-modal-overlay" onClick={onCancel}>
      <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
        <p className="confirm-modal-message">{message}</p>
        <div className="confirm-modal-buttons">
          <button className="confirm-btn cancel-btn" onClick={onCancel}>
            Отмена
          </button>
          <button className="confirm-btn delete-btn" onClick={onConfirm}>
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
}

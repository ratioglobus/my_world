import { useState } from "react";
import type { MediaItemProps } from "../types/MediaItem";
import "../style/RatingModal.css";

type RatingModalProps = {
  item: MediaItemProps;
  onSubmit: (item: MediaItemProps, rating: number) => Promise<void>;
  onClose: () => void;
};

export default function RatingModal({ item, onSubmit, onClose }: RatingModalProps) {
  const [rating, setRating] = useState<number>(5);

  const handleSubmit = async () => {
    await onSubmit(item, rating);
    onClose();
  };

  return (
    <div
      className="rating-modal-overlay"
      onClick={() => onClose()} 
    >
      <div
        className="rating-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="rating-modal-title">Оцените: {item.title}</h2>

        <div className="rating-options">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
            <div
              key={num}
              className={`rating-circle ${rating === num ? "active" : ""}`}
              onClick={() => setRating(num)}
            >
              {num}
            </div>
          ))}
        </div>

        <div className="rating-actions">
          <button className="rating-cancel-btn" onClick={onClose}>
            Отмена
          </button>
          <button className="rating-submit-btn" onClick={handleSubmit}>
            Подтвердить
          </button>
        </div>
      </div>
    </div>
  );
}

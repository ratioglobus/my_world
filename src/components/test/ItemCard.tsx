import React from "react";
import "./ItemCard.css";
import { Heart, Star, Trash } from "lucide-react";

interface ItemCardProps {
    id: number;
    title: string;
    description: string;
    tags: string[];
    likes: number;
    isFavorite: boolean;
    onDelete: () => void;
    onLike: (id: number) => void;
    onFavoriteToggle: (id: number) => void;
    onEdit: (id: number) => void;
}

const ItemCard: React.FC<ItemCardProps> = ({
    id,
    title,
    description,
    tags = [],
    likes,
    isFavorite,
    onDelete,
    onLike,
    onFavoriteToggle,
    onEdit,
}) => {
    return (
        <div className="item-card-test">
            <button
                className="edit-button-card-test"
                onClick={(e) => {
                    e.stopPropagation();
                    onEdit(id);
                }}
            >
                Edit
            </button>

            <h3 className="item-title">{title}</h3>
            <p className="item-description">{description}</p>

            {tags.length > 0 && (
                <div className="item-tags">
                    {tags.map((tag, i) => (
                        <span key={i} className="item-tag">
                            {tag}
                        </span>
                    ))}
                </div>
            )}

            <div className="item-card-buttons">
                <button
                    className={`item-card-button-like ${likes > 0 ? "liked" : ""}`}
                    onClick={() => onLike(id)}
                >
                    <Heart size={20} fill={likes > 0 ? "red" : "white"} strokeWidth={1.8} />
                    {likes}
                </button>

                <button
                    className={`item-card-button-favorite ${isFavorite ? "favorite" : ""}`}
                    onClick={() => onFavoriteToggle(id)}
                >
                    <Star size={20} fill={isFavorite ? "gold" : "white"} strokeWidth={1.8} />
                </button>

                <button className="item-card-button-delete" onClick={onDelete}>
                    <Trash size={20} fill="white" strokeWidth={1.8} />
                </button>
            </div>
        </div>
    );
};

export default ItemCard;

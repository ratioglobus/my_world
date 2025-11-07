import React, { useState, useEffect } from "react";
import "../style/DiscoveryModal.css";

interface DiscoveryModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    onSave: (data: { title: string; description: string }) => void;
}

const DiscoveryModal: React.FC<DiscoveryModalProps> = ({
    isOpen,
    onClose,
    title,
    description = "",
    onSave,
}) => {
    const [editMode, setEditMode] = useState(false);
    const [editedTitle, setEditedTitle] = useState(title);
    const [editedDescription, setEditedDescription] = useState(description);

    useEffect(() => {
        if (isOpen) {
            setEditedTitle(title);
            setEditedDescription(description);
            setEditMode(false);
        }
    }, [isOpen, title, description]);

    if (!isOpen) return null;

    return (
        <div className="discovery-modal-overlay" onClick={onClose}>
            <div
                className="discovery-modal"
                onClick={(e) => e.stopPropagation()}
            >
                {editMode ? (
                    <>
                        <p className="discodery-modal-text">Режим редактирования</p>
                        <input
                            className="discovery-modal-input"
                            value={editedTitle}
                            onChange={(e) => setEditedTitle(e.target.value)}
                            placeholder="Название открытия"
                        />
                        <textarea
                            className="discovery-modal-textarea"
                            value={editedDescription}
                            onChange={(e) => setEditedDescription(e.target.value)}
                            placeholder="Описание открытия..."
                        />
                        <div className="discovery-modal-actions">
                            <button
                                className="discovery-modal-cancel"
                                onClick={() => setEditMode(false)}
                            >
                                Отмена
                            </button>
                            <button
                                className="discovery-modal-save"
                                onClick={() => {
                                    onSave({
                                        title: editedTitle.trim(),
                                        description: editedDescription.trim(),
                                    });
                                    setEditMode(false);
                                }}
                            >
                                Сохранить
                            </button>

                        </div>
                    </>
                ) : (
                    <>
                        <h2 className="discovery-modal-title">{title}</h2>
                        <p className="discovery-modal-description">
                            {description
                                ? description
                                : "Описание отсутствует"}
                        </p>

                        <div className="discovery-modal-actions">
                            <button
                                className="discovery-modal-edit"
                                onClick={() => setEditMode(true)}
                            >
                                Редактировать
                            </button>
                        </div>
                    </>
                )}

                <button className="discovery-modal-close" onClick={onClose}>
                    ✕
                </button>
            </div>
        </div>
    );
};

export default DiscoveryModal;

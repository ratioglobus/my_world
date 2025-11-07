import React, { useState, useEffect, useRef } from "react"
import "../style/DiscoveryModal.css"

interface DiscoveryModalProps {
    isOpen: boolean
    onClose: () => void
    title: string
    description?: string
    onSave: (data: { title: string; description: string }) => void
}

const DiscoveryModal: React.FC<DiscoveryModalProps> = ({
    isOpen,
    onClose,
    title,
    description = "",
    onSave,
}) => {
    const [editMode, setEditMode] = useState(false)
    const [editedTitle, setEditedTitle] = useState(title)
    const [editedDescription, setEditedDescription] = useState(description)
    const modalRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        if (isOpen) {
            setEditedTitle(title)
            setEditedDescription(description)
            setEditMode(false)
        }
    }, [isOpen, title, description])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose()
            }
        }

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside)
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [isOpen, onClose])

    if (!isOpen) return null

    return (
        <div className="discovery-modal-overlay">
            <div ref={modalRef} className="discovery-modal">
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
                                    })
                                    setEditMode(false)
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
                            {description || "Описание отсутствует"}
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
    )
}

export default DiscoveryModal

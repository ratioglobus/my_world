import "../../style/EditModal.css"

type EditModalTestProps = {
    title: string;
    description: string;
    tags?: string;
    onChangeTitle: (value: string) => void;
    onChangeDescription: (value: string) => void;
    onChangeTags: (value: string) => void;
    onSave: () => void;
    onClose: () => void;
}

export default function EditModalTest({
    title,
    description,
    tags,
    onChangeTitle,
    onChangeDescription,
    onChangeTags,
    onSave,
    onClose
}: EditModalTestProps) {

    return (
        <div className="edit-modal-overlay">
            <div className="edit-modal">
                <h2 className="edit-modal-title">Редактировать элемент</h2>

                <div className="edit-modal-fields">
                    <input
                        type="text"
                        value={title}
                        onChange={e => onChangeTitle(e.target.value)}
                        placeholder="Название проекта"
                        className="edit-modal-input"
                    />

                    <textarea
                        value={description}
                        onChange={e => onChangeDescription(e.target.value)}
                        placeholder="Комментарий"
                        rows={3}
                        className="edit-modal-input edit-modal-textarea"
                    />

                    <input
                        type="text"
                        value={tags}
                        onChange={e => onChangeTags(e.target.value)}
                        placeholder="Теги"
                        className="edit-modal-input"
                    />
                </div>

                <div className="edit-modal-buttons">
                    <button className="edit-btn cancel-btn" onClick={onClose}>
                        Отмена
                    </button>
                    <button className="edit-btn save-btn" onClick={onSave}>
                        Сохранить
                    </button>
                </div>
            </div>
        </div>
    )
}

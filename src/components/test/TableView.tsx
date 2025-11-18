interface TableViewProps {
    items: {
        id: number;
        title: string;
        description: string;
        tags: string[];
        likes: number;
        isFavorite: boolean;
    }[];
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
    onLike: (id: number) => void;
    onFavoriteToggle: (id: number) => void;
}

export default function TableView({
    items,
    onEdit,
    onDelete,
    onLike,
    onFavoriteToggle
}: TableViewProps) {

    return (
        <table className="items-table">
            <thead>
                <tr>
                    <th>Название</th>
                    <th>Описание</th>
                    <th>Теги</th>
                    <th>Лайки</th>
                    <th>⭐</th>
                    <th></th>
                </tr>
            </thead>

            <tbody>
                {items.map(item => (
                    <tr key={item.id}>
                        <td>{item.title}</td>
                        <td>{item.description}</td>
                        <td>{item.tags.join(", ")}</td>
                        <td>{item.likes}</td>
                        <td>{item.isFavorite ? "★" : ""}</td>
                        <td className="tr-test">
                            <div className="table-actions">
                                <button className="item-card-button-favorite" onClick={() => onEdit(item.id)}>Edit</button>
                                <button className="item-card-button-favorite" onClick={() => onLike(item.id)}>❤</button>
                                <button className="item-card-button-favorite" onClick={() => onFavoriteToggle(item.id)}>★</button>
                                <button className="item-card-button-favorite" onClick={() => onDelete(item.id)}>🗑️</button>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

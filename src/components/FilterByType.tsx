import "../style/FilterBy.css";

type FilterByTypeProps = {
    selectedType: string;
    onTypeChange: (type: string) => void;
    types?: { label: string; value: string }[];
    className?: string;
};

export default function FilterByType({ selectedType, onTypeChange, types, className }: FilterByTypeProps) {
    const availableTypes = types ?? [
        { label: "Фильмы", value: "Фильм" },
        { label: "Сериалы", value: "Сериал" },
        { label: "Книги", value: "Книга" },
        { label: "Аниме", value: "Аниме" },
        { label: "Игры", value: "Игра" },
        { label: "YouTube", value: "YouTube" },
    ];

    return (
        <div className={`filter-container ${className ?? ""}`}>
            <div className="filter-wrapper">
                <select
                    id="filter-select"
                    className="filter-select"
                    onChange={(e) => onTypeChange(e.target.value)}
                    value={selectedType}
                >
                    <option value="Все типы">Все типы</option>
                    {availableTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                            {type.label}
                        </option>
                    ))}
                </select>
                <span className="filter-arrow">
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L6 6L11 1" stroke="#1e1b4b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </span>
            </div>
        </div>
    );
}

import "../style/FilterBy.css";

type FilterByPriorityProps = {
    selectedPriority: string;
    onPriorityChange: (priority: string) => void;
    priorities?: { label: string; value: string }[];
    className?: string;
};

export default function FilterByPriority({ selectedPriority, onPriorityChange, priorities, className }: FilterByPriorityProps) {
    const availablePriorities = priorities ?? [
        { label: "Средние", value: "Среднее" },
        { label: "Важные", value: "Важное" },
        { label: "Критичные", value: "Критичное" },
    ];

    return (
        <div className={`filter-container ${className ?? ""}`}>
            <div className="filter-wrapper">
                <select
                    id="filter-select"
                    className="filter-select"
                    onChange={(e) => onPriorityChange(e.target.value)}
                    value={selectedPriority}
                >
                    <option value="Все приоритеты">Все приоритеты</option>
                    {availablePriorities.map((priority) => (
                        <option key={priority.value} value={priority.value}>
                            {priority.label}
                        </option>
                    ))}
                </select>
                <span className="filter-arrow">
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L6 6L11 1" stroke="#1e1b4b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </span>
            </div>
        </div>
    );
}

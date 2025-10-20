import { useState } from "react";
import "../style/FilterBy.css";

type FilterByTypeProps = {
  selectedType: string;
  onTypeChange: (type: string) => void;
  types?: { label: string; value: string }[];
  className?: string;
};

export default function FilterByType({
  selectedType,
  onTypeChange,
  types,
  className,
}: FilterByTypeProps) {
  const availableTypes = types ?? [
    { label: "Фильмы", value: "Фильм" },
    { label: "Сериалы", value: "Сериал" },
    { label: "Книги", value: "Книга" },
    { label: "Аниме", value: "Аниме" },
    { label: "Игры", value: "Игра" },
    { label: "Идеи", value: "Идея" },
    { label: "YouTube", value: "YouTube" },
  ];

  const [open, setOpen] = useState(false);

  return (
    <div className={`filter-container ${className ?? ""}`}>
      <div className="filter-wrapper">
        <select
          className="filter-select"
          value={selectedType}
          onChange={(e) => onTypeChange(e.target.value)}
          onClick={() => setOpen(!open)}
        >
          <option value="Все типы">Все типы</option>
          {availableTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

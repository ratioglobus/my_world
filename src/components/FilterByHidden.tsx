import "../style/FilterByHidden.css";

type FilterByHiddenProps = {
  isActive: boolean;
  onToggle: () => void;
};

export default function FilterByHidden({ isActive, onToggle }: FilterByHiddenProps) {
  return (
    <button
      className={`filter-hidden-btn ${isActive ? "active" : ""}`}
      onClick={onToggle}
    >
      {isActive ? "Показаны скрытые" : "Скрытые"}
    </button>
  );
}

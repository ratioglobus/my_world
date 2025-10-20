import "../style/FilterBy.css";

type FilterIdeasButtonProps = {
  selectedType: string;
  onTypeChange: (type: string) => void;
};

export default function FilterIdeasButton({
  selectedType,
  onTypeChange,
}: FilterIdeasButtonProps) {
  return (
    <button
      className={`filter-idea-btn ${selectedType === "Идея" ? "active" : ""}`}
      onClick={() =>
        onTypeChange(selectedType === "Идея" ? "Все типы" : "Идея")
      }
    >
      Только идеи
    </button>
  );
}

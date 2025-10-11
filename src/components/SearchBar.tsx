import "../style/SearchBar.css";

type SearchBarProps = {
  query: string;
  onSearch: (text: string) => void;
};

export default function SearchBar({ query, onSearch }: SearchBarProps) {
  return (
    <div className="searchbar-container card-bg">
      <input
        value={query}
        onChange={(e) => onSearch(e.target.value)}
        type="text"
        placeholder="Поиск по названию..."
        aria-label="Поле поиска по названию"
        className="searchbar-input"
      />
    </div>
  );
}

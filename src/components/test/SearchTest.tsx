import "../../style/SearchBar.css";

type SearchTestProps = {
  query: string;
  onSearch: (text: string) => void;
};

export default function SearchTest({ query, onSearch }: SearchTestProps) {
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

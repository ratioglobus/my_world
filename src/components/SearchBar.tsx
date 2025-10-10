type SearchBarProps = {
    query: string;
    onSearch: (text: string) => void;
};

export default function SearchBar({ query, onSearch }: SearchBarProps) {
    return (
        <div className="card-bg" style={{
            maxWidth: "640px",
            margin: "0 auto 30px",
            display: "flex",
            alignItems: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
            gap: "8px",
        }}>
            <input
                value={query}
                onChange={(e) => onSearch(e.target.value)}
                type="text"
                placeholder="Поиск по названию..."
                aria-label="Поле поиска по названию"
                style={{
                    flex: "1",
                    width: "640px",
                    padding: "10px",
                    borderRadius: "6px",
                    border: "1px solid #374151",
                    backgroundColor: "var(--card-bg)",
                    color: "#f9fafb",
                    fontSize: "1rem",
                    outline: "none"
                }}
            />
        </div>
    )
} 
type SearchBarProps = {
    query: string;
    onSearch: (text: string) => void;
};

export default function SearchBar({ query, onSearch }: SearchBarProps) {
    return (
        <div style={{
            maxWidth: "600px",
            margin: "0 auto 20px",
            display: "flex",
            alignItems: "center",
            gap: "8px"
        }}>
            <input
                value={query}
                onChange={(e) => onSearch(e.target.value)}
                type="text"
                placeholder="Поиск по названию..."
                aria-label="Поле поиска по названию"
                style={{
                    flex: "1",
                    width: "400px",
                    padding: "10px",
                    borderRadius: "6px",
                    border: "1px solid #374151",
                    backgroundColor: "#1f2937",
                    color: "#f9fafb",
                    fontSize: "1rem",
                    outline: "none"
                }}
            />
        </div>
    )
} 
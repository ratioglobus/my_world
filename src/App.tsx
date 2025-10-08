import './App.css';
import { useState, useEffect } from "react";
import type { MediaItemProps } from "./types/MediaItem";
import ItemList from "./components/ItemList";
import AddItemForm from "./components/AddItemForm";
import SearchBar from "./components/SearchBar";

function App() {
  const [items, setItems] = useState<MediaItemProps[]>(() => {
    const stored = localStorage.getItem("mediaItems");
    return stored ? JSON.parse(stored) : [];
  });
  const [query, setQuery] = useState<string>("");
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem("mediaItems", JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem("mediaItems", JSON.stringify(items));
  }, [items]);

  function handleAdd(newItem: MediaItemProps) {
    setItems((prevItems) => [...prevItems, newItem]);
  }

  function handleDelete(id: string) {
    setItems((prevItems) => prevItems.filter(item => item.id !== id));
  }

  function handleEdit(id: string) {
    setEditingItemId(id);
  }

  function handleUpdate(id: string, updatedItem: MediaItemProps) {
    setItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? updatedItem : item))
    );
    setEditingItemId(null);
  }

  const visibleItems = items.filter((item) =>
    item.title.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "40px 16px",
        width: "100%",
        minHeight: "100vh",
        boxSizing: "border-box",
        color: "#f9fafb",
      }}
    >
      <h1 style={{ marginBottom: "24px" }}>Мои исследования:</h1>
      <SearchBar query={query} onSearch={setQuery} />
      <AddItemForm onAdd={handleAdd} />
      <ItemList
        items={visibleItems}
        onDelete={handleDelete}
        onEdit={handleEdit}
        onUpdate={handleUpdate}
        editingItemId={editingItemId}
      />
    </div>
  );
}

export default App;

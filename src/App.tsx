import "./App.css";
import { useState, useEffect } from "react";
import type { MediaItemProps } from "./types/MediaItem";
import ItemList from "./components/ItemList";
import AddItemForm from "./components/AddItemForm";
import SearchBar from "./components/SearchBar";
import ConfirmModal from "./components/ConfirmModal";

function App() {
  const [completedItems, setCompletedItems] = useState<MediaItemProps[]>(() => {
    const stored = localStorage.getItem("completedItems");
    return stored ? JSON.parse(stored) : [];
  });

  const [plannedItems, setPlannedItems] = useState<MediaItemProps[]>(() => {
    const stored = localStorage.getItem("plannedItems");
    return stored ? JSON.parse(stored) : [];
  });

  const [query, setQuery] = useState("");
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [viewItemId, setViewItemId] = useState<string | null>(null);
  const [mode, setMode] = useState<"completed" | "planned">("completed");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem("completedItems", JSON.stringify(completedItems));
  }, [completedItems]);

  useEffect(() => {
    localStorage.setItem("plannedItems", JSON.stringify(plannedItems));
  }, [plannedItems]);

  const handleAdd = (item: MediaItemProps) => {
    if (mode === "completed") {
      setCompletedItems(prev => [item, ...prev]);
    } else {
      setPlannedItems(prev => [item, ...prev]);
    }
  };

  const handleView = (id: string) => setViewItemId(id);

  const handleDelete = (id: string) => {
    if (mode === "completed") setCompletedItems(prev => prev.filter(item => item.id !== id));
    else setPlannedItems(prev => prev.filter(item => item.id !== id));
    setConfirmDeleteId(null);
  };

  const handleEdit = (id: string) => setEditingItemId(id);

  const handleUpdate = (id: string, updatedItem: MediaItemProps) => {
    if (mode === "completed") {
      setCompletedItems(prev => prev.map(item => (item.id === id ? updatedItem : item)));
    } else {
      setPlannedItems(prev => prev.map(item => (item.id === id ? updatedItem : item)));
    }
    setEditingItemId(null);
  };

  const filteredItems = (mode === "completed" ? completedItems : plannedItems).filter(item =>
    item.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        minHeight: "100vh",
        boxSizing: "border-box",
        color: "#f9fafb",
        paddingBottom: "40px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "center", margin: "24px 0 16px 0" }}>
        <div
          style={{
            position: "relative",
            display: "flex",
            backgroundColor: "var(--card-bg)",
            borderRadius: "9999px",
            padding: "6px",
            width: "300px",
            justifyContent: "space-between",
            boxShadow: "inset 0 1px 3px rgba(0,0,0,0.3)",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "6px",
              bottom: "6px",
              left: mode === "completed" ? "6px" : "calc(50% - 3px)",
              width: "calc(50% - 3px)",
              backgroundColor: "#fff",
              borderRadius: "9999px",
              transition: "all 0.35s cubic-bezier(0.25, 1, 0.5, 1)",
              boxShadow: "0 2px 6px rgba(16,185,129,0.3)",
            }}
          />
          <button
            onClick={() => setMode("completed")}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              color: mode === "completed" ? "#000" : "#fff",
              fontWeight: 500,
              borderRadius: "9999px",
              cursor: "pointer",
              zIndex: 2,
              transition: "color 0.3s ease",
              outline: "none",
              padding: "8px 0",
            }}
            onMouseDown={(e) => e.preventDefault()}
          >
            Готовые
          </button>

          <button
            onClick={() => setMode("planned")}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              color: mode === "planned" ? "#000" : "#fff",
              fontWeight: 500,
              borderRadius: "9999px",
              cursor: "pointer",
              zIndex: 2,
              transition: "color 0.3s ease",
              outline: "none",
              padding: "8px 0",
            }}
            onMouseDown={(e) => e.preventDefault()}
          >
            Планируемые
          </button>
        </div>
      </div>

      <h1 style={{ marginBottom: "18px", fontSize: "24px" }}>
        {mode === "completed" ? "Добавить исследование" : "Запланировать исследование"}
      </h1>
      <AddItemForm onAdd={handleAdd} mode={mode} />

      <h1 style={{ textAlign: "center", margin: "20px 0 10px 0", fontSize: "24px" }}>
        {mode === "completed" ? "Готовые исследования" : "Запланированное"}
      </h1>

      <SearchBar query={query} onSearch={setQuery} />

      <ItemList
        items={filteredItems}
        onDelete={(id: string) => setConfirmDeleteId(id)}
        onEdit={handleEdit}
        onUpdate={handleUpdate}
        editingItemId={editingItemId}
        onView={handleView}
        viewItemId={viewItemId}
        mode={mode}
      />

      {confirmDeleteId && (
        <ConfirmModal
          message="Вы точно хотите удалить элемент?"
          onConfirm={() => handleDelete(confirmDeleteId)}
          onCancel={() => setConfirmDeleteId(null)}
        />
      )}
    </div>
  );
}

export default App;

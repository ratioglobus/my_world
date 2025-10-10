import "./App.css";
import { useState, useEffect } from "react";
import type { MediaItemProps } from "./types/MediaItem";
import ItemList from "./components/ItemList";
import AddItemForm from "./components/AddItemForm";
import SearchBar from "./components/SearchBar";
import ConfirmModal from "./components/ConfirmModal";
import { supabase } from "./supabaseClient"; // импорт клиента Supabase

function App() {
  const [completedItems, setCompletedItems] = useState<MediaItemProps[]>([]);
  const [plannedItems, setPlannedItems] = useState<MediaItemProps[]>([]);
  const [query, setQuery] = useState("");
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [viewItemId, setViewItemId] = useState<string | null>(null);
  const [mode, setMode] = useState<"completed" | "planned">("completed");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // --- Загрузка данных с Supabase ---
  const fetchItems = async () => {
    const { data: completed, error: cError } = await supabase
      .from("completed_items")
      .select("*");
    if (cError) console.error(cError);
    else setCompletedItems(completed || []);

    const { data: planned, error: pError } = await supabase
      .from("planned_items")
      .select("*");
    if (pError) console.error(pError);
    else setPlannedItems(planned || []);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // --- CRUD функции ---
  const handleAdd = async (item: MediaItemProps) => {
    if (mode === "completed") {
      const { data, error } = await supabase
        .from("completed_items")
        .insert([item])
        .select();
      if (error) console.error(error);
      else setCompletedItems(prev => [data[0], ...prev]);
    } else {
      const { data, error } = await supabase
        .from("planned_items")
        .insert([item])
        .select();
      if (error) console.error(error);
      else setPlannedItems(prev => [data[0], ...prev]);
    }
  };

  const handleUpdate = async (id: string, updatedItem: MediaItemProps) => {
    if (mode === "completed") {
      const { data, error } = await supabase
        .from("completed_items")
        .update(updatedItem)
        .eq("id", id)
        .select();
      if (error) console.error(error);
      else setCompletedItems(prev => prev.map(item => (item.id === id ? data[0] : item)));
    } else {
      const { data, error } = await supabase
        .from("planned_items")
        .update(updatedItem)
        .eq("id", id)
        .select();
      if (error) console.error(error);
      else setPlannedItems(prev => prev.map(item => (item.id === id ? data[0] : item)));
    }
    setEditingItemId(null);
  };

  const handleDelete = async (id: string) => {
    if (mode === "completed") {
      const { error } = await supabase.from("completed_items").delete().eq("id", id);
      if (error) console.error(error);
      else setCompletedItems(prev => prev.filter(item => item.id !== id));
    } else {
      const { error } = await supabase.from("planned_items").delete().eq("id", id);
      if (error) console.error(error);
      else setPlannedItems(prev => prev.filter(item => item.id !== id));
    }
    setConfirmDeleteId(null);
  };

  const handleView = (id: string) => setViewItemId(id);
  const handleEdit = (id: string) => setEditingItemId(id);

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
      {/* --- Переключатель режимов --- */}
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

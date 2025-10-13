import "./App.css";
import { useState, useEffect } from "react";
import type { MediaItemProps } from "./types/MediaItem";
import ItemList from "./components/ItemList";
import AddItemForm from "./components/AddItemForm";
import SearchBar from "./components/SearchBar";
import ConfirmModal from "./components/ConfirmModal";
import RatingModal from "./components/RatingModal";
import { supabase } from "./supabaseClient";
import AuthForm from "./components/AuthForm";

function App() {
  const [user, setUser] = useState<any>(null);
  const [completedItems, setCompletedItems] = useState<MediaItemProps[]>([]);
  const [plannedItems, setPlannedItems] = useState<MediaItemProps[]>([]);
  const [query, setQuery] = useState("");
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [viewItemId, setViewItemId] = useState<string | null>(null);
  const [ratingItem, setRatingItem] = useState<MediaItemProps | null>(null);
  const [mode, setMode] = useState<"completed" | "planned">(
    () => (localStorage.getItem("mode") as "completed" | "planned") || "completed"
  );
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [burgerOpen, setBurgerOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    setBurgerOpen(false);
  }, []);

  const handleModeChange = (newMode: "completed" | "planned") => {
    setMode(newMode);
    localStorage.setItem("mode", newMode);
  };

  const fetchItems = async () => {
    if (!user) return;

    const { data: completed, error: cError } = await supabase
      .from("completed_items")
      .select("*")
      .eq("user_id", user.id)
      .order("createdAt", { ascending: false });
    if (cError) console.error(cError);
    else setCompletedItems(completed || []);

    const { data: planned, error: pError } = await supabase
      .from("planned_items")
      .select("*")
      .eq("user_id", user.id)
      .order("createdAt", { ascending: false });
    if (pError) console.error(pError);
    else setPlannedItems(planned || []);
  };

  useEffect(() => {
    fetchItems();
  }, [user]);

  const handleAdd = async (item: Omit<MediaItemProps, "id" | "user_id">) => {
    if (!user) return;
    const dbItem = { ...item, user_id: user.id, createdAt: item.createdAt ?? new Date().toISOString() };
    const { data, error } = await supabase
      .from(mode === "completed" ? "completed_items" : "planned_items")
      .insert([dbItem])
      .select();
    if (error) console.error(error);
    else {
      if (mode === "completed") setCompletedItems(prev => [data[0], ...prev]);
      else setPlannedItems(prev => [data[0], ...prev]);
    }
  };

  const handleUpdate = async (id: string, updatedItem: MediaItemProps) => {
    if (!user) return;
    const dbItem = { ...updatedItem, user_id: user.id };
    const table = mode === "completed" ? "completed_items" : "planned_items";

    const { data, error } = await supabase
      .from(table)
      .update(dbItem)
      .eq("id", id)
      .eq("user_id", user.id)
      .select();
    if (error) console.error(error);
    else {
      if (mode === "completed") setCompletedItems(prev => prev.map(item => (item.id === id ? data[0] : item)));
      else setPlannedItems(prev => prev.map(item => (item.id === id ? data[0] : item)));
    }
    setEditingItemId(null);
  };

  const handleDelete = async (id: string) => {
    if (!user) return;
    const table = mode === "completed" ? "completed_items" : "planned_items";
    const { error } = await supabase.from(table).delete().eq("id", id).eq("user_id", user.id);
    if (error) console.error(error);
    else {
      if (mode === "completed") setCompletedItems(prev => prev.filter(item => item.id !== id));
      else setPlannedItems(prev => prev.filter(item => item.id !== id));
    }
    setConfirmDeleteId(null);
  };

  const handleView = (id: string) => setViewItemId(id);
  const handleEdit = (id: string) => setEditingItemId(id);

  const handleMarkAsCompleted = async (item: MediaItemProps, rating: number): Promise<void> => {
    if (!user) return;

    const updatedItem = {
      ...item,
      rating,
      completed_at: new Date().toISOString(), // snake_case как в базе
      user_id: user.id,
    };

    // Удаляем из планируемых
    await supabase
      .from("planned_items")
      .delete()
      .eq("id", item.id)
      .eq("user_id", user.id);
    setPlannedItems(prev => prev.filter(i => i.id !== item.id));

    // Добавляем в готовые
    const { data, error } = await supabase
      .from("completed_items")
      .insert([updatedItem])
      .select();

    if (error) console.error(error);
    else setCompletedItems(prev => [data[0], ...prev]);

    // **Сброс viewItemId**, чтобы модалка деталей не открывалась
    setViewItemId(null);
  };



  const handleRatingSave = async (item: MediaItemProps, rating: number) => {
    if (!user) return;

    const updatedItem = { ...item, user_id: user.id, rating, completed_at: new Date().toISOString() };

    await supabase.from("planned_items").delete().eq("id", item.id).eq("user_id", user.id);
    setPlannedItems(prev => prev.filter(i => i.id !== item.id));

    const { data, error } = await supabase
      .from("completed_items")
      .insert([updatedItem])
      .select();
    if (error) console.error(error);
    else setCompletedItems(prev => [data[0], ...prev]);

    setRatingItem(null);
  };

  const filteredItems = (mode === "completed" ? completedItems : plannedItems).filter(item =>
    item.title.toLowerCase().includes(query.toLowerCase())
  );

  if (!user) return <AuthForm onLogin={() => fetchItems()} />;

  return (
    <div className="app-container">
      <div className="top-bar">
        <button className="burger-btn" onClick={() => setBurgerOpen(prev => !prev)}>☰</button>
        {burgerOpen && <button className="signout-btn" onClick={() => supabase.auth.signOut()}>Выйти</button>}
        <button className="logout-button-desktop" onClick={() => supabase.auth.signOut()}>Выйти</button>
      </div>

      <div className="mode-toggle">
        <div className={`toggle-slider ${mode}`} />
        <button className={`toggle-btn ${mode === "completed" ? "active" : ""}`} onClick={() => handleModeChange("completed")} onMouseDown={(e) => e.preventDefault()}>Готовые</button>
        <button className={`toggle-btn ${mode === "planned" ? "active" : ""}`} onClick={() => handleModeChange("planned")} onMouseDown={(e) => e.preventDefault()}>Планируемые</button>
      </div>

      <h1 className="section-title">{mode === "completed" ? "Добавить исследование" : "Запланировать исследование"}</h1>
      <AddItemForm onAdd={handleAdd} mode={mode} />

      <h1 className="section-title">{mode === "completed" ? "Готовые исследования" : "Запланированное"}</h1>
      <SearchBar query={query} onSearch={setQuery} />

      <ItemList
        items={filteredItems}
        editingItemId={editingItemId}
        onDelete={setConfirmDeleteId}
        onEdit={handleEdit}
        onUpdate={handleUpdate}
        onView={handleView}
        viewItemId={viewItemId}
        mode={mode}
        setEditingItemId={setEditingItemId}
        onMarkAsCompleted={handleMarkAsCompleted}
      />

      {ratingItem && (
        <RatingModal
          item={ratingItem}
          onSubmit={handleRatingSave}
          onClose={() => setRatingItem(null)}
        />
      )}

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

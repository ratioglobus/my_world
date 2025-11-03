import "../style/MyProfilePage.css";
import { useState, useEffect } from "react";
import type { MediaItemProps } from "../types/MediaItem";
import { supabase } from "../supabaseClient";
import { Link } from "react-router-dom";
import ItemList from "../components/ItemList";
import AddItemForm from "../components/AddItemForm";
import SearchBar from "../components/SearchBar";
import ConfirmModal from "../components/ConfirmModal";
import RatingModal from "../components/RatingModal";
import AuthForm from "../components/AuthForm";
import FilterByType from "../components/FilterByType";
import FilterByPriority from "../components/FilterByPriority";
import FilterIdeasButton from "../components/FilterIdeasButton";
import FilterByHidden from "../components/FilterByHidden";

function MyProfilePage() {
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
  const [selectedType, setSelectedType] = useState("Все типы");
  const [selectedPriority, setSelectedPriority] = useState("Все приоритеты");
  const [showHiddenOnly, setShowHiddenOnly] = useState(false);
  const ITEMS_PER_PAGE = 16;
  const [currentPage, setCurrentPage] = useState(1);

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const stored = localStorage.getItem('theme') as 'light' | 'dark' | null;
      if (stored === 'light' || stored === 'dark') return stored;
      if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    } catch (e) {
      console.error(e);
    }
    return 'light';
  });

  useEffect(() => {
    try {
      if (theme === 'dark') {
        document.body.classList.add('dark-theme');
        document.body.classList.remove('light-theme');
      } else {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
      }
      localStorage.setItem('theme', theme);
      console.log('Theme applied:', theme, 'body.classList:', document.body.className);
    } catch (err) {
      console.error('Failed to apply theme', err);
    }
  }, [theme]);

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  useEffect(() => {
    setCurrentPage(1);
  }, [query, selectedType, selectedPriority]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [currentPage]);

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

  const onTypeChange = (type: string) => setSelectedType(type);
  const onPriorityChange = (priority: string) => setSelectedPriority(priority);

  const fetchItems = async () => {
    if (!user) return;

    const { data: completed, error: cError } = await supabase
      .from("completed_items_with_likes")
      .select("*")
      .eq("user_id", user.id)
      .order("createdAt", { ascending: false });

    if (cError) console.error(cError);
    else setCompletedItems(completed || []);

    const { data: planned, error: pError } = await supabase
      .from("planned_items_with_likes")
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
    const table = mode === "completed" ? "completed_items" : "planned_items";
    const cleanItem = { ...updatedItem };
    delete cleanItem.status;
    delete cleanItem.statusProject;

    const { data, error } = await supabase
      .from(table)
      .update(cleanItem)
      .eq("id", id)
      .eq("user_id", user.id)
      .select();
    if (error) console.error(error);
    else {
      if (mode === "completed") {
        setCompletedItems(prev =>
          prev.map(item =>
            item.id === id
              ? { ...item, ...updatedItem, ...(data?.[0] || {}) }
              : item
          )
        );
      } else {
        setPlannedItems(prev =>
          prev.map(item =>
            item.id === id
              ? { ...item, ...updatedItem, ...(data?.[0] || {}) }
              : item
          )
        );
      }
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

  const handleMarkAsCompleted = async (item: MediaItemProps, rating: number) => {
    if (!user) return;

    const updatedItem = { ...item, rating, completed_at: new Date().toISOString(), user_id: user.id };

    await supabase.from("planned_items").delete().eq("id", item.id).eq("user_id", user.id);
    setPlannedItems(prev => prev.filter(i => i.id !== item.id));

    const { data, error } = await supabase.from("completed_items").insert([updatedItem]).select();
    if (error) console.error(error);
    else setCompletedItems(prev => [data[0], ...prev]);

    setViewItemId(null);
  };

  const handleRatingSave = async (item: MediaItemProps, rating: number) => {
    if (!user) return;
    const updatedItem = { ...item, rating, completed_at: new Date().toISOString(), user_id: user.id };

    await supabase.from("planned_items").delete().eq("id", item.id).eq("user_id", user.id);
    setPlannedItems(prev => prev.filter(i => i.id !== item.id));

    const { data, error } = await supabase.from("completed_items").insert([updatedItem]).select();
    if (error) console.error(error);
    else setCompletedItems(prev => [data[0], ...prev]);

    setRatingItem(null);
  };

  const handleToggleHidden = async (id: string, hidden: boolean) => {
    if (!user) return;
    const table = mode === "completed" ? "completed_items" : "planned_items";

    const { error } = await supabase
      .from(table)
      .update({ is_hidden: hidden })
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error(error);
      return;
    }

    if (mode === "completed") {
      setCompletedItems(prev =>
        prev.map(i => (i.id === id ? { ...i, is_hidden: hidden } : i))
      );
    } else {
      setPlannedItems(prev =>
        prev.map(i => (i.id === id ? { ...i, is_hidden: hidden } : i))
      );
    }
  };

  const handleTogglePin = async (id: string, pinned: boolean) => {
    if (!user) return;
    const table = mode === "completed" ? "completed_items" : "planned_items";

    const { error } = await supabase
      .from(table)
      .update({ is_pinned: pinned })
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error(error);
      return;
    }

    if (mode === "completed") {
      setCompletedItems(prev =>
        prev.map(i => (i.id === id ? { ...i, is_pinned: pinned } : i))
      );
    } else {
      setPlannedItems(prev =>
        prev.map(i => (i.id === id ? { ...i, is_pinned: pinned } : i))
      );
    }
  }

  const filteredItems = (mode === "completed" ? completedItems : plannedItems)
    .filter(item =>
      !item.is_archived &&
      (!showHiddenOnly || item.is_hidden) &&
      item.title.toLowerCase().includes(query.toLowerCase()) &&
      (selectedType === "Все типы" || item.type === selectedType) &&
      (selectedPriority === "Все приоритеты" || item.priority === selectedPriority)
    )
    .sort((a, b) => {
      if (a.is_pinned === b.is_pinned) {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return Number(b.is_pinned) - Number(a.is_pinned);
    });

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const visibleItems = filteredItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  if (!user) return <AuthForm onLogin={() => fetchItems()} />;

  const handleArchive = async (id: string) => {
    if (!user) return;

    const table = mode === "completed" ? "completed_items" : "planned_items";

    const item = (mode === "completed" ? completedItems : plannedItems).find(i => i.id === id);
    if (!item) return;

    const updatedItem = { ...item, is_archived: true };

    const { error } = await supabase
      .from(table)
      .update(updatedItem)
      .eq("id", id)
      .eq("user_id", user.id)
      .select();

    if (error) {
      console.error(error);
      return;
    }

    if (mode === "completed") setCompletedItems(prev => prev.filter(i => i.id !== id));
    else setPlannedItems(prev => prev.filter(i => i.id !== id));
  };

  return (
    <div className="app-container">
      <div className="top-bar">
        <div className={`burger-wrapper ${burgerOpen ? "open" : ""}`}>
          <button
            className="burger-btn mobile-only"
            onClick={() => setBurgerOpen(prev => !prev)}
          >
            ☰
          </button>

          <div className="burger-menu">
            <Link className="top-bar-profile-button" to="/profile">
              Профиль
            </Link>
            <Link className="top-bar-profile-button" to="/follows">
              Подписки
            </Link>
            <Link className="top-bar-profile-button" to="/projects">
              Проекты
            </Link>
            <Link className="top-bar-profile-button" to="/archive-items">
              Архив
            </Link>
            <Link className="top-bar-profile-button" to="/about">
              О проекте
            </Link>
            <button
              className="signout-btn"
              onClick={() => supabase.auth.signOut()}
            >
              Выйти
            </button>
          </div>
        </div>

        <div className="top-bar-center">
          <div className="mode-toggle">
            <div className={`toggle-slider ${mode}`} />
            <button
              className={`toggle-btn ${mode === "completed" ? "active" : ""}`}
              onClick={() => handleModeChange("completed")}
              onMouseDown={e => e.preventDefault()}
            >
              Готовые
            </button>
            <button
              className={`toggle-btn ${mode === "planned" ? "active" : ""}`}
              onClick={() => handleModeChange("planned")}
              onMouseDown={e => e.preventDefault()}
            >
              Планируемые
            </button>
          </div>
        </div>

        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === "light" ? "🌙" : "☀️"}
        </button>
      </div>

      <h1 className="section-title">{mode === "completed" ? "Добавить исследование" : "Запланировать исследование"}</h1>
      <AddItemForm onAdd={handleAdd} mode={mode} />

      <h1 className="section-title">{mode === "completed" ? "Готовые исследования" : "Запланированное"}</h1>
      <SearchBar query={query} onSearch={setQuery} />

      <div className="section-filtered">
        <div className="filters-row">
          <FilterByType selectedType={selectedType} onTypeChange={onTypeChange} />
          <FilterByPriority selectedPriority={selectedPriority} onPriorityChange={onPriorityChange} />
          <FilterByHidden isActive={showHiddenOnly} onToggle={() => setShowHiddenOnly(prev => !prev)} />
          <FilterIdeasButton selectedType={selectedType} onTypeChange={onTypeChange} />
        </div>
      </div>

      <ItemList
        items={visibleItems}
        editingItemId={editingItemId}
        onDelete={setConfirmDeleteId}
        onEdit={handleEdit}
        onUpdate={handleUpdate}
        onView={handleView}
        viewItemId={viewItemId}
        mode={mode}
        theme={theme}
        setEditingItemId={setEditingItemId}
        onMarkAsCompleted={handleMarkAsCompleted}
        onArchive={handleArchive}
        onToggleHidden={handleToggleHidden}
        onTogglePin={handleTogglePin}
        isOwner={true}
      />

      {totalPages > 1 && (
        <div className="pagination">
          <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>Предыдущая</button>
          <span className="pagination-text">Страница {currentPage} из {totalPages}</span>
          <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>Следующая</button>
        </div>
      )}

      {ratingItem && <RatingModal item={ratingItem} onSubmit={handleRatingSave} onClose={() => setRatingItem(null)} />}
      {confirmDeleteId && <ConfirmModal message="Вы точно хотите удалить элемент?" onConfirm={() => handleDelete(confirmDeleteId)} onCancel={() => setConfirmDeleteId(null)} />}
    </div>
  );

}

export default MyProfilePage;

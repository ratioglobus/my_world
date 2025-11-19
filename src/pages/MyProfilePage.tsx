import "../style/MyProfilePage.css";
import "../style/PrivacyPage.css";
import { useState, useEffect, useMemo } from "react";
import type { MediaItemProps } from "../types/MediaItem";
import { supabase } from "../supabaseClient";
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
import BurgerMenu from "../components/BurgerMenu";
import { ItemService } from "../services/ItemService";
import { QuoteWidget } from "../components/QuoteWidget/QuoteWidget";

function MyProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<{ completed: MediaItemProps[]; planned: MediaItemProps[] }>({
    completed: [],
    planned: [],
  });
  const [ui, setUi] = useState({
    query: "",
    editingItemId: null as string | null,
    viewItemId: null as string | null,
    ratingItem: null as MediaItemProps | null,
    confirmDeleteId: null as string | null,
    burgerOpen: false,
    selectedType: "Все типы",
    selectedPriority: "Все приоритеты",
    showHiddenOnly: false,
    currentPage: 1,
    mode: (localStorage.getItem("mode") as "completed" | "planned") || "completed",
    theme: (() => {
      try {
        const stored = localStorage.getItem("theme") as "light" | "dark" | null;
        if (stored === "light" || stored === "dark") return stored;
        if (typeof window !== "undefined" && window.matchMedia?.("(prefers-color-scheme: dark)").matches)
          return "dark";
      } catch (e) {
        console.error(e);
      }
      return "light";
    })(),
  });

  const ITEMS_PER_PAGE = 16;

  useEffect(() => {
    const handleStorage = () => {
      const current = localStorage.getItem("theme") as "light" | "dark" | null;
      if (current && current !== ui.theme) {
        setUi((prev) => ({ ...prev, theme: current }));
      }
    };

    handleStorage();
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [ui.theme]);

  useEffect(() => setUi((prev) => ({ ...prev, currentPage: 1 })), [
    ui.query,
    ui.selectedType,
    ui.selectedPriority,
  ]);

  useEffect(() => window.scrollTo({ top: 0 }), [ui.currentPage]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null));

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) =>
      setUser(session?.user ?? null)
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => setUi((prev) => ({ ...prev, burgerOpen: false })), []);

  const handleModeChange = (newMode: "completed" | "planned") => {
    setUi((prev) => ({ ...prev, mode: newMode }));
    localStorage.setItem("mode", newMode);
  };

  const onTypeChange = (type: string) => setUi((prev) => ({ ...prev, selectedType: type }));
  const onPriorityChange = (priority: string) =>
    setUi((prev) => ({ ...prev, selectedPriority: priority }));

  const fetchItems = async () => {
    if (!user) return;
    try {
      const completed = await ItemService.fetchItems(user.id, "completed");
      const planned = await ItemService.fetchItems(user.id, "planned");
      setItems({ completed, planned });
    } catch (err) {
      console.error("Failed to fetch items:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [user]);

  const handleAdd = async (item: Omit<MediaItemProps, "id" | "user_id">) => {
    if (!user) return;
    try {
      const newItem = await ItemService.addItem(user.id, item, ui.mode);
      setItems((prev) => ({ ...prev, [ui.mode]: [newItem, ...prev[ui.mode]] }));
    } catch (err) {
      console.error("Failed to add item:", err);
    }
  };

  const handleUpdate = async (id: string, updatedItem: MediaItemProps) => {
    if (!user) return;
    try {
      const updated = await ItemService.updateItem(user.id, id, updatedItem, ui.mode);

      setItems((prev) => ({
        ...prev,
        [ui.mode]: prev[ui.mode].map((item) =>
          item.id === id
            ? {
              ...item,
              ...updated,
            }
            : item
        ),
      }));

      setUi((prev) => ({ ...prev, editingItemId: null }));
    } catch (err) {
      console.error("Failed to update item:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!user) return;
    try {
      await ItemService.deleteItem(user.id, id, ui.mode);
      setItems((prev) => ({
        ...prev,
        [ui.mode]: prev[ui.mode].filter((item) => item.id !== id),
      }));
      setUi((prev) => ({ ...prev, confirmDeleteId: null }));
    } catch (err) {
      console.error("Failed to delete item:", err);
    }
  };

  const handleView = (id: string) => setUi((prev) => ({ ...prev, viewItemId: id }));
  const handleEdit = (id: string) => setUi((prev) => ({ ...prev, editingItemId: id }));

  const handleMarkAsCompleted = async (item: MediaItemProps, rating: number) => {
    if (!user) return;
    try {
      const completedItem = await ItemService.moveToCompleted(user.id, item, rating);
      setItems((prev) => ({
        completed: [completedItem, ...prev.completed],
        planned: prev.planned.filter((i) => i.id !== item.id),
      }));
      setUi((prev) => ({ ...prev, viewItemId: null }));
    } catch (err) {
      console.error("Failed to mark as completed:", err);
    }
  };

  const handleRatingSave = async (item: MediaItemProps, rating: number) => {
    if (!user) return;
    try {
      const completedItem = await ItemService.moveToCompleted(user.id, item, rating);
      setItems((prev) => ({
        completed: [completedItem, ...prev.completed],
        planned: prev.planned.filter((i) => i.id !== item.id),
      }));
      setUi((prev) => ({ ...prev, ratingItem: null }));
    } catch (err) {
      console.error("Failed to save rating:", err);
    }
  };

  const handleToggleHidden = async (id: string, hidden: boolean) => {
    if (!user) return;
    try {
      await ItemService.toggleHidden(user.id, id, hidden, ui.mode);
      setItems((prev) => ({
        ...prev,
        [ui.mode]: prev[ui.mode].map((i) => (i.id === id ? { ...i, is_hidden: hidden } : i)),
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleTogglePin = async (id: string, pinned: boolean) => {
    if (!user) return;
    try {
      await ItemService.togglePin(user.id, id, pinned, ui.mode);
      setItems((prev) => ({
        ...prev,
        [ui.mode]: prev[ui.mode].map((i) => (i.id === id ? { ...i, is_pinned: pinned } : i)),
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleArchive = async (id: string) => {
    if (!user) return;
    try {
      await ItemService.archiveItem(user.id, id, ui.mode);
      setItems((prev) => ({
        ...prev,
        [ui.mode]: prev[ui.mode].filter((i) => i.id !== id),
      }));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`realtime:my_items:${user.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "completed_items", filter: `user_id=eq.${user.id}` },
        () => fetchItems()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "planned_items", filter: `user_id=eq.${user.id}` },
        () => fetchItems()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "likes" },
        () => fetchItems()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchItems]);


  const filteredItems = useMemo(() => {
    return items[ui.mode]
      .filter(
        (item) =>
          !item.is_archived &&
          (!ui.showHiddenOnly || item.is_hidden) &&
          item.title.toLowerCase().includes(ui.query.toLowerCase()) &&
          (ui.selectedType === "Все типы" || item.type === ui.selectedType) &&
          (ui.selectedPriority === "Все приоритеты" || item.priority === ui.selectedPriority)
      )
      .sort((a, b) => {
        if (a.is_pinned === b.is_pinned) {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        return Number(b.is_pinned) - Number(a.is_pinned);
      });
  }, [items, ui.mode, ui.query, ui.selectedType, ui.selectedPriority, ui.showHiddenOnly]);

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const startIndex = (ui.currentPage - 1) * ITEMS_PER_PAGE;
  const visibleItems = filteredItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  if (!user) return <AuthForm onLogin={() => fetchItems()} />;

  return (
    <div className="app-container">
      <div className="top-bar">
        <BurgerMenu
          isOpen={ui.burgerOpen}
          onToggle={() => setUi((prev) => ({ ...prev, burgerOpen: !prev.burgerOpen }))}
          onClose={() => setUi((prev) => ({ ...prev, burgerOpen: false }))}
        />

        <div className="top-bar-center">
          <div className="mode-toggle">
            <div className={`toggle-slider ${ui.mode}`} />
            <button
              className={`toggle-btn ${ui.mode === "completed" ? "active" : ""}`}
              onClick={() => handleModeChange("completed")}
              onMouseDown={(e) => e.preventDefault()}
            >
              Готовые
            </button>
            <button
              className={`toggle-btn ${ui.mode === "planned" ? "active" : ""}`}
              onClick={() => handleModeChange("planned")}
              onMouseDown={(e) => e.preventDefault()}
            >
              Планируемые
            </button>
          </div>
        </div>
      </div>

      <h1 className="section-title">
        {ui.mode === "completed" ? "Добавить исследование" : "Запланировать исследование"}
      </h1>
      <AddItemForm onAdd={handleAdd} mode={ui.mode} />
      <QuoteWidget></QuoteWidget>

      <h1 className="section-title">
        {ui.mode === "completed" ? "Готовые исследования" : "Запланированное"}
      </h1>
      <SearchBar query={ui.query} onSearch={(q) => setUi((prev) => ({ ...prev, query: q }))} />

      <div className="section-filtered">
        <div className="filters-row">
          <FilterByType selectedType={ui.selectedType} onTypeChange={onTypeChange} />
          <FilterByPriority selectedPriority={ui.selectedPriority} onPriorityChange={onPriorityChange} />
          <FilterByHidden
            isActive={ui.showHiddenOnly}
            onToggle={() => setUi((prev) => ({ ...prev, showHiddenOnly: !prev.showHiddenOnly }))}
          />
          <FilterIdeasButton selectedType={ui.selectedType} onTypeChange={onTypeChange} />
        </div>
      </div>

      <ItemList
        items={visibleItems}
        editingItemId={ui.editingItemId}
        onDelete={(id) => setUi((prev) => ({ ...prev, confirmDeleteId: id }))}
        onEdit={handleEdit}
        onUpdate={handleUpdate}
        onView={handleView}
        viewItemId={ui.viewItemId}
        mode={ui.mode}
        theme={ui.theme}
        setEditingItemId={(id) => setUi((prev) => ({ ...prev, editingItemId: id }))}
        onMarkAsCompleted={handleMarkAsCompleted}
        onArchive={handleArchive}
        onToggleHidden={handleToggleHidden}
        onTogglePin={handleTogglePin}
        isOwner={true}
        loading={loading}
      />

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() =>
              setUi((prev) => ({ ...prev, currentPage: Math.max(prev.currentPage - 1, 1) }))
            }
            disabled={ui.currentPage === 1}
          >
            Предыдущая
          </button>
          <span className="pagination-text">
            Страница {ui.currentPage} из {totalPages}
          </span>
          <button
            onClick={() =>
              setUi((prev) => ({ ...prev, currentPage: Math.min(prev.currentPage + 1, totalPages) }))
            }
            disabled={ui.currentPage === totalPages}
          >
            Следующая
          </button>
        </div>
      )}

      <footer className="app-footer">
        <button
          className="privacy-btn"
          onClick={() => window.location.href = "/privacy"}
        >
          Политика конфиденциальности
        </button>
        <p>© {new Date().getFullYear()} Tyrell Research</p>
      </footer>

      {ui.ratingItem && (
        <RatingModal
          item={ui.ratingItem}
          onSubmit={handleRatingSave}
          onClose={() => setUi((prev) => ({ ...prev, ratingItem: null }))}
        />
      )}
      {ui.confirmDeleteId && (
        <ConfirmModal
          message="Вы точно хотите удалить элемент?"
          onConfirm={() => handleDelete(ui.confirmDeleteId!)}
          onCancel={() => setUi((prev) => ({ ...prev, confirmDeleteId: null }))}
        />
      )}
    </div>
  );
}

export default MyProfilePage;

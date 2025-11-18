import React, { useState, useEffect, useMemo, useCallback } from "react";
import ItemCard from "../components/test/ItemCard";
import MyButton from "../components/test/MyButton";
import EditModalTest from "../components/test/EditModalTest";
import TableView from "../components/test//TableView";
import SearchTest from "../components/test/SearchTest";
import WeatherWidget from "../components/test/WeatherWidget";

interface Item {
    id: number;
    title: string;
    description: string;
    tags: string[];
    likes: number;
    isFavorite: boolean;
}

const LOCAL_STORAGE_KEY = "react_items";
const LOCAL_STORAGE_KEY_COUNT = "react_count";
const LOCAL_STORAGE_DRAFT = "draft";
const LOCAL_STORAGE_VIEW_MODE = "view_mode";

export default function ReactPage() {
    const [items, setItems] = useState<Item[]>(() => {
        if (typeof window !== "undefined") {
            const storedItems = localStorage.getItem(LOCAL_STORAGE_KEY);
            return storedItems ? JSON.parse(storedItems) : [];
        }
        return [];
    });

    const [count, setCount] = useState<number>(() => {
        if (typeof window !== "undefined") {
            const countItems = localStorage.getItem(LOCAL_STORAGE_KEY_COUNT);
            return countItems ? Number(JSON.parse(countItems)) : 0;
        }
        return 0;
    });

    const [newTitle, setNewTitle] = useState<string>("");
    const [newDescription, setNewDescription] = useState<string>("");
    const [newTags, setNewTags] = useState<string>("");
    const [editingItemId, setEditingItemId] = useState<number | null>(null);
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editTags, setEditTags] = useState("");
    const [filterMode, setFilterMode] = useState<"all" | "favorite">("all");
    const [likesMode, setLikesMode] = useState<"likes" | "notLikes">("notLikes");
    const [isEditing, setIsEditing] = useState(false);
    const [viewMode, setViewMode] = useState<"grid" | "table">(() => {
        if (typeof window !== "undefined") {
            const stored = localStorage.getItem(LOCAL_STORAGE_VIEW_MODE);
            return stored ? JSON.parse(stored) : "grid";
        }
        return "grid";
    });

    const [query, setQuery] = useState("");

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
    }, [items]);

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY_COUNT, JSON.stringify(count));
    }, [count]);

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_VIEW_MODE, JSON.stringify(viewMode));
    }, [viewMode])

    useEffect(() => {
        const draftData = localStorage.getItem(LOCAL_STORAGE_DRAFT);
        if (!draftData) return;

        try {
            const parsed = JSON.parse(draftData);
            setNewTitle(parsed.title || "");
            setNewDescription(parsed.description || "");
            setNewTags(parsed.tags || "");
        } catch (error) {
            console.error(error);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            const draftObj = { title: newTitle, description: newDescription, tags: newTags };
            localStorage.setItem(LOCAL_STORAGE_DRAFT, JSON.stringify(draftObj));
        }, 3000);

        return () => clearTimeout(timer);
    }, [newTitle, newDescription, newTags]);

    const HandleClick = () => {
        setCount(prev => prev + 1);
    };

    const handleEdit = (id: number) => {
        const item = items.find(i => i.id === id);
        if (!item) return;

        setEditTitle(item.title)
        setEditDescription(item.description)
        setEditTags(item.tags.join(", "))
        setEditingItemId(id);
        setIsEditing(true);
    }

    const handleSave = () => {
        if (!editingItemId) return;

        const item = items.find(i => i.id === editingItemId);
        if (!item) return;

        const updatedItem = {
            ...item,
            title: editTitle,
            description: editDescription,
            tags: editTags.split(",").map(t => t.trim()),
        };

        setItems(prev =>
            prev.map(i =>
                i.id === editingItemId ? updatedItem : i
            )
        );

        setEditTitle("");
        setEditDescription("");
        setEditTags("");
        setEditingItemId(null);

        handleCloseModal();
    };

    const handleCloseModal = () => {
        setIsEditing(false);
        setEditingItemId(null)
        setEditTitle("")
        setEditDescription("")
        setEditTags("")
    }

    const handleAddItem = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTitle.trim()) return;

        const tagsArray = newTags
            .split(",")
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0);

        const newItem: Item = {
            id: Date.now(),
            title: newTitle,
            description: newDescription,
            tags: tagsArray,
            likes: 0,
            isFavorite: false,
        };

        setItems(prev => [newItem, ...prev]);
        localStorage.removeItem(LOCAL_STORAGE_DRAFT);
        setNewTitle("");
        setNewDescription("");
        setNewTags("");
    };

    const handleDeleteItem = (id: number) => {
        setItems(prev => prev.filter(item => item.id !== id));
    };

    const handleLike = useCallback((id: number) => {
        setItems(prev =>
            prev.map(item =>
                item.id === id ? { ...item, likes: item.likes + 1 } : item
            )
        );
    }, []);

    const handleFavoriteToggle = useCallback((id: number) => {
        setItems(prev =>
            prev.map(item =>
                item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
            )
        );
    }, []);

    const filteredItems = useMemo(() => {
        return items.filter(item => {
            const matchesSearch = item.title.toLowerCase().includes(query.toLowerCase());
            const matchesFavorites = filterMode === "favorite" ? item.isFavorite : true;
            const matchesLikes = likesMode === "likes" ? item.likes > 0 : true;
            return matchesSearch && matchesFavorites && matchesLikes;
        });
    }, [items, query, filterMode, likesMode]);

    return (
        <div className="reactPage">
            <h1 className="react-page-title">Learning React Page</h1>

            <div className="item-form">
                <form onSubmit={handleAddItem}>
                    <input
                        type="text"
                        placeholder="Название"
                        value={newTitle}
                        onChange={e => setNewTitle(e.target.value)}
                        className="input-test"
                    />
                    <input
                        type="text"
                        placeholder="Описание"
                        value={newDescription}
                        onChange={e => setNewDescription(e.target.value)}
                        className="input-test"
                    />
                    <input
                        type="text"
                        placeholder="Теги (через запятую)"
                        value={newTags}
                        onChange={e => setNewTags(e.target.value)}
                        className="input-test"
                    />
                    <button type="submit">Добавить</button>
                </form>
            </div>

            <div className="filters">
                {filterMode === "all" ? (
                    <button
                        className="filters-button"
                        onClick={() => setFilterMode("favorite")}
                    >
                        Избранные
                    </button>
                ) : (
                    <button
                        className="filters-button"
                        onClick={() => setFilterMode("all")}
                    >
                        Все карточки
                    </button>
                )}



                {likesMode === "notLikes" ? (
                    <button
                        className="filters-button"
                        onClick={() => setLikesMode("likes")}
                    >
                        Оцененные
                    </button>
                ) : (
                    <button
                        className="filters-button"
                        onClick={() => setLikesMode("notLikes")}
                    >
                        Все карточки
                    </button>
                )}
                <div className="view-toggle">
                    {viewMode === "grid" ? (
                        <button className="filters-button" onClick={() => setViewMode("table")}>Таблица</button>
                    ) : (
                        <button className="filters-button" onClick={() => setViewMode("grid")}>Сетка</button>
                    )}
                </div>
            </div>

            <SearchTest query={query} onSearch={setQuery} />

            {viewMode === "grid" ? (
                <div className="item-list-test">
                    {filteredItems.map(item => (
                        <ItemCard
                            key={item.id}
                            id={item.id}
                            title={item.title}
                            description={item.description}
                            tags={item.tags}
                            likes={item.likes}
                            isFavorite={item.isFavorite}
                            onLike={handleLike}
                            onFavoriteToggle={() => handleFavoriteToggle(item.id)}
                            onDelete={() => handleDeleteItem(item.id)}
                            onEdit={() => handleEdit(item.id)}
                        />
                    ))}
                </div>
            ) : (
                <TableView
                    items={filteredItems}
                    onEdit={handleEdit}
                    onDelete={handleDeleteItem}
                    onLike={handleLike}
                    onFavoriteToggle={handleFavoriteToggle}
                />
            )}

            <footer className="footer">
                <MyButton count={count} onClick={HandleClick}></MyButton>
            </footer>

            <WeatherWidget></WeatherWidget>

            {isEditing && (
                <EditModalTest
                    title={editTitle}
                    description={editDescription}
                    tags={editTags}
                    onChangeTitle={setEditTitle}
                    onChangeDescription={setEditDescription}
                    onChangeTags={setEditTags}
                    onSave={handleSave}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
}

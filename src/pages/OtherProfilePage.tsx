import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import ItemList from "../components/ItemList";
import SearchBar from "../components/SearchBar";
import FilterByType from "../components/FilterByType";
import FilterByPriority from "../components/FilterByPriority";
import FilterIdeasButton from "../components/FilterIdeasButton";
import "../style/MyProfilePage.css";
import "../style/OtherProfilePage.css";
import type { MediaItemProps } from "../types/MediaItem";

export default function OtherProfilePage() {
    const { id: userId } = useParams<{ id: string }>();
    const [completedItems, setCompletedItems] = useState<MediaItemProps[]>([]);
    const [plannedItems, setPlannedItems] = useState<MediaItemProps[]>([]);
    const [query, setQuery] = useState("");
    const [viewItemId, setViewItemId] = useState<string | null>(null);
    const [mode, setMode] = useState<"completed" | "planned">("completed");
    const [selectedType, setSelectedType] = useState("Все типы");
    const [selectedPriority, setSelectedPriority] = useState("Все приоритеты");
    const [theme, setTheme] = useState<'light' | 'dark'>('dark');
    const [profile, setProfile] = useState<{ id: string; nickname: string } | null>(null);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [loadingFollow, setLoadingFollow] = useState(true);
    const [burgerOpen, setBurgerOpen] = useState(false);

    // 🌓 Настройка темы
    useEffect(() => {
        const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
        if (storedTheme) {
            setTheme(storedTheme);
            document.body.classList.remove('light-theme', 'dark-theme');
            document.body.classList.add(`${storedTheme}-theme`);
        }
    }, []);

    // 🔁 Функция загрузки карточек
const fetchItems = useCallback(async () => {
  if (!userId) return;

  // Получаем текущего пользователя
  const { data: { user } } = await supabase.auth.getUser();
  const currentUserId = user?.id || null;

  // Универсальная функция загрузки данных из таблицы
  const loadItems = async (table: string) => {
    const { data: items, error } = await supabase
      .from(table)
      .select("*")
      .eq("user_id", userId)
      .eq("is_archived", false)
      .eq("is_hidden", false)
      .order("createdAt", { ascending: false });

    if (error || !items) return [];

    // Получаем все лайки для этих элементов
    const { data: likesData, error: likesError } = await supabase
      .from("likes")
      .select("item_id, user_id")
      .in("item_id", items.map(i => i.id));

    if (likesError) return items;
    const enhanced = items.map(item => {
      const itemLikes = likesData?.filter(l => l.item_id === item.id) || [];
      return {
        ...item,
        likes_count: itemLikes.length,
        liked_by_me: !!itemLikes.find(l => l.user_id === currentUserId),
      };
    });

    return enhanced;
  };

  const [completed, planned] = await Promise.all([
    loadItems("completed_items"),
    loadItems("planned_items"),
  ]);

  setCompletedItems(completed);
  setPlannedItems(planned);
}, [userId]);


    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    useEffect(() => {
        if (!userId) return;
        const fetchProfile = async () => {
            const { data, error } = await supabase
                .from("profiles")
                .select("user_id, nickname")
                .eq("user_id", userId);
            if (!error && data && data.length > 0)
                setProfile({ id: data[0].user_id, nickname: data[0].nickname });
        };
        fetchProfile();
    }, [userId]);

    useEffect(() => {
        const fetchCurrentUserAndFollowStatus = async () => {
            const { data: { user }, error } = await supabase.auth.getUser();
            if (!user || error) return;
            setCurrentUserId(user.id);

            if (user.id !== userId) {
                const { data: followData, error: followError } = await supabase
                    .from("follows")
                    .select("*")
                    .eq("follower_id", user.id)
                    .eq("following_id", userId);
                if (!followError) setIsFollowing(followData.length > 0);
            }
            setLoadingFollow(false);
        };
        fetchCurrentUserAndFollowStatus();
    }, [userId]);

    const handleToggleLike = async (itemId: string, liked: boolean) => {
        if (!currentUserId) return;

        if (liked) {
            await supabase.from("likes").insert([{ user_id: currentUserId, item_id: itemId }]);
        } else {
            await supabase.from("likes")
                .delete()
                .eq("user_id", currentUserId)
                .eq("item_id", itemId);
        }

        const updateLikes = (items: MediaItemProps[]) =>
            items.map(item =>
                item.id === itemId
                    ? {
                        ...item,
                        liked_by_me: liked,
                        likes_count: (item.likes_count || 0) + (liked ? 1 : -1),
                    }
                    : item
            );

        if (mode === "completed") {
            setCompletedItems(prev => updateLikes(prev));
        } else {
            setPlannedItems(prev => updateLikes(prev));
        }
    };

    const handleFollowToggle = async () => {
        if (!currentUserId) return;
        setLoadingFollow(true);

        if (isFollowing) {
            const { error } = await supabase
                .from("follows")
                .delete()
                .eq("follower_id", currentUserId)
                .eq("following_id", userId);
            if (!error) setIsFollowing(false);
        } else {
            const { error } = await supabase
                .from("follows")
                .insert([{ follower_id: currentUserId, following_id: userId }]);
            if (!error) setIsFollowing(true);
        }

        setLoadingFollow(false);
    };

    const handleModeChange = (newMode: "completed" | "planned") => setMode(newMode);
    const onTypeChange = (type: string) => setSelectedType(type);
    const onPriorityChange = (priority: string) => setSelectedPriority(priority);

    const filteredItems = (mode === "completed" ? completedItems : plannedItems).filter(
        item =>
            item.title.toLowerCase().includes(query.toLowerCase()) &&
            (selectedType === "Все типы" || item.type === selectedType) &&
            (selectedPriority === "Все приоритеты" || item.priority === selectedPriority)
    );

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
                        <Link className="top-bar-profile-button" to="/">На главную</Link>
                        <Link className="top-bar-profile-button" to="/profile">Профиль</Link>
                        <Link className="top-bar-profile-button" to="/follows">Подписки</Link>
                        <Link className="top-bar-profile-button" to="/projects">Проекты</Link>
                        <Link className="top-bar-profile-button" to="/archive-items">Архив</Link>
                        <Link className="top-bar-profile-button" to="/about">О проекте</Link>
                        <button className="signout-btn" onClick={() => supabase.auth.signOut()}>
                            Выйти
                        </button>
                    </div>
                </div>
            </div>

            <div className="top-bar-other-profile-wrapper">
                <div className="top-bar-other-profile">
                    {profile
                        ? currentUserId === userId
                            ? "Моя страница"
                            : `Профиль ${profile.nickname}`
                        : "Загрузка..."}

                    {currentUserId !== userId && !loadingFollow && (
                        <button
                            className="top-bar-button-follow"
                            onClick={handleFollowToggle}
                        >
                            {isFollowing ? "Отписаться" : "Подписаться"}
                        </button>
                    )}
                </div>
            </div>

            <div className="top-bar">
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
            </div>

            <h1 className="section-title">
                {mode === "completed" ? "Готовые исследования" : "Запланированное"}
            </h1>

            <SearchBar query={query} onSearch={setQuery} />

            <div className="section-filtered">
                <div className="filters-row">
                    <FilterByType selectedType={selectedType} onTypeChange={onTypeChange} />
                    <FilterByPriority selectedPriority={selectedPriority} onPriorityChange={onPriorityChange} />
                    <FilterIdeasButton selectedType={selectedType} onTypeChange={onTypeChange} />
                </div>
            </div>

            <ItemList
                items={filteredItems}
                editingItemId={null}
                onDelete={() => { }}
                onEdit={() => { }}
                onUpdate={() => { }}
                onView={setViewItemId}
                viewItemId={viewItemId}
                mode={mode}
                theme={theme}
                setEditingItemId={() => { }}
                isOwner={false}
                onToggleLike={handleToggleLike}
            />
        </div>
    );
}

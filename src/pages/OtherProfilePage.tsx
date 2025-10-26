import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
    const navigate = useNavigate();
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

    useEffect(() => {
        const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
        if (storedTheme) {
            setTheme(storedTheme);
            document.body.classList.remove('light-theme', 'dark-theme');
            document.body.classList.add(storedTheme === 'dark' ? 'dark-theme' : 'light-theme');
        }
    }, []);

    useEffect(() => {
        if (!userId) return;
        const fetchItems = async () => {
            const { data: completed, error: cError } = await supabase
                .from("completed_items")
                .select("*")
                .eq("user_id", userId)
                .order("createdAt", { ascending: false });
            if (!cError) setCompletedItems(completed || []);

            const { data: planned, error: pError } = await supabase
                .from("planned_items")
                .select("*")
                .eq("user_id", userId)
                .order("createdAt", { ascending: false });
            if (!pError) setPlannedItems(planned || []);
        };
        fetchItems();
    }, [userId]);

    useEffect(() => {
        if (!userId) return;
        const fetchProfile = async () => {
            const { data, error } = await supabase
                .from("profiles")
                .select("id, nickname")
                .eq("user_id", userId);
            if (!error && data && data.length > 0) setProfile({ id: data[0].id, nickname: data[0].nickname });
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

    const handleModeChange = (newMode: "completed" | "planned") => setMode(newMode);
    const onTypeChange = (type: string) => setSelectedType(type);
    const onPriorityChange = (priority: string) => setSelectedPriority(priority);

    const filteredItems = (mode === "completed" ? completedItems : plannedItems).filter(
        item =>
            item.title.toLowerCase().includes(query.toLowerCase()) &&
            (selectedType === "Все типы" || item.type === selectedType) &&
            (selectedPriority === "Все приоритеты" || item.priority === selectedPriority)
    );

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

    return (
        <div className="app-container">
            <button
                className="top-bar-other-profile-button"
                onClick={() => navigate("/")}
            >
                На главную
            </button>

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

            <h1 className="section-title">{mode === "completed" ? "Готовые исследования" : "Запланированное"}</h1>
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
            />
        </div>
    );
}

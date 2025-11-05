import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import "../style/ProfileDetailsPage.css";
import "../style/MyFollowsPage.css";
import BurgerMenu from "../components/BurgerMenu";

export default function MyFollowsPage() {
    const navigate = useNavigate();
    const [subscriptions, setSubscriptions] = useState<
        { followed_id: string; nickname: string; key: string }[]
    >([]);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [burgerOpen, setBurgerOpen] = useState(false);
    const [searchResults, setSearchResults] = useState<
        { user_id: string; nickname: string }[]
    >([]);
    const [searchLoading, setSearchLoading] = useState(false);

    useEffect(() => {
        const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
        if (storedTheme) {
            document.body.classList.remove('light-theme', 'dark-theme');
            document.body.classList.add(`${storedTheme}-theme`);
        }
    }, []);

    useEffect(() => {
        const fetchCurrentUserAndSubscriptions = async () => {
            const { data: { user }, error } = await supabase.auth.getUser();
            if (!user || error) return;

            setCurrentUserId(user.id);

            const { data: subsData, error: subsError } = await supabase
                .from("follows")
                .select("following_id")
                .eq("follower_id", user.id);

            if (subsError || !subsData) return;

            const uniqueIds = Array.from(new Set(subsData.map(sub => sub.following_id)));
            if (uniqueIds.length === 0) {
                setSubscriptions([]);
                return;
            }

            const { data: profilesData, error: profilesError } = await supabase
                .from("profiles")
                .select("user_id, nickname")
                .in("user_id", uniqueIds);

            if (profilesError || !profilesData) return;

            if (currentUserId) {
                console.error()
            }

            const mappedSubs = profilesData.map(p => ({
                followed_id: p.user_id,
                nickname: p.nickname || "Без имени",
                key: p.user_id
            }));

            const uniqueSubs = Array.from(new Map(mappedSubs.map(s => [s.followed_id, s])).values());
            setSubscriptions(uniqueSubs);
        };

        fetchCurrentUserAndSubscriptions();
    }, []);

    const handleSearch = async (query: string) => {
        setSearchQuery(query);

        if (query.trim().length === 0) {
            setSearchResults([]);
            return;
        }

        setSearchLoading(true);

        const { data, error } = await supabase
            .from("profiles")
            .select("user_id, nickname")
            .ilike("nickname", `%${query}%`)
            .eq("is_public", true)
            .limit(20);

        if (error) {
            console.error(error);
            setSearchResults([]);
        } else {
            const uniqueResults = Array.from(new Map((data || []).map(p => [p.user_id, p])).values());
            setSearchResults(uniqueResults);
        }

        setSearchLoading(false);
    };


    return (
        <div className="profile-container">
            <div className="top-bar">
                <BurgerMenu
                    isOpen={burgerOpen}
                    onToggle={() => setBurgerOpen((prev) => !prev)}
                    onClose={() => setBurgerOpen(false)}
                    customPages={[
                        { path: "/", label: "На главную" },
                        { path: "/profile", label: "Профиль" },
                        { path: "/projects", label: "Проекты" },
                        { path: "/discovery", label: "Открытия" },
                        { path: "/archive-items", label: "Архив" },
                        { path: "/about", label: "О проекте" },
                    ]}
                />
            </div>

            <div className="profile-main">
                <div className="search-section">
                    <h2 className="subscriptions-title">Поиск публичных профилей</h2>
                    <input
                        type="text"
                        placeholder="Введите никнейм..."
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="search-input"
                    />

                    {searchQuery.trim().length > 0 && (
                        <div className="search-results">
                            {searchLoading && <div className="search-download-text">Загрузка...</div>}
                            {!searchLoading && searchResults.length === 0 && <div className="search-download-text">Ничего не найдено</div>}
                            {!searchLoading && searchResults.map(profile => (
                                <button
                                    key={profile.user_id}
                                    className="search-result-item"
                                    onClick={() => navigate(`/profile/${profile.user_id}`)}
                                >
                                    {profile.nickname}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="subscriptions-card">
                    <h2 className="subscriptions-title">Подписки</h2>
                    <ul className="subscriptions-list">
                        {subscriptions.length === 0 && <li>Нет подписок</li>}
                        {subscriptions.map(sub => (
                            <li key={sub.key}>
                                <button
                                    className="subscription-link"
                                    onClick={() => navigate(`/profile/${sub.followed_id}`)}
                                >
                                    {sub.nickname}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

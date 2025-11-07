import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "../style/DiscoveryPage.css";
import BurgerMenu from "../components/BurgerMenu";
import AuthForm from "../components/AuthForm";
import DiscoveryModal from "../components/DiscoveryModal";
import SearchBar from "../components/SearchBar";

export default function DiscoveryPage() {
    const [user, setUser] = useState<any>(null);
    const [discoveries, setDiscoveries] = useState<any[]>([]);
    const [newDiscovery, setNewDiscovery] = useState("");
    const [loading, setLoading] = useState(true);
    const [burgerOpen, setBurgerOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 10;
    const [selectedDiscovery, setSelectedDiscovery] = useState<any | null>(null);
    const [loadingMore, setLoadingMore] = useState(false);
    const [query, setQuery] = useState('');

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
        });
    }, []);

    useEffect(() => {
        if (user) fetchDiscoveries(1, true, query);
    }, [query]);

    useEffect(() => {
        if (!user) return;
        fetchDiscoveries(1, true);

        const channel = supabase
            .channel("realtime:discoveries")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "discoveries", filter: `user_id=eq.${user.id}` },
                () => fetchDiscoveries(1, true)
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user]);

    const fetchDiscoveries = async (pageToFetch: number, replace = false, search = '') => {
        if (replace) setLoading(true);
        else setLoadingMore(true);

        const from = (pageToFetch - 1) * itemsPerPage;
        const to = from + itemsPerPage - 1;

        let queryBuilder = supabase
            .from("discoveries")
            .select("*", { count: "exact" })
            .eq("user_id", user.id);

        if (search.trim()) {
            queryBuilder = queryBuilder.ilike("title", `%${search.trim()}%`);
        }

        const { data, error, count } = await queryBuilder
            .order("created_at", { ascending: false })
            .range(from, to);

        if (!error && data) {
            setDiscoveries((prev) => (replace ? data : [...prev, ...data]));
            setTotalPages(Math.ceil((count || 0) / itemsPerPage));
        }

        setLoading(false);
        setLoadingMore(false);
    };

    const addDiscovery = async () => {
        const title = newDiscovery.trim();
        if (!title || !user) return;

        const { data, error } = await supabase
            .from("discoveries")
            .insert([{ title, user_id: user.id }])
            .select();

        if (!error && data && data.length > 0) {
            setDiscoveries((prev) => [data[0], ...prev]);
            setNewDiscovery("");
        }
    };

    const deleteDiscovery = async (id: string) => {
        if (!user) return;

        const { error } = await supabase
            .from("discoveries")
            .delete()
            .eq("id", id)
            .eq("user_id", user.id);

        if (!error) {
            setDiscoveries((prev) => prev.filter((item) => item.id !== id));
        }
    };

    const handleOpenModal = (discovery: any) => {
        setSelectedDiscovery(discovery);
    };

    const handleCloseModal = () => {
        setSelectedDiscovery(null);
    };

    const handleSave = async (id: string, data: { title: string; description: string }) => {
        if (!user) return;

        const { error, data: updatedData } = await supabase
            .from("discoveries")
            .update({ title: data.title, description: data.description })
            .eq("id", id)
            .eq("user_id", user.id)
            .select();

        if (!error && updatedData && updatedData.length > 0) {
            setDiscoveries((prev) =>
                prev.map((item) => (item.id === id ? updatedData[0] : item))
            );
            setSelectedDiscovery(updatedData[0]);
        }
    };

    if (!user) return <AuthForm onLogin={() => fetchDiscoveries(1, true)} />;

    const handleLoadMore = () => {
        if (page < totalPages) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchDiscoveries(nextPage, false);
        }
    };

    return (
        <div className="discoveries-page">
            <div className="top-bar">
                <BurgerMenu
                    isOpen={burgerOpen}
                    onToggle={() => setBurgerOpen((prev) => !prev)}
                    onClose={() => setBurgerOpen(false)}
                    customPages={[
                        { path: "/", label: "На главную" },
                        { path: "/profile", label: "Профиль" },
                        { path: "/follows", label: "Подписки" },
                        { path: "/projects", label: "Проекты" },
                        { path: "/archive-items", label: "Архив" },
                        { path: "/about-projects", label: "О проекте" },
                    ]}
                />
            </div>

            <div className="discoveries-container">
                <h1 className="discoveries-title">Мои открытия</h1>
                <h2 className="discoveries-subtitle">Понравившиеся вселенные, идеи и события</h2>

                <div className="discoveries-input-row">
                    <input
                        type="text"
                        className="discoveries-input-inline"
                        placeholder="Добавить открытие..."
                        value={newDiscovery}
                        onChange={(e) => setNewDiscovery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addDiscovery()}
                    />
                    <button className="discoveries-add-icon" onClick={addDiscovery}>
                        ＋
                    </button>
                </div>

                <SearchBar query={query} onSearch={setQuery} />

                {loading ? (
                    <div className="discoveries-loader">
                        <div className="spinner"></div>
                        <p>Загружаем открытия...</p>
                    </div>
                ) : discoveries.length === 0 ? (
                    <p className="discoveries-empty">Пока нет открытий</p>
                ) : (
                    <>
                        <ul className="discoveries-list fade-in">
                            {discoveries.map((item) => (
                                <li
                                    key={item.id}
                                    className="discoveries-item"
                                    onClick={() => handleOpenModal(item)}
                                >
                                    <span className="discoveries-item-title">{item.title}</span>
                                    <button
                                        className="discoveries-delete-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteDiscovery(item.id);
                                        }}
                                        title="Удалить"
                                    >
                                        ✕
                                    </button>
                                </li>
                            ))}
                        </ul>

                        {page < totalPages && (
                            <div className="discoveries-load-more-container">
                                <button
                                    className="discoveries-load-more-btn"
                                    onClick={handleLoadMore}
                                    disabled={loadingMore}
                                >
                                    {loadingMore ? "Загрузка..." : "Показать ещё"}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {selectedDiscovery && (
                <DiscoveryModal
                    isOpen={!!selectedDiscovery}
                    title={selectedDiscovery.title}
                    description={selectedDiscovery.description || ""}
                    onClose={handleCloseModal}
                    onSave={(data) => handleSave(selectedDiscovery.id, data)}
                />
            )}
        </div>
    );
}

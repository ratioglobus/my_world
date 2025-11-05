import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "../style/DiscoveryPage.css";
import BurgerMenu from "../components/BurgerMenu";
import AuthForm from "../components/AuthForm";

export default function DiscoveryPage() {
    const [user, setUser] = useState<any>(null);
    const [discoveries, setDiscoveries] = useState<any[]>([]);
    const [newDiscovery, setNewDiscovery] = useState("");
    const [loading, setLoading] = useState(true);
    const [burgerOpen, setBurgerOpen] = useState(false);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
        });
    }, []);

    useEffect(() => {
        if (!user) return;
        fetchDiscoveries();

        const channel = supabase
            .channel("realtime:discoveries")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "discoveries", filter: `user_id=eq.${user.id}` },
                () => fetchDiscoveries()
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user]);

    const fetchDiscoveries = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("discoveries")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

        if (!error) setDiscoveries(data || []);
        setLoading(false);
    };

    const addDiscovery = async () => {
        const title = newDiscovery.trim();
        if (!title || !user) return;

        const { data, error } = await supabase
            .from("discoveries")
            .insert([
                {
                    title,
                    user_id: user.id,
                },
            ])
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

    if (!user) return <AuthForm onLogin={() => fetchDiscoveries()} />;

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
                <h2 className="discoveries-subtitle">Понравившиеся вселенные, идеи и события </h2>

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

                {loading ? (
                    <p className="discoveries-loading">Загрузка...</p>
                ) : discoveries.length === 0 ? (
                    <p className="discoveries-empty">Пока нет открытий</p>
                ) : (
                    <ul className="discoveries-list">
                        {discoveries.map((item) => (
                            <li key={item.id} className="discoveries-item">
                                <span className="discoveries-item-title">{item.title}</span>
                                <button
                                    className="discoveries-delete-btn"
                                    onClick={() => deleteDiscovery(item.id)}
                                    title="Удалить"
                                >
                                    ✕
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

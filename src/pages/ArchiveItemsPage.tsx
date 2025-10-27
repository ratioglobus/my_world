import { useEffect, useState } from "react";
import "../style/ArchiveItemsPage.css";
import { supabase } from "../supabaseClient";
import type { MediaItemProps } from "../types/MediaItem";
import ItemList from "../components/ItemList";
import AuthForm from "../components/AuthForm";
import { useNavigate } from "react-router-dom";

export default function ArchiveItemsPage() {
    const [user, setUser] = useState<any>(null);
    const [archivedCompleted, setArchivedCompleted] = useState<MediaItemProps[]>([]);
    const [archivedPlanned, setArchivedPlanned] = useState<MediaItemProps[]>([]);
    const [theme] = useState<"light" | "dark">(
        () => (localStorage.getItem("theme") as "light" | "dark") || "light"
    );
    const navigate = useNavigate();

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
        });
    }, []);

    useEffect(() => {
        if (theme === "dark") {
            document.body.classList.add("dark-theme");
            document.body.classList.remove("light-theme");
        } else {
            document.body.classList.remove("dark-theme");
            document.body.classList.add("light-theme");
        }
    }, [theme]);

    const fetchArchivedItems = async () => {
        if (!user) return;

        const { data: completed } = await supabase
            .from("completed_items")
            .select("*")
            .eq("user_id", user.id)
            .eq("is_archived", true)

        const { data: planned } = await supabase
            .from("planned_items")
            .select("*")
            .eq("user_id", user.id)
            .eq("is_archived", true)

        setArchivedCompleted(completed || []);
        setArchivedPlanned(planned || []);
    };

    useEffect(() => {
        fetchArchivedItems();
    }, [user]);

    if (!user) return <AuthForm onLogin={() => fetchArchivedItems()} />;

    return (

        <div className="archive-main">
            <button className="back-button" onClick={() => navigate("/")}>
                ← На главную
            </button>
            <div className="archive">
                <h1 className="archive-title">Архив карточек</h1>

                <section className="archive-section">
                    <h2 className="archive-subtitle">Готовые</h2>
                    {archivedCompleted.length > 0 ? (
                        <ItemList
                            items={archivedCompleted}
                            mode="completed"
                            theme={theme}
                            isArchiveView={true}
                            onDelete={() => { }}
                            onEdit={() => { }}
                            onUpdate={() => { }}
                            editingItemId={null}
                            viewItemId={null}
                            onView={() => { }}
                            setEditingItemId={() => { }}
                        />
                    ) : (
                        <p className="archive-empty">Нет архивированных готовых карточек</p>
                    )}
                </section>

                <section className="archive-section">
                    <h2 className="archive-subtitle">Планируемые</h2>
                    {archivedPlanned.length > 0 ? (
                        <ItemList
                            items={archivedPlanned}
                            mode="planned"
                            theme={theme}
                            editingItemId={null}
                            viewItemId={null}
                            onDelete={() => { }}
                            onEdit={() => { }}
                            onUpdate={() => { }}
                            onView={() => { }}
                            setEditingItemId={() => { }}
                        />
                    ) : (
                        <p className="archive-empty">Нет архивированных планируемых карточек</p>
                    )}
                </section>
            </div>
        </div>
    );
}

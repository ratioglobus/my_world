import { useEffect, useState } from "react";
import "../style/ArchiveItemsPage.css";
import { supabase } from "../supabaseClient";
import type { MediaItemProps } from "../types/MediaItem";
import ItemList from "../components/ItemList";
import AuthForm from "../components/AuthForm";
import BurgerMenu from "../components/BurgerMenu";

export default function ArchiveItemsPage() {
    const [user, setUser] = useState<any>(null);
    const [archivedCompleted, setArchivedCompleted] = useState<MediaItemProps[]>([]);
    const [archivedPlanned, setArchivedPlanned] = useState<MediaItemProps[]>([]);
    const [burgerOpen, setBurgerOpen] = useState(false);
    const [theme] = useState<"light" | "dark">(
        () => (localStorage.getItem("theme") as "light" | "dark") || "light"
    );

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
            .eq("is_archived", true);

        const { data: planned } = await supabase
            .from("planned_items")
            .select("*")
            .eq("user_id", user.id)
            .eq("is_archived", true);

        setArchivedCompleted(completed || []);
        setArchivedPlanned(planned || []);
    };

    useEffect(() => {
        fetchArchivedItems();
    }, [user]);

    const handleRestore = async (id: string, mode: "completed" | "planned") => {
        if (!user) return;
        const table = mode === "completed" ? "completed_items" : "planned_items";

        const { error } = await supabase
            .from(table)
            .update({ is_archived: false })
            .eq("id", id)
            .eq("user_id", user.id);

        if (!error) fetchArchivedItems();
        else console.error(error);
    };

    const handleDelete = async (id: string, mode: "completed" | "planned") => {
        if (!user) return;
        const table = mode === "completed" ? "completed_items" : "planned_items";

        const { error } = await supabase
            .from(table)
            .delete()
            .eq("id", id)
            .eq("user_id", user.id);

        if (!error) fetchArchivedItems();
        else console.error(error);
    };

    if (!user) return <AuthForm onLogin={() => fetchArchivedItems()} />;

    return (
        <div className="archive-main">
            <div className="top-bar">
                <BurgerMenu
                    isOpen={burgerOpen}
                    onToggle={() => setBurgerOpen((prev) => !prev)}
                    onClose={() => setBurgerOpen(false)}
                    customPages={[
                        { path: "/", label: "На главную" },
                        { path: "/profile", label: "Профиль" },
                        { path: "/follows", label: "Подписки" },
                        { path: "/discovery", label: "Открытия" },
                        { path: "/projects", label: "Проекты" },
                        { path: "/about", label: "О проекте" },
                    ]}
                />
            </div>

            <div className="archive">
                <h1 className="archive-title">Архив исследований</h1>

                <section className="archive-section">
                    <h2 className="archive-subtitle">Готовые</h2>
                    {archivedCompleted.length > 0 ? (
                        <ItemList
                            items={archivedCompleted}
                            mode="completed"
                            theme={theme}
                            isArchiveView={true}
                            onDelete={(id) => handleDelete(id, "completed")}
                            onRestore={(id) => handleRestore(id, "completed")}
                            editingItemId={null}
                            viewItemId={null}
                            onEdit={() => { }}
                            onUpdate={() => { }}
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
                            isArchiveView={true}
                            onDelete={(id) => handleDelete(id, "planned")}
                            onRestore={(id) => handleRestore(id, "planned")}
                            editingItemId={null}
                            viewItemId={null}
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

import "../style/MyProfilePage.css";
import "../style/ProjectSteps.css";
import { useState, useEffect } from "react";
import type { MediaItemProps } from "../types/MediaItem";
import { supabase } from "../supabaseClient";
import ItemList from "../components/ItemList";
import AddItemForm from "../components/AddItemForm";
import SearchBar from "../components/SearchBar";
import ConfirmModal from "../components/ConfirmModal";
import AuthForm from "../components/AuthForm";
import FilterProjectsByStatus from "../components/FilterProjectsByStatus";
import FilterByPriority from "../components/FilterByPriority";
import BurgerMenu from "../components/BurgerMenu";

function ProjectsPage() {
    const [user, setUser] = useState<any>(null);
    const [projects, setProjects] = useState<MediaItemProps[]>([]);
    const [query, setQuery] = useState("");
    const [editingItemId, setEditingItemId] = useState<string | null>(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
    const [burgerOpen, setBurgerOpen] = useState(false);
    const [viewItemId, setViewItemId] = useState<string | null>(null);
    const [selectedStatus, setSelectedStatus] = useState("Все статусы");
    const [selectedPriority, setSelectedPriority] = useState("Все приоритеты");
    const [theme] = useState<"light" | "dark">(() => {
        try {
            const stored = localStorage.getItem("theme") as "light" | "dark" | null;
            if (stored === "light" || stored === "dark") return stored;
            if (window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
        } catch (e) {
            console.error(e);
        }
        return "light";
    });

    const handleView = (id: string) => setViewItemId(id);

    useEffect(() => {
        if (theme === "dark") {
            document.body.classList.add("dark-theme");
            document.body.classList.remove("light-theme");
        } else {
            document.body.classList.remove("dark-theme");
            document.body.classList.add("light-theme");
        }
        localStorage.setItem("theme", theme);
    }, [theme]);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
        });
        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });
        return () => listener.subscription.unsubscribe();
    }, []);

    const onStatusChange = (status: string) => setSelectedStatus(status);
    const onPriorityChange = (priority: string) => setSelectedPriority(priority);

    const fetchProjects = async () => {
        if (!user) return;

        const { data: projectsData, error: projectsError } = await supabase
            .from("projects")
            .select("*")
            .eq("user_id", user.id)
            .order("createdAt", { ascending: false });

        if (projectsError) {
            console.error(projectsError);
            return;
        }

        const { data: stepsData, error: stepsError } = await supabase
            .from("project_steps")
            .select("project_id, completed");

        if (stepsError) {
            console.error(stepsError);
        }

        const projectsWithProgress = projectsData.map(project => {
            const projectSteps = stepsData?.filter(s => s.project_id === project.id) || [];
            const completedSteps = projectSteps.filter(s => s.completed).length;
            const progress =
                projectSteps.length > 0
                    ? Math.round((completedSteps / projectSteps.length) * 100)
                    : 0;

            return { ...project, progress };
        });

        setProjects(projectsWithProgress);
    };

    const handleAdd = async (item: Omit<MediaItemProps, "id" | "user_id">) => {
        if (!user) return;
        const dbItem = { ...item, user_id: user.id, createdAt: new Date().toISOString() };
        const { data, error } = await supabase.from("projects").insert([dbItem]).select();
        if (error) console.error(error);
        else setProjects(prev => [data[0], ...prev]);
    };

    useEffect(() => {
        fetchProjects();
    }, [user]);

    const handleUpdate = async (id: string, updatedItem: MediaItemProps) => {
        if (!user) return;
        const { data, error } = await supabase
            .from("projects")
            .update(updatedItem)
            .eq("id", id)
            .eq("user_id", user.id)
            .select();
        if (error) console.error(error);
        else setProjects(prev => prev.map(i => (i.id === id ? data[0] : i)));
        setEditingItemId(null);
    };

    const handleDelete = async (id: string) => {
        if (!user) return;
        const { error } = await supabase.from("projects").delete().eq("id", id).eq("user_id", user.id);
        if (error) console.error(error);
        else setProjects(prev => prev.filter(i => i.id !== id));
        setConfirmDeleteId(null);
    };

    const filteredProjects = projects.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) &&
        (selectedStatus === "Все статусы" || item.status === selectedStatus) &&
        (selectedPriority === "Все приоритеты" || item.priority === selectedPriority)
    );

    if (!user) return <AuthForm onLogin={fetchProjects} />;

    return (
        <div className="app-container">
            <div className="top-bar">
                <BurgerMenu
                    isOpen={burgerOpen}
                    onToggle={() => setBurgerOpen((prev) => !prev)}
                    onClose={() => setBurgerOpen(false)}
                    customPages={[
                        { path: "/", label: "На главную" },
                        { path: "/profile", label: "Профиль" },
                        { path: "/discovery", label: "Открытия" },
                        { path: "/follows", label: "Подписки" },
                        { path: "/archive-items", label: "Архив" },
                        { path: "/about", label: "О проекте" },
                    ]}
                />
            </div>

            <h1 className="section-title">Добавить долгосрочный проект</h1>
            <AddItemForm onAdd={handleAdd} mode="projects" />
            <SearchBar query={query} onSearch={setQuery} />

            <div className="section-filtered">
                <div className="filters-row">
                    <FilterProjectsByStatus selectedStatus={selectedStatus} onStatusChange={onStatusChange} />
                    <FilterByPriority selectedPriority={selectedPriority} onPriorityChange={onPriorityChange} />
                </div>
            </div>

            <ItemList
                items={filteredProjects}
                editingItemId={editingItemId}
                onEdit={setEditingItemId}
                onUpdate={handleUpdate}
                onDelete={setConfirmDeleteId}
                setEditingItemId={setEditingItemId}
                mode="projects"
                theme={theme}
                onView={handleView}
                viewItemId={viewItemId}
                user={user}
                onProgressUpdate={fetchProjects}
            />

            {confirmDeleteId && (
                <ConfirmModal
                    message="Вы уверены, что хотите удалить проект?"
                    onConfirm={() => handleDelete(confirmDeleteId)}
                    onCancel={() => setConfirmDeleteId(null)}
                />
            )}
        </div>
    );
}

export default ProjectsPage;

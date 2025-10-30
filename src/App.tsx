import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { supabase } from "./supabaseClient";
import type { Session } from "@supabase/supabase-js";
import MyProfilePage from "./pages/MyProfilePage";
import ProfileDetailsPage from "./pages/ProfileDetailsPage";
import OtherProfilePage from "./pages/OtherProfilePage";
import MyFollowsPage from "./pages/MyFollowsPage";
import AboutProjectPage from "./pages/AboutProjectPage";
import ArchiveItemsPage from "./pages/ArchiveItemsPage";
import ProjectsPage from "./pages/ProjectsPage";
import AuthForm from "./components/AuthForm";

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const theme =
      storedTheme ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

    document.body.classList.remove('dark-theme', 'light-theme');
    document.body.classList.add(`${theme}-theme`);
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (!error) setSession(data.session);
      setLoading(false);
    };

    initAuth();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="global-loader fade-in">
        <div className="spinner"></div>
        <p>Загрузка...</p>
      </div>
    );
  }

  return (
    <div className="app-content fade-in">
      {!session ? (
        <AuthForm
          onLogin={async () => {
            const { data } = await supabase.auth.getSession();
            setSession(data.session);
          }}
        />
      ) : (
        <Routes>
          <Route path="/" element={<MyProfilePage />} />
          <Route path="/profile" element={<ProfileDetailsPage />} />
          <Route path="/profile/:id" element={<OtherProfilePage />} />
          <Route path="/follows" element={<MyFollowsPage />} />
          <Route path="/about" element={<AboutProjectPage />} />
          <Route path="/archive-items" element={<ArchiveItemsPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
        </Routes>
      )}
    </div>
  );
}

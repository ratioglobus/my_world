import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { supabase } from "./supabaseClient";
import type { Session } from "@supabase/supabase-js";

import MyProfilePage from "./pages/MyProfilePage";
import ProfileDetailsPage from "./pages/ProfileDetailsPage";
import OtherProfilePage from "./pages/OtherProfilePage";
import MyFollowsPage from "./pages/MyFollowsPage";
import AuthForm from "./components/AuthForm";

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

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

  if (!session) {
    return <AuthForm onLogin={async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    }} />;
  }

  return (
    <Routes>
      <Route path="/" element={<MyProfilePage />} />
      <Route path="/profile" element={<ProfileDetailsPage />} />
      <Route path="/profile/:id" element={<OtherProfilePage />} />
      <Route path="/follows/" element={<MyFollowsPage />} />
    </Routes>
  );
}

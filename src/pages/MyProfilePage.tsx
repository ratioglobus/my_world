import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import "../style/MyProfilePage.css";

export default function MyProfilePage() {
  const [profile, setProfile] = useState<{ nickname: string; email: string } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (storedTheme) {
      document.body.classList.remove('light-theme', 'dark-theme');
      document.body.classList.add(`${storedTheme}-theme`);
    }
  }, []);

  useEffect(() => {
    const fetchOrCreateProfile = async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session?.user) return;

      const userId = session.user.id;

      const { data, error } = await supabase
        .from("profiles")
        .select("id, nickname, email")
        .eq("user_id", userId);

      if (error && error.code !== "PGRST116") {
        console.error(error);
        return;
      }

      let profileData = data?.[0];

      if (!profileData) {
        const newProfile = {
          user_id: userId,
          email: session.user.email,
          nickname: session.user.email?.split("@")[0] || "Новый пользователь",
        };

        const { data: inserted, error: insertError } = await supabase
          .from("profiles")
          .insert([newProfile])
          .select();

        if (insertError) {
          console.error(insertError);
          return;
        }

        profileData = inserted?.[0];
      }

      setProfile(profileData ? { nickname: profileData.nickname, email: profileData.email } : null);
    };

    fetchOrCreateProfile();
  }, []);

  if (!profile) return <div className="profile-page loading">Загрузка...</div>;

  return (
    <div className="profile-container">
      <button className="back-button" onClick={() => navigate("/")}>
        ← На главную
      </button>
      <div className="profile-card">

        <h1 className="profile-title">Мой профиль</h1>
        <p className="profile-field"><strong>Никнейм:</strong> {profile.nickname}</p>
        <p className="profile-field"><strong>Email:</strong> {profile.email}</p>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import "../style/ProfileDetailsPage.css";

export default function ProfileDetailsPage() {
  const [profile, setProfile] = useState<{ nickname: string; email: string } | null>(null);
  const [isPublic, setIsPublic] = useState(false);
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState<
    { followed_id: string; nickname: string; key: string }[]
  >([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);


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
        .select("id, nickname, email, is_public")
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
      setIsPublic(!!profileData?.is_public);
    };

    fetchOrCreateProfile();
  }, []);

  useEffect(() => {
    const fetchCurrentUserAndSubscriptions = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (!user || error) return;

      if (!currentUserId) {
        console.log("Текущий пользователь не найден:");
      }

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

  if (!profile) return <div className="profile-page loading">Загрузка...</div>;

  const handleTogglePublic = async () => {
    if (!profile) return;
    const newValue = !isPublic;
    setIsPublic(newValue);

    const { error } = await supabase
      .from("profiles")
      .update({ is_public: newValue })
      .eq("email", profile.email);

    if (error) {
      console.error("Ошибка при обновлении is_public:", error);
    }
  };

  return (
    <div className="profile-container">
      <button className="back-button" onClick={() => navigate("/")}>
        ← На главную
      </button>

      <div className="profile-main">
        <div className="profile-card">
          <h1 className="profile-title">Мой профиль</h1>

          <p className="profile-field">
            <strong>Никнейм:</strong> {profile.nickname}
          </p>

          <p className="profile-field">
            <strong>Email:</strong> {profile.email}
          </p>

          <div className="public-toggle">
            <span className="toggle-label">Публичный профиль</span>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={handleTogglePublic}
              />
              <span className="slider"></span>
            </label>
          </div>

          <p className="public-hint">
            Если профиль публичный — другие пользователи смогут просматривать вашу карточку.
            В частном режиме профиль виден только вам.
          </p>

          <button
            className="share-profile-btn"
            onClick={async () => {
              const { data: { session } } = await supabase.auth.getSession();
              if (!session?.user) return;

              const url = `${window.location.origin}/profile/${session.user.id}`;
              navigator.clipboard.writeText(url);
              alert("Ссылка скопирована!");
            }}
          >
            Поделиться профилем
          </button>
        </div>

        <div className="subscriptions-card">
          <h2 className="subscriptions-title">Мои подписки</h2>
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

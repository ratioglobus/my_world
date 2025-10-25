import { useEffect, useRef, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import "../style/ProfileDetailsPage.css";

export default function ProfileDetailsPage() {
  const [profile, setProfile] = useState<{ nickname: string; email: string } | null>(null);
  const [isPublic, setIsPublic] = useState(false);
  const navigate = useNavigate();
  const [showCopiedToast, setShowCopiedToast] = useState(false);
  const [editingNickname, setEditingNickname] = useState(false);
  const [nicknameDraft, setNicknameDraft] = useState<string>("");
  const [savingNickname, setSavingNickname] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const nicknameInputRef = useRef<HTMLInputElement | null>(null);

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
      setUserId(userId);

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
    if (editingNickname && nicknameInputRef.current) {
      nicknameInputRef.current.focus();
      const len = nicknameInputRef.current.value.length;
      nicknameInputRef.current.setSelectionRange(len, len);
    }
  }, [editingNickname]);

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

  const handleSaveNickname = async () => {
    if (!userId || !profile) return;
    const newNick = nicknameDraft.trim();
    if (newNick.length === 0) return;

    if (newNick === profile.nickname) {
      setEditingNickname(false);
      return;
    }

    const prevNick = profile.nickname;
    setProfile({ nickname: newNick, email: profile.email });
    setSavingNickname(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({ nickname: newNick })
        .eq("user_id", userId);

      if (error) {
        setProfile({ nickname: prevNick, email: profile.email });
        console.error("Ошибка при обновлении ника:", error);
        return;
      }

      setEditingNickname(false);
    } finally {
      setSavingNickname(false);
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

          <p className="profile-field nickname-row">
            <strong>Никнейм:</strong>

            {!editingNickname ? (
              <span className="nickname-view">
                {profile.nickname}
                <button
                  className="icon-btn edit-nick-btn"
                  aria-label="Редактировать никнейм"
                  onClick={() => {
                    setNicknameDraft(profile.nickname);
                    setEditingNickname(true);
                  }}
                >
                  <img src="./edit-icon.png" alt="edit profile button"/>
                </button>
              </span>
            ) : (
              <span className="nickname-edit-wrapper">
                <input
                  ref={(el) => { nicknameInputRef.current = el; }}
                  className="nickname-input"
                  value={nicknameDraft}
                  onChange={(e) => setNicknameDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveNickname();
                    if (e.key === "Escape") {
                      setEditingNickname(false);
                      setNicknameDraft(profile.nickname);
                    }
                  }}
                  aria-label="Новый никнейм"
                />
                <button
                  className="icon-btn save-nick-btn"
                  onClick={handleSaveNickname}
                  aria-label="Сохранить никнейм"
                  disabled={savingNickname || nicknameDraft.trim().length === 0}
                >
                  {savingNickname ? "..." : "✅"}
                </button>
              </span>
            )}
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
              await navigator.clipboard.writeText(url);

              setShowCopiedToast(true);
              setTimeout(() => setShowCopiedToast(false), 2500);
            }}
          >
            Скопировать ссылку на профиль
          </button>
        </div>

        {showCopiedToast && (
          <div className="toast">
            <span>Ссылка скопирована ✨</span>
          </div>
        )}
      </div>
    </div>
  );

}

import { useEffect, useRef, useState } from "react";
import { supabase } from "../supabaseClient";
import { Link } from "react-router-dom";
import "../style/ProfileDetailsPage.css";

type Profile = {
  user_id: string;
  nickname: string;
  email: string;
  is_public: boolean;
};

export default function ProfileDetailsPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isPublic, setIsPublic] = useState(false);
  const [editingNickname, setEditingNickname] = useState(false);
  const [nicknameDraft, setNicknameDraft] = useState("");
  const [savingNickname, setSavingNickname] = useState(false);
  const [showCopiedToast, setShowCopiedToast] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [burgerOpen, setBurgerOpen] = useState(false);

  const nicknameInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (storedTheme) {
      document.body.classList.remove("light-theme", "dark-theme");
      document.body.classList.add(`${storedTheme}-theme`);
    }
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;
      const userId = session.user.id;
      setUserId(userId);

      const { data, error } = await supabase
        .from("profiles")
        .select("user_id, nickname, email, is_public")
        .eq("user_id", userId)
        .limit(1);

      if (error) {
        console.error(error);
        return;
      }

      let profileData: Profile | null = data?.[0] ?? null;

      if (!profileData) {
        const newProfile = {
          user_id: userId,
          nickname: session.user.email?.split("@")[0] || "Новый пользователь",
          email: session.user.email || "",
          is_public: false,
        };

        const { data: inserted, error: insertError } = await supabase
          .from("profiles")
          .insert([newProfile])
          .select()
          .single();

        if (insertError) {
          console.error(insertError);
          return;
        }

        profileData = inserted;
      }

      if (!profileData) return;

      setProfile(profileData);
      setIsPublic(!!profileData.is_public);
    };

    fetchProfile();
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
      .eq("user_id", profile.user_id);

    if (error) console.error("Ошибка при обновлении публичности:", error);
  };

  const handleSaveNickname = async () => {
    if (!userId || !profile) return;
    const newNick = nicknameDraft.trim();
    if (newNick.length === 0 || newNick === profile.nickname) {
      setEditingNickname(false);
      return;
    }

    const prevNick = profile.nickname;
    setProfile({ ...profile, nickname: newNick });
    setSavingNickname(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({ nickname: newNick })
        .eq("user_id", userId);

      if (error) {
        console.error("Ошибка при обновлении ника:", error);
        setProfile({ ...profile, nickname: prevNick });
      } else {
        setEditingNickname(false);
      }
    } finally {
      setSavingNickname(false);
    }
  };

  const handleCopyLink = async () => {
    const url = `${window.location.origin}/profile/${profile.user_id}`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(url);
      } catch {
        fallbackCopyTextToClipboard(url);
      }
    } else {
      fallbackCopyTextToClipboard(url);
    }

    setShowCopiedToast(true);
    setTimeout(() => setShowCopiedToast(false), 2500);
  };

  const fallbackCopyTextToClipboard = (text: string) => {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    try {
      document.execCommand("copy");
    } catch (err) {
      console.error("Fallback: Не удалось скопировать", err);
    }
    document.body.removeChild(textarea);
  };

  return (
    <div className="profile-container">
      <div className="top-bar">
        <div className={`burger-wrapper ${burgerOpen ? "open" : ""}`}>
          <button
            className="burger-btn mobile-only"
            onClick={() => setBurgerOpen(prev => !prev)}
          >
            ☰
          </button>

          <div className="burger-menu">
            <Link className="top-bar-profile-button" to="/">
              На главную
            </Link>
            <Link className="top-bar-profile-button" to="/profile">
              Профиль
            </Link>
            <Link className="top-bar-profile-button" to="/projects">
              Проекты
            </Link>
            <Link className="top-bar-profile-button" to="/archive-items">
              Архив
            </Link>
            <Link className="top-bar-profile-button" to="/about">
              О проекте
            </Link>
            <button
              className="signout-btn"
              onClick={() => supabase.auth.signOut()}
            >
              Выйти
            </button>
          </div>
        </div>
      </div>

      <div className="profile-main">
        <div className="profile-card">
          <h1 className="profile-title">Профиль</h1>

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
                  <img src="./edit-icon.png" alt="edit profile button" />
                </button>
              </span>
            ) : (
              <span className="nickname-edit-wrapper">
                <input
                  ref={nicknameInputRef}
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
              <input type="checkbox" checked={isPublic} onChange={handleTogglePublic} />
              <span className="slider"></span>
            </label>
          </div>

          <p className="public-hint">
            Если профиль публичный — другие пользователи смогут просматривать вашу карточку.
            В частном режиме профиль виден только вам.
          </p>

          <button className="share-profile-btn" onClick={handleCopyLink}>
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

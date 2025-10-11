import { useState } from "react";
import { supabase } from "../supabaseClient";
import "../style/AuthForm.css";

export default function AuthForm({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let error;
    if (isLogin) {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      error = signInError;
    } else {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });
      error = signUpError;
    }
    if (error) alert(error.message);
    else onLogin();
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2 className="auth-title">{isLogin ? "Вход" : "Регистрация"}</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="auth-input"
        />

        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="auth-input"
        />

        <button type="submit" className="auth-button">
          {isLogin ? "Войти" : "Зарегистрироваться"}
        </button>

        <button
          type="button"
          onClick={() => setIsLogin(!isLogin)}
          className="auth-switch"
        >
          {isLogin ? "Перейти к регистрации" : "Перейти к входу"}
        </button>
      </form>
    </div>
  );
}

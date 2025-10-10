import { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function AuthForm({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let error;
    if (isLogin) {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      error = signInError;
    } else {
      const { error: signUpError } = await supabase.auth.signUp({ email, password });
      error = signUpError;
    }
    if (error) alert(error.message);
    else onLogin();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
      <button type="submit">{isLogin ? 'Войти' : 'Зарегистрироваться'}</button>
      <button type="button" onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? 'Перейти к регистрации' : 'Перейти к входу'}
      </button>
    </form>
  );
}

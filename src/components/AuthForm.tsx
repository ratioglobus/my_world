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
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            }}
        >
            <form
                onSubmit={handleSubmit}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: 'white',
                    padding: '40px',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                    minWidth: '320px',
                    width: '100%',
                    maxWidth: '400px',
                }}
            >
                <h2 style={{ textAlign: 'center', marginBottom: '24px', color: '#333' }}>
                    {isLogin ? 'Вход' : 'Регистрация'}
                </h2>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    style={{
                        padding: '12px',
                        marginBottom: '16px',
                        borderRadius: '8px',
                        border: '1px solid #ccc',
                        outline: 'none',
                        fontSize: '16px',
                        color: '#000',
                        backgroundColor: "#fff"
                    }}
                />
                <input
                    type="password"
                    placeholder="Пароль"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    style={{
                        padding: '12px',
                        marginBottom: '24px',
                        borderRadius: '8px',
                        border: '1px solid #ccc',
                        outline: 'none',
                        fontSize: '16px',
                        color: '#000',
                        backgroundColor: "#fff"
                    }}
                />

                <button
                    type="submit"
                    style={{
                        padding: '12px',
                        backgroundColor: '#667eea',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '16px',
                        cursor: 'pointer',
                        marginBottom: '12px',
                        transition: 'background-color 0.3s',
                    }}
                    onMouseOver={e => (e.currentTarget.style.backgroundColor = '#5a67d8')}
                    onMouseOut={e => (e.currentTarget.style.backgroundColor = '#667eea')}
                >
                    {isLogin ? 'Войти' : 'Зарегистрироваться'}
                </button>
                <button
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#667eea',
                        cursor: 'pointer',
                        fontSize: '14px',
                    }}
                >
                    {isLogin ? 'Перейти к регистрации' : 'Перейти к входу'}
                </button>
            </form>
        </div>
    );
}

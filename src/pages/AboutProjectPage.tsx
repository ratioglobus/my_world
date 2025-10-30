import { Link } from "react-router-dom";
import "../style/AboutProjectPage.css";
import { useState } from "react";
import { supabase } from "../supabaseClient";

export default function AboutProjectPage() {
    const [burgerOpen, setBurgerOpen] = useState(false);

    return (
        <div className="about">
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
                        <Link className="top-bar-profile-button" to="/follows">
                            Подписки
                        </Link>
                        <Link className="top-bar-profile-button" to="/projects">
                            Проекты
                        </Link>
                        <Link className="top-bar-profile-button" to="/archive-items">
                            Архив
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
            <div className="about-container">

                <h1 className="about-title">Researcher</h1>
                <p className="about-intro">
                    Проект создан для тех, кто любит исследовать, изучать и делиться своими открытиями.
                    Здесь можно вести личную базу знаний, отслеживать прогресс, планировать, оценивать и вдохновляться идеями других.
                </p>

                <div className="about-section">
                    <h2 className="about-section-title">Возможности проекта</h2>

                    <div className="about-grid">
                        <div className="about-card">
                            <span className="about-icon">🧑‍💻</span>
                            <h3>Создавать профиль</h3>
                            <p>Авторизуйся и начни вести свою собственную страницу с личными исследованиями</p>
                        </div>

                        <div className="about-card">
                            <span className="about-icon">🗂️</span>
                            <h3>Добавлять исследования</h3>
                            <p>Создавай карточки с идеями, книгами, фильмами, проектами или курсами, которые хочешь изучить</p>
                        </div>

                        <div className="about-card">
                            <span className="about-icon">✅</span>
                            <h3>Отмечать завершённые</h3>
                            <p>При нажатии на кнопку "Оценить" из раздела запланированных карточки автоматически переносятся в "Готовые"</p>
                        </div>

                        <div className="about-card">
                            <span className="about-icon">🔍</span>
                            <h3>Искать и фильтровать</h3>
                            <p>Быстро находи нужное с помощью поиска, фильтра по типу и приоритету</p>
                        </div>

                        <div className="about-card">
                            <span className="about-icon">📅</span>
                            <h3>Планировать</h3>
                            <p>Создавай список будущих идей и задач, сортируй их по приоритету и типу</p>
                        </div>

                        <div className="about-card">
                            <span className="about-icon">🤝</span>
                            <h3>Подписываться на других</h3>
                            <p>Следи за открытыми профилями других пользователей, смотри их исследования и вдохновляйся</p>
                        </div>
                    </div>
                </div>

                <div className="about-footer">
                    <p className="about-footer-small">Исследуй и делись открытиями с другими</p>
                    <p>Спасибо ❤️</p>
                </div>
            </div>
        </div>
    );
}

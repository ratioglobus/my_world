import { useNavigate } from "react-router-dom";
import "../style/AboutProjectPage.css";

export default function AboutProjectPage() {
    const navigate = useNavigate();

    return (
        <div className="about">
            <button className="back-button" onClick={() => navigate("/")}>
                ← На главную
            </button>
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

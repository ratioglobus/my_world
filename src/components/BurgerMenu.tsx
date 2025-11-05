import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "../supabaseClient";

interface PageLink {
    path: string;
    label: string;
}

interface BurgerMenuProps {
    isOpen: boolean;
    onToggle: () => void;
    onClose: () => void;
    customPages?: PageLink[];
}

export default function BurgerMenu({ isOpen, onToggle, onClose, customPages }: BurgerMenuProps) {
    const menuRef = useRef<HTMLDivElement>(null);
    const location = useLocation();

    const pages = customPages ?? [
        { path: "/profile", label: "Профиль" },
        { path: "/follows", label: "Подписки" },
        { path: "/projects", label: "Проекты" },
        { path: "/discovery", label: "Открытия" },
        { path: "/archive-items", label: "Архив" },
        { path: "/about", label: "О проекте" },
    ];

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                onClose();
            }
        };
        if (isOpen) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen, onClose]);

    return (
        <div className={`burger-wrapper ${isOpen ? "open" : ""}`} ref={menuRef}>
            <button className="burger-btn mobile-only" onClick={onToggle}>
                ☰
            </button>

            <div className="burger-menu">
                {pages
                    .filter((page) => page.path !== location.pathname)
                    .map((page) => (
                        <Link
                            key={page.path}
                            className="top-bar-profile-button"
                            to={page.path}
                            onClick={onClose}
                        >
                            {page.label}
                        </Link>
                    ))}
                <button className="signout-btn" onClick={() => supabase.auth.signOut()}>
                    Выйти
                </button>
            </div>
        </div>
    );
}

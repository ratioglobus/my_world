import { useEffect, useState } from "react";
import quotes from "./quotes.json";
import "./QuoteWidget.css";

interface QuoteData {
    content: string;
    author: string;
}

export const QuoteWidget = () => {
    const [quote, setQuote] = useState<QuoteData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        try {
            if (!Array.isArray(quotes) || quotes.length === 0) {
                throw new Error("Список цитат пуст");
            }

            const randomIndex = Math.floor(Math.random() * quotes.length);
            const randomQuote = quotes[randomIndex];

            setQuote(randomQuote);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    return (
        <div className="quote-widget">
            {loading && <p>Загрузка цитаты...</p>}
            {error && <p className="error">{error}</p>}
            {quote && !loading && !error && (
                <div className="quote-card">
                    <p className="quote-content">"{quote.content}"</p>
                    <p className="quote-author">— {quote.author}</p>
                </div>
            )}
        </div>
    );
};

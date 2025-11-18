import { useEffect, useState } from "react"

interface WeatherData {
    main: {
        temp: number;
    };
    weather: {
        description: string;
        icon: string;
    }[];
}

export default function WeatherWidget() {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>();

    useEffect(() => {
        fetch("https://api.openweathermap.org/data/2.5/weather?q=Moscow&units=metric&lang=ru&appid=f7f05149e6b148ce790c3036ba8fdc2f")
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Error occurred!')
                }
                return response.json()
            })
            .then(json => setWeather(json as WeatherData))
            .then(() => setLoading(false))
            .catch((err) => {
                setError(err.message)
                setLoading(false)
            })
    }, [])

    if (loading) {
        return (
            <div className="global-loader fade-in">
                <div className="spinner"></div>
                <p>Загрузка...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="">
                <div>Ошибка: {error}</div>
            </div>
        );
    }

    if (!weather) return null;

    const temp = Math.floor(weather.main.temp);
    const description = weather.weather[0].description;
    const iconCode = weather.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    return (
        weather &&
        <div className="container-weather">
            <div className="weather-widget">
                <h3 className="weather-title">Москва</h3>
                <div className="weather-main">
                    <img className="img-weather" src={iconUrl} alt={description} />
                    <div className="temp">{Math.round(temp)}°C</div>
                </div>
                <div className="weather-description">{description}</div>
            </div>
        </div>
    )
}

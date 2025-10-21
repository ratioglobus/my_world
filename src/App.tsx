import { Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import MyProfilePage from "./pages/MyProfilePage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/profile" element={<MyProfilePage />} />
    </Routes>
  );
}
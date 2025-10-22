import { Routes, Route } from "react-router-dom";
import MyProfilePage from "./pages/MyProfilePage";
import ProfileDetailsPage from "./pages/ProfileDetailsPage";
import OtherProfilePage from "./pages/OtherProfilePage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MyProfilePage />} />
      <Route path="/profile" element={<ProfileDetailsPage />} />
      <Route path="/profile/:id" element={<OtherProfilePage />} />
    </Routes>
  );
}
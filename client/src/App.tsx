import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import CreateQuiz from "./pages/CreateQuiz";
import QuizPage from "./pages/QuizPage";
import Settings from "./pages/Settings";
import EditQuiz from "./pages/EditQuiz";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create" element={<CreateQuiz />} />
        <Route path="/quiz/:id" element={<QuizPage />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/edit/:id" element={<EditQuiz />} />
      </Routes>
    </BrowserRouter>
  );
}
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <div className="sidebar">
      <div className="logo">
        QuizzOut
      </div>

      <button className="nav-btn" onClick={() => navigate("/dashboard")}>
        Dashboard
      </button>

      <button className="nav-btn" onClick={() => navigate("/create")}>
        Create Quiz
      </button>

      <button className="nav-btn" onClick={() => navigate("/settings")}>
        Settings
      </button>

      <button
        className="nav-btn"
        onClick={() => {
          localStorage.removeItem("token");
          window.location.href = "/";
        }}
      >
        Logout
      </button>
    </div>
  );
}
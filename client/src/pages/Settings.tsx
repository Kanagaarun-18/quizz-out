import { useState, useEffect } from "react";
import API from "../api";
import Navbar from "../components/Navbar";

export default function Settings() {
  const [username, setUsername] = useState("");
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      document.body.classList.add("dark");
      setDark(true);
    }
  }, []);

  const toggleTheme = () => {
    if (dark) {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setDark(!dark);
  };

  const update = async () => {
    await API.put("/user/update", { username });
    alert("Updated");
  };

  const deleteAcc = async () => {
    await API.delete("/user/delete");
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div className="layout">
      <Navbar />
      <div className="main">
        <div className="content">
      <h2>Settings</h2>

      <div className="card">
        <h3>Change Username</h3>
        <input placeholder="New username" onChange={e => setUsername(e.target.value)} />
        <button onClick={update}>Update</button>
      </div>

      <div className="card">
        <h3>Theme</h3>
        <button onClick={toggleTheme}>
        🌗 Switch to {dark ? "Light Mode" : "Dark Mode"}
        </button>
      </div>

      <div className="card">
        <h3>Danger Zone</h3>
        <button onClick={deleteAcc}>Delete Account</button>
      </div>
    </div>
    </div>
    </div>
  );
}
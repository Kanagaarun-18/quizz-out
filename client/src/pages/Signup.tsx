import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      await API.post("/auth/signup", { username, email, password });
      navigate("/");
    } catch {
      alert("Signup failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="title">Signup</h2>

        <input
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleSignup}>Create Account</button>

        <p className="link" onClick={() => navigate("/")}>
          Already have an account? Login
        </p>
      </div>
    </div>
  );
}
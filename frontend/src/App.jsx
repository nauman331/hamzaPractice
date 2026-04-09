import React, { useState } from "react";
import "./App.css";

const App = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:4000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      });
      alert((await response.json()).message);
    } catch (error) {
      alert("Something went wrong: " + error.message);
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-card" onSubmit={handleLogin}>
        <h2>Log in</h2>
        <p>Join our community today.</p>

        <div className="input-group">
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label>Username</label>
        </div>

        <div className="input-group">
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label>Password</label>
        </div>

        <button type="submit" className="signup-btn">
          Log In
        </button>
      </form>
    </div>
  );
};

export default App;

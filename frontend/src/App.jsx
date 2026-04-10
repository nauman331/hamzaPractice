import React, { useState } from "react";
import "./App.css";

const App = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:4000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, password }),
        credentials: "include",
      });
      alert((await response.json()).message);
    } catch (error) {
      alert("Something went wrong: " + error.message);
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-card" onSubmit={handleRegister}>
        <h2>Sign Up</h2>
        <p>Join our community today.</p>

        <div className="input-group">
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <label>Full Name</label>
        </div>

        <div className="input-group">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label>Email</label>
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
          Register
        </button>
      </form>
    </div>
  );
};

export default App;

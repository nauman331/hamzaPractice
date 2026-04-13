import React from "react";
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./AuthPages.css";
import useSubmit from "../hooks/useSubmit";
import { isAuthenticated, setSession } from "../utils/auth";

const Login = () => {
  const { submit, loading } = useSubmit();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  if (isAuthenticated()) {
    return <Navigate to="/home" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      email,
      password,
    };

    const result = await submit("/login", payload);
    if (result?.ok) {
      setSession({
        token: result.data?.token,
        user: result.data?.user,
      });
      toast.success("Login successful");
      navigate("/home");
    }
  };

  return (
    <section className="auth-page">
      <article className="auth-card">
        <p className="auth-kicker">Welcome Back</p>
        <h1 className="auth-title">Login to your account</h1>
        <p className="auth-subtitle">Continue building your journey today.</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="auth-note">
          New here?{" "}
          <Link to="/signup" className="auth-link">
            Create account
          </Link>
        </p>
      </article>
    </section>
  );
};

export default Login;

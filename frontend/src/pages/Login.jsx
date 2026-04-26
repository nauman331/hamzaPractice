import React from "react";
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./AuthPages.css";
import { useDispatch, useSelector } from "react-redux";
import { setToken, setUser } from "../store/slices/authSlice";
import useSubmit from "../hooks/useSubmit";

const Login = () => {
  const { token, loading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { submit } = useSubmit();

  if (token) {
    return <Navigate to="/home" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const res = await submit("/login", { email, password });
      if (res.ok && res.data) {
        if (res.data.token) dispatch(setToken({ token: res.data.token }));
        if (res.data.user) dispatch(setUser({ userdata: res.data.user }));
        toast.success("Login successful");
        navigate("/home");
      } else {
        toast.error(res.error || "Login failed");
      }
    } catch (err) {
      toast.error("Login failed");
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

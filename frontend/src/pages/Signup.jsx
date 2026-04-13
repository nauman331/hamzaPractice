import React from "react";
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./AuthPages.css";
import useSubmit from "../hooks/useSubmit";
import { isAuthenticated, setSession } from "../utils/auth";

const Signup = () => {
  const { submit, loading } = useSubmit();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  if (isAuthenticated()) {
    return <Navigate to="/home" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      fullName,
      email,
      password,
    };
    const result = await submit("/register", payload);
    if (result?.ok) {
      setSession({
        token: result.data?.token,
        user: result.data?.user,
      });
      toast.success("Signup successful");
      navigate("/home");
    }
  };

  return (
    <section className="auth-page">
      <article className="auth-card">
        <p className="auth-kicker">Let us get started</p>
        <h1 className="auth-title">Create your new account</h1>
        <p className="auth-subtitle">Join and launch your next big idea.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="signup-name">Full Name</label>
            <input
              id="signup-name"
              type="text"
              placeholder="Enter your name"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="signup-email">Email</label>
            <input
              id="signup-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="signup-password">Password</label>
            <input
              id="signup-password"
              type="password"
              placeholder="Create strong password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="auth-note">
          Already have an account?{" "}
          <Link to="/login" className="auth-link">
            Login
          </Link>
        </p>
      </article>
    </section>
  );
};

export default Signup;

import React from "react";
import { Navigate } from "react-router-dom";
import "./HomePage.css";
import useFetch from "../hooks/useFetch";
import { clearSession, getStoredUser, isAuthenticated } from "../utils/auth";

const HomePage = () => {
  const { data, loading, refetch } = useFetch("/profile", { isAuth: true });
  const fallbackUser = getStoredUser();
  const user = data?.user || fallbackUser;

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (!loading && !user) {
    clearSession();
    return <Navigate to="/login" replace />;
  }

  const initials = user?.fullName
    ? user.fullName
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("")
    : "NA";

  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "Not available";

  return (
    <main className="home-page">
      <section className="profile-hero">
        <div className="profile-avatar" aria-hidden="true">
          {initials}
        </div>
        <div className="profile-intro">
          <p className="profile-label">Profile</p>
          <h1>{loading ? "Loading profile..." : user?.fullName}</h1>
          <p>
            {loading
              ? "Please wait while we fetch your account details."
              : "Manage your account details and keep track of your progress from one place."}
          </p>
        </div>
        <button
          className="edit-btn"
          type="button"
          onClick={() => refetch("/profile")}
        >
          Refresh Profile
        </button>
      </section>

      <section className="profile-stats" aria-label="Profile statistics">
        <article className="stat-card">
          <h3>Projects</h3>
          <p>12</p>
        </article>
        <article className="stat-card">
          <h3>Followers</h3>
          <p>248</p>
        </article>
        <article className="stat-card">
          <h3>Following</h3>
          <p>180</p>
        </article>
      </section>

      <section className="profile-grid">
        <article className="profile-card">
          <h2>Account Details</h2>
          <ul>
            <li>
              <span>Email</span>
              <strong>{loading ? "Loading..." : user?.email}</strong>
            </li>
            <li>
              <span>Location</span>
              <strong>Not set</strong>
            </li>
            <li>
              <span>Joined</span>
              <strong>{joinedDate}</strong>
            </li>
          </ul>
        </article>

        <article className="profile-card">
          <h2>Recent Activity</h2>
          <ul>
            <li>Updated signup flow with controlled inputs.</li>
            <li>Improved navbar responsiveness for mobile screens.</li>
            <li>Connected auth routes between frontend and backend.</li>
          </ul>
        </article>
      </section>
    </main>
  );
};

export default HomePage;

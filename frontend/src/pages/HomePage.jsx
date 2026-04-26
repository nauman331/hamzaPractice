import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
// Import your Redux action (adjust the path/name to match your slice)
// import { setUserData } from "../redux/authSlice"; 
import "./HomePage.css";
import useFetch from "../hooks/useFetch";

const HomePage = () => {
  const { token, userdata } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const { data, loading, refetch } = useFetch("/api/auth/profile", { isAuth: true });

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!userdata && loading) {
    return (
      <main className="home-page">
        <h2>Loading your profile...</h2>
      </main>
    );
  }

  // 4. If loading is done, and there is still no userdata (e.g., API failed), then redirect.
  if (!userdata && !loading && !data) {
    return <Navigate to="/login" replace />;
  }

  // Fallback: If Redux hasn't updated yet, use local 'data'
  const activeUser = userdata || data;

  const initials = activeUser?.fullName
    ? activeUser.fullName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("")
    : "NA";

  const joinedDate = activeUser?.createdAt
    ? new Date(activeUser.createdAt).toLocaleDateString("en-US", {
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
          <h1>{activeUser?.fullName}</h1>
          <p>
            Manage your account details and keep track of your progress from one place.
          </p>
        </div>
        <button
          className="edit-btn"
          type="button"
          onClick={() => refetch("/profile")} // Note: ensure "/profile" maps correctly in your backend
        >
          Refresh Profile
        </button>
      </section>

      {/* ... Rest of your JSX remains exactly the same ... */}

      <section className="profile-grid">
        <article className="profile-card">
          <h2>Account Details</h2>
          <ul>
            <li>
              <span>Email</span>
              <strong>{activeUser?.email}</strong>
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
      </section>
    </main>
  );
};

export default HomePage;
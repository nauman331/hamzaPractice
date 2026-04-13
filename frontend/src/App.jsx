import React from "react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import HomePage from "./pages/HomePage";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import { isAuthenticated } from "./utils/auth";
import "./App.css";

const App = () => {
  return (
    <div className="app-shell">
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <Navigate to={isAuthenticated() ? "/home" : "/login"} replace />
          }
        />
        <Route path="/login" element={<Login />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </div>
  );
};

export default App;

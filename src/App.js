import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./auth/login/login.tsx";
import UserApp from "./user/UserApp";
import AdminApp from "./admin/AdminApp";
import AuthService from "./user/service/auth/AuthService";
import Register from "./auth/register/register.jsx";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      setIsLoggedIn(true);
      setRole(localStorage.getItem("role"));
    }
  }, []);

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <Login
            isLoggedIn={isLoggedIn}
            setIsLoggedIn={setIsLoggedIn}
            setRole={setRole}
          />
        }
      />
      <Route
        path="/register"
        element={<Register />}
      />
      <Route
        path="/"
        element={
          isLoggedIn ? (
            role === "ADMIN" ? (
              <Navigate to="/admin" />
            ) : (
              <Navigate to="/user/homepage" />
            )
          ) : (
            <Navigate to="/user/homepage" />
          )
        }
      />
      <Route
        path="/admin/*"
        element={<AdminApp isLoggedIn={isLoggedIn} role={role} />}
      />
      <Route
        path="/user/*"
        element={<UserApp isLoggedIn={isLoggedIn} role={role} />}
      />
    </Routes>
  );
}

export default App;

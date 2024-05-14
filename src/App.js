import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Topbar from "./admin/scenes/global/Topbar";
import Dashboard from "./admin/scenes/dashboard";
import HomePage from "./user/pages/homePageUser/HomePage";
import ShoeList from "./user/pages/listProductUser/shoeList/ShoeList";
import ProductDetail from "./user/pages/listProductUser/productDetail";
import ClothesList from "./user/pages/listProductUser/clothesList/ClothesList";
import FooterUser from "./user/components/footerUser/FooterUser";
import HeaderUser from "./user/components/headerUser/HeaderUser";
import Login from "./auth/login/login.tsx";
import UserApp from "./user/UserApp";
import AdminApp from "./admin/AdminApp";
import AuthService from "./user/service/auth/AuthService";

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
        path="/"
        element={
          isLoggedIn ? (
            role === "ADMIN" ? (
              <Navigate to="/admin" />
            ) : (
              <Navigate to="/user" />
            )
          ) : (
            <Navigate to="/login" />
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

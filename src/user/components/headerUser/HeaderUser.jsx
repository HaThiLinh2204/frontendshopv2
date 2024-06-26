import React, { useState, useEffect } from "react";
import "./Header.css";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCartItemCount } from "../../service/CartItemCountContext";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

function HeaderUser() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("home");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { cartItemCount, setCartItemCount } = useCartItemCount();

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };

  const handleLogOut = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("isLogin");
    localStorage.removeItem("role");
    navigate("/user/homepage");
  };

  useEffect(() => {
    const userId = parseInt(localStorage.getItem("user_id"));
    const token = localStorage.getItem("access_token");
    if (token) {
      setIsLoggedIn(true);
    }
    const path = location.pathname;
    switch (path) {
      case "/user/homepage":
        setSelectedTab("home");
        break;
      case "/user/shoes":
        setSelectedTab("shoes");
        break;
      case "/user/handbag":
        setSelectedTab("handbag");
        break;
      case "/user/accessory":
        setSelectedTab("accessory");
        break;
      case "/user/clothes":
        setSelectedTab("clothes");
        break;
      case "/user/customer":
        setSelectedTab("customer");
        break;
      default:
        setSelectedTab("home");
        break;
    }
    axios
      .get(`http://localhost:8004/cart/${userId}/items/count`)
      .then((response) => {
        setCartItemCount(response.data);
      })
      .catch((error) => {
        console.error("Error fetching cart item count:", error);
      });
  }, [location.pathname]);

  return (
    <div className="header-page">
      <div className="header-title">
        <a href="/" className="title-page">
          FURLA
        </a>
      </div>
      <div className="tabbar header-tab">
        <div className="menu-tab">
          <div
            className={`menu-tab-item ${
              selectedTab === "home" ? "active" : ""
            }`}
            onClick={() => handleTabClick("home")}
          >
            <a href="/user/homepage">TRANG CHỦ</a>
          </div>
          <div
            className={`menu-tab-item ${
              selectedTab === "shoes" ? "active" : ""
            }`}
            onClick={() => handleTabClick("shoes")}
          >
            <a href="/user/shoes">GIÀY</a>
          </div>
          <div
            className={`menu-tab-item ${
              selectedTab === "handbag" ? "active" : ""
            }`}
            onClick={() => handleTabClick("handbag")}
          >
            <a href="/user/handbag">TÚI</a>
          </div>
          <div
            className={`menu-tab-item ${
              selectedTab === "accessory" ? "active" : ""
            }`}
            onClick={() => handleTabClick("accessory")}
          >
            <a href="/user/accessory">PHỤ KIỆN</a>
          </div>
          <div
            className={`menu-tab-item ${
              selectedTab === "clothes" ? "active" : ""
            }`}
            onClick={() => handleTabClick("clothes")}
          >
            <a href="/user/clothes">QUẦN ÁO</a>
          </div>
          <div
            className={`menu-tab-item ${
              selectedTab === "customer" ? "active" : ""
            }`}
            onClick={() => handleTabClick("customer")}
          >
            <a href="/user/customer">CUSTOMER</a>
          </div>
        </div>
      </div>
      <div className="rightbar">
        {isLoggedIn ? (
          <a className="user" onClick={handleLogOut}>
            <p>Đăng xuất</p>
          </a>
        ) : (
          <a href="/login" className="user">
            <p>Đăng nhập</p>
          </a>
        )}
        <a className="cart" href="/user/cart">
          <p><AddShoppingCartIcon />({cartItemCount}) </p>
        </a>
        <a className="orderList" href="/user/order">
          <p>Lịch sử </p>
        </a>
      </div>
    </div>
  );
}

export default HeaderUser;

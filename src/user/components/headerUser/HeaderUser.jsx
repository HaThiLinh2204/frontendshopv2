import React, { useState, useEffect } from "react";
import { BsFillTelephonePlusFill, BsFillCartPlusFill } from "react-icons/bs";
import "./Header.css";
import { useLocation } from "react-router-dom";

function HeaderUser() {
  const location = useLocation();
  const [selectedTab, setSelectedTab] = useState("home");
  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };

  useEffect(() => {
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
  }, [location.pathname]);

  return (
    <div className="header-page">
      <div className="topbar">
        <div className="leftbar">
          <div className="header-icon">
            {" "}
            <BsFillTelephonePlusFill />
          </div>
          <p>Địa chỉ 102 Thái Thịnh, Đống Đam Hà Nội - Hottline: 1900.2812</p>
        </div>
        <div className="rightbar">
          <i className="">
            <BsFillCartPlusFill />
            <p>Giỏ hàng </p>
          </i>
          <i className="">
            {/* <PermIdentityIcon /> */}
            <a href="/login">Tài khoản</a>
          </i>
        </div>
      </div>
      <div className="downbar">
        <div className="header">
          <a href="/" className="title-page">
            FURLA
          </a>
        </div>
        <div className="tabbar header-tab">
          <div className="menu-tab">
            <div
              className={`menu-tab-item ${selectedTab === "home" ? "active" : ""}`}
              onClick={() => handleTabClick("home")}
            >
              <a href="/user/homepage">TRANG CHỦ</a>
            </div>
            <div
              className={`menu-tab-item ${selectedTab === "shoes" ? "active" : ""}`}
              onClick={() => handleTabClick("shoes")}
            >
              <a href="/user/shoes">GIÀY</a>
            </div>
            <div
              className={`menu-tab-item ${selectedTab === "handbag" ? "active" : ""}`}
              onClick={() => handleTabClick("handbag")}
            >
              <a href="/user/handbag">TÚI</a>
            </div>
            <div
              className={`menu-tab-item ${selectedTab === "accessory" ? "active" : ""}`}
              onClick={() => handleTabClick("accessory")}
            >
              <a href="/user/accessory">PHỤ KIỆN</a>
            </div>
            <div
              className={`menu-tab-item ${selectedTab === "clothes" ? "active" : ""}`}
              onClick={() => handleTabClick("clothes")}
            >
              <a href="/user/clothes">QUẦN ÁO</a>
            </div>
            <div
              className={`menu-tab-item ${selectedTab === "customer" ? "active" : ""}`}
              onClick={() => handleTabClick("customer")}
            >
              <a href="/user/customer">CUSTOMER</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default HeaderUser;

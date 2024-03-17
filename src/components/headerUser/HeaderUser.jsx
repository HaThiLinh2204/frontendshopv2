import React from "react";

import { BsFillTelephonePlusFill, BsFillCartPlusFill } from "react-icons/bs";

import "./Header.css";


function HeaderUser() {
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
            <div className="menu-tab-item">
              <a href="/user/homepage">TRANG CHỦ</a>
            </div>
            <div className="menu-tab-item">
              <a href="/user/shoes">GIÀY</a>
            </div>
            <div className="menu-tab-item">
              <a href="/user/handbag">TÚI</a>
            </div>
            <div className="menu-tab-item">
              <a href="/user/accessory">PHỤ KIỆN</a>
            </div>
            <div className="menu-tab-item">
              <a href="/user/fashion">THỜI TRANG</a>

            </div>
            <div className="menu-tab-item">
              <a href="/user/homepage"> CUSTOMER</a>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default HeaderUser;

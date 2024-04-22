import React from "react";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';

function AuthService() {
  const apiUrl = 'http://localhost:8004/auth';
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  const login = async (email, password) => {
    try {
      const response = await fetch(`${apiUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('User ID:', data.user.id);
        localStorage.setItem('access_token', data.jwt);
        localStorage.setItem('user_id', data.user.id);
        setLoggedIn(true);
        navigate('/home'); // Điều hướng đến trang sau khi đăng nhập thành công
      } else {
        // Xử lý trường hợp lỗi đăng nhập
        console.error('Login error:', response.statusText);
        // Hiển thị thông báo lỗi cho người dùng
      }
    } catch (error) {
      console.error('Login error:', error);
      // Xử lý trường hợp lỗi không mong muốn
    }
  };

  const register = async (email, password) => {
    try {
      const response = await fetch(`${apiUrl}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        // Đăng ký thành công
      } else {
        // Xử lý trường hợp lỗi đăng ký
        console.error('Register error:', response.statusText);
        // Hiển thị thông báo lỗi cho người dùng
      }
    } catch (error) {
      console.error('Register error:', error);
      // Xử lý trường hợp lỗi không mong muốn
    }
  };

  return { login, register, loggedIn };
}

export default AuthService;

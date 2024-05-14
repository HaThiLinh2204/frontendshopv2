import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Observable, of } from 'rxjs';

function AuthService() {
  const apiUrl = 'http://localhost:8004/auth';
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const login = async (email, password, callback) => {
    try {
      const response = await fetch(`${apiUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('access_token', data.jwt);
        localStorage.setItem('user_id', data.user.id);
        localStorage.setItem('isLogin', true);
        localStorage.setItem('role',data.user.authorities[0].authority);
        if (data.user.authorities.some(authority => authority.authority === 'ADMIN')) {
          navigate('/admin');
        } else {
          navigate('/user/homepage');
        }
        callback(null, data);
      } else {
        console.error('Lỗi đăng nhập:', response.statusText);
        callback(response.statusText, null);
      }
    } catch (error) {
      console.error('Lỗi đăng nhập:', error);
      callback(error, null);
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
        console.error('Lỗi đăng ký:', response.statusText);
      }
    } catch (error) {
      console.error('Lỗi đăng ký:', error);
    }
  };

  return { login, register, loggedIn };
}

export default AuthService;

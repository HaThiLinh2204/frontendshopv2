import React, { useState } from 'react';
import './login.css';
import { Link } from 'react-router-dom';
import AuthService from '../../user/service/auth/AuthService';


function Login({isLoggedIn, role, setIsLoggedIn, setRole}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const authService = new AuthService();
  const handleLogin = () => {
    authService.login(email, password, (error, data) => {
      if (error) {
        setIsLoggedIn(localStorage.getItem('isLogin'));
        setRole(localStorage.getItem('role'));
        console.error('Đăng nhập thất bại:', error);
      } else {
        console.log('Đăng nhập thành công:', data);
      }
    });
  };

  return (
    <div className="loginPage">
      <form className="wrapper">
        <h2>LOGIN PAGE</h2>
        <section className="group">
          <label htmlFor="email" className="label">
            Email
          </label>
          <input
            type="text"
            size="30"
            className="input"
            name="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </section>
        <section className="group">
          <label htmlFor="password" className="label">
            Password
          </label>
          <input
            type="password"
            className="input"
            name="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </section>
        <button type="button" className="btn" onClick={handleLogin}>
          LOGIN
        </button>
        <span className="footer"></span>
      </form>
    </div>
  );
}

export default Login;
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import "./login.css";
import AuthService from '../../user/service/auth/AuthService';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const authService = AuthService();
  const navigate = useNavigate();
 

  const handleLogin = async () => {
    try {
      await authService.login(email, password);
      navigate('/home');
    } catch (error) {
      setError("Invalid email or password");
    }
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </section>
        <section className="group">
          <label htmlFor="password" className="label">
            Password
          </label>
          <input
            type="password"
            minLength="8"
            className="input"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </section>
        {error && <div className="error">{error}</div>} {/* Hiển thị thông báo lỗi */}
        <button type="button" className="btn" onClick={handleLogin}>
          LOGIN
        </button>
        <span className="footer"></span>
      </form>
    </div>
  );
}

export default Login;
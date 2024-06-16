import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './index.css';
import AuthService from '../../user/service/auth/AuthService';
import { useNavigate } from "react-router-dom";
function Register(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const authService = new AuthService();
    const navigate = useNavigate();
  
    const handleRegister = async () => {
      if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
      }
      try {
        await authService.register(email, password);
        alert('Registration successful');
        navigate('/login');
      } catch (error) {
        console.error('Registration error:', error);
        alert('Registration failed');
      }
    };
  
    return (
      <div className="register-page">
        <form className="wrapper">
          <h2>ĐĂNG KÝ</h2>
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
          <section className="group">
            <label htmlFor="confirmPassword" className="label">
              Confirm Password
            </label>
            <input
              type="password"
              className="input"
              name="confirmPassword"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </section>
          <button type="button" className="btn" onClick={handleRegister}>
            Đăng ký
          </button>
          <div> Đã có tài khoản? <Link to="/login" className="user">Đăng nhập</Link></div>
          <span className="footer"></span>
        </form>
      </div>
    );
};
export default Register;
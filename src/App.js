import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Topbar from './admin/scenes/global/Topbar';
import Dashboard from './admin/scenes/dashboard';
import HomePage from './user/pages/homePageUser/HomePage';
import ShoeList from './user/pages/listProductUser/shoeList/ShoeList';
import ProductDetail from './user/pages/listProductUser/productDetail';
import ClothesList from './user/pages/listProductUser/clothesList/ClothesList';
import FooterUser from './user/components/footerUser/FooterUser';
import HeaderUser from './user/components/headerUser/HeaderUser';
import Login from './auth/login/login.tsx';
import UserApp from './user/UserApp';
import AdminApp from './admin/AdminApp';
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');

  const handleLogin = (email, password) => {
    if (email === 'admin@gmail.com' && password === 'admin') {
      setIsLoggedIn(true);
      setEmail(email);
    } else {
      // Xử lý trường hợp đăng nhập không thành công
    }
  };

  return (
  
      <Routes>
        <Route
          path="/login"
          element={<Login isLoggedIn={isLoggedIn} onLogin={handleLogin} />}
        />
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Navigate to={email === 'admin@gmail.com' ? '/admin' : '/user/homepage'} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/admin/*"
          element={
            isLoggedIn && email === 'admin@gmail.com' ? (
              <AdminApp />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="/user/*" element={<UserApp />} />
      </Routes>
  );
}


export default App;

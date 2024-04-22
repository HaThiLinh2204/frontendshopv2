import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/homePageUser/HomePage';
import ShoeList from './pages/listProductUser/shoeList/ShoeList';
import ProductDetail from './pages/listProductUser/productDetail';
import ClothesList from './pages/listProductUser/clothesList/ClothesList';
import FooterUser from './components/footerUser/FooterUser';
import HeaderUser from './components/headerUser/HeaderUser';
function UserApp() {
    return (
      <>
        <HeaderUser />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/homepage" element={<HomePage />} />
          <Route path="/shoes" element={<ShoeList />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/clothes" element={<ClothesList />} />
        </Routes>
        <FooterUser />
      </>
    );
  }
  export default UserApp;
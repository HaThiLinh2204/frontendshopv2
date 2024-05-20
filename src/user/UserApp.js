import React, {useState, useEffect} from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/homePageUser/HomePage';
import ShoeList from './pages/listProductUser/shoeList/ShoeList';
import ProductDetail from './pages/listProductUser/productDetail/index';
import ClothesList from './pages/listProductUser/clothesList/ClothesList';
import FooterUser from './components/footerUser/FooterUser';
import HeaderUser from './components/headerUser/HeaderUser';
import Cart from './pages/listCart/Cart';
import { CartItemCountProvider } from './service/CartItemCountContext';
import axios from "axios";
import ListOrder from './pages/listOrder';

function UserApp({isLogin, role}) {
  
    return (
      <CartItemCountProvider>
        <HeaderUser />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/homepage" element={<HomePage />} />
          <Route path="/shoes" element={<ShoeList />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/order" element={<ListOrder/>}/>
          <Route path="/clothes" element={<ClothesList />}/>
          <Route path="/cart" element={<Cart />} />
        </Routes>
        <FooterUser />
      </CartItemCountProvider>
    );
  }
  export default UserApp;
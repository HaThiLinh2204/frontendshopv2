import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Topbar from './scenes/global/Topbar';
import Dashboard from './scenes/dashboard';
import Clothes from './scenes/clothes';
import Sidebar from './scenes/global/Sidebar';
import Form from './scenes/form';
import Handbag from './scenes/handbag';
import Accessory from './scenes/accessory';
import Shoes from './scenes/shoe';

function AdminApp() {
  return (
    <>
      <Topbar />
      <main style={{ display: "flex" }}>
        <Sidebar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/shoes" element={<Shoes />} />
          <Route path="/accessory" element={<Accessory />} />
          <Route path="/clothes" element={<Clothes />} />
          <Route path="/handbags" element={<Handbag />} />
          <Route path="/form" element={<Form mode="create" />} />
          <Route path="/form/:id/edit" element={<Form mode="edit" />} />
        </Routes>
      </main>
    </>
  );
}

export default AdminApp;
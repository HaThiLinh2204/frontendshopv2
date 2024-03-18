import React from 'react';
import { Box } from "@mui/material";
import { useState } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Topbar from "./admin/scenes/global/Topbar";
import Dashboard from "./admin/scenes/dashboard";
import Clothes from "./admin/scenes/clothes";
import Sidebar from "./admin/scenes/global/Sidebar";
import Form from "./admin/scenes/form";
import Handbag from "./admin/scenes/handbag";
import Accessory from "./admin/scenes/accessory";
import Shoes from './admin/scenes/shoe';
import Main from "./admin/scenes/main";
import HeaderUser from './user/components/headerUser/HeaderUser';
import FooterUser from './user/components/footerUser/FooterUser'
import HomePage from './user/pages/homePageUser/HomePage';
import ShoeList from './user/pages/listProductUser/shoeList/ShoeList';
import ProductDetail from './user/pages/listProductUser/productDetail';
import ClothesList from './user/pages/listProductUser/clothesList/ClothesList';

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
  <div className="app">
    <AppContent />
  </div>
  );
}


function AppContent() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const location = useLocation();
  const isAdminPage = !location.pathname.startsWith("/admin");
  if (!isAdminPage){
    return (
      <>
        <ColorModeContext.Provider value={colorMode}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <div className="app">
              <Topbar setIsSidebar={setIsSidebar} />
              <main className="content" style={{ display: "flex" }}>
                {isSidebar && <Sidebar isSidebar={isSidebar} />}
                <Box flexGrow={1}>
                  <Routes>
                    <Route path="/admin/" element={<Dashboard />} />
                    <Route path="/admin/shoes" element={<Shoes />} />
                    <Route path="/admin/accessory" element={<Accessory />} />
                    <Route path="/admin/clothes" element={<Clothes />} />
                    <Route path="/admin/handbags" element={<Handbag />} />
                    {/* <Route path="/form" element={<Form />} /> */}
                    <Route path="/admin/form" element={<Form mode="create" />} />
                    <Route path="/admin/form/:id/edit" element={<Form mode="edit" />} />
                  </Routes>
                </Box>
              </main>
            </div>
          </ThemeProvider>
        </ColorModeContext.Provider>
      </>
    )
  }
  else {
    return (
      <>
        <HeaderUser />
        <Routes>
          <Route path="/" element = {<HomePage/>}/>
          <Route path="/user/homepage" element={<HomePage />} />
          {/* <Route path="login" element={<Login />} />
          <Route path="/register" element={<Register />} /> */}
          <Route path="/user/shoes" element={<ShoeList />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/user/clothes" element={<ClothesList />}/>
          {/* <Route path="/tui" element={<Tui />} />
          <Route path="/user/clothes" element={<PhuKien />} />
          
          */}
        </Routes>
        <FooterUser />
      </>
        
    )
  };
}
export default App;

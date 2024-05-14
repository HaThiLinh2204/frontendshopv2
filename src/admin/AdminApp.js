import React from "react";
import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Dashboard from "./scenes/dashboard";
import Clothes from "./scenes/clothes/index";
import Sidebar from "./scenes/global/Sidebar";
import Form from "./scenes/form";
import Handbag from "./scenes/handbag";
import Accessory from "./scenes/accessory";
import Shoes from "./scenes/shoe/shoe";
import { useMode, ColorModeContext } from "../theme";
import { CssBaseline, ThemeProvider, Box } from "@mui/material";

function AdminApp({ isLogin, role }) {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
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
                  <Route path="" element={<Dashboard />} />
                  <Route path="/shoes" element={<Shoes />} />
                  <Route path="/accessory" element={<Accessory />} />
                  <Route path="/clothes" element={<Clothes />} />
                  <Route path="/handbags" element={<Handbag />} />
                  <Route path="/form" element={<Form mode="create" />} />
                  <Route path="/form/:id/edit" element={<Form mode="edit" />} />
                </Routes>
              </Box>
            </main>
          </div>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </>
  );
}

export default AdminApp;

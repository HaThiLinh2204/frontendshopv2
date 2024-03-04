import React from 'react';
import { Box } from "@mui/material";
import { useState } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { Routes, Route } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Dashboard from "./scenes/dashboard";
import Clothes from "./scenes/clothes";
import Sidebar from "./scenes/global/Sidebar";
import Form from "./scenes/form";
import Handbag from "./scenes/handbag";
import Accessory from "./scenes/accessory";
import Shoes from './scenes/shoe';
import Main from "./scenes/main";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Topbar setIsSidebar={setIsSidebar} />
          <main className="content" style={{ display: "flex" }}>
            {isSidebar && <Sidebar isSidebar={isSidebar} />}
            <Box flexGrow={1}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/shoes" element={<Shoes />} />
                <Route path="/accessory" element={<Accessory />} />
                <Route path="/clothes" element={<Clothes />} />
                <Route path="/handbags" element={<Handbag />} />
                <Route path="/form" element={<Form />} />
              </Routes>
            </Box>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}


export default App;

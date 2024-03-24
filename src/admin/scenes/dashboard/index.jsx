import React, { useEffect, useState } from 'react';
import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import axios from 'axios';

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [totalProducts, setTotalProducts] =  useState();

  useEffect(() => {
    axios
    .get("http://localhost:8004/products/total")
    .then((response) => {
      setTotalProducts(response.data);
    })
  }, [])

  return (
    <Box m="20px">
      <h1>Dashboard</h1>
      <div>
        <h2>Tổng số mặt hàng: {totalProducts} </h2>
      </div>         
    </Box>
  );
};

export default Dashboard;

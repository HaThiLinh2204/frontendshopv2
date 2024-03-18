import React from 'react';
import { Box, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../../theme";
import Header from "../../components/Header";
import { useEffect, useState } from "react";
import axios from "axios";

const Accessory = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [accessories, setAccessory] = useState([]);
  useEffect(() => {
    axios
    .get("http://localhost:8004/products/ACCESSORY")
    .then((response) => {
      const accessoryWithId = response.data.map((accessory) => ({
        ...accessory,
        category: 'ACCESSORY',
        id: accessory.product_id, // Sử dụng product_id làm id
      }));
      setAccessory(accessoryWithId);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
  }, []);
  const columns = [
    { field: "product_id", headerName: "ID", flex: 0.5 },
    { field: "name",headerName: "Name",flex: 1,},
    { field: "category",headerName: " Category", flex: 1, headerAlign: "left", align: "left",},
    { field: "description", headerName: "Description", flex: 1 }, 
    { field: "price", headerName: "Price", flex: 1 }, 
  ];

  return (
    <Box m="20px">
      <Header title="ACCESSORY" subtitle="Manage accessory list" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .no-border-bottom": {
            borderBottom: "none !important",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
       <DataGrid
          checkboxSelection
          rows={accessories}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </Box>
  );
};

export default Accessory;

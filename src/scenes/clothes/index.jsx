import React from 'react';
import { Box , IconButton , Dialog, DialogTitle, DialogContent, DialogActions, Button} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { tokens } from "../../theme";
import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import { useNavigate } from 'react-router-dom';

const Clothes = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [clothes, setClothes] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const navigate = useNavigate();

  // 
  useEffect(() => {
    const fetchProductsWithTotalQuantity = async () => {
      try {
        const response = await axios.get('http://localhost:8004/products/CLOTHES');
        const clothesWithTotalQuantity = await Promise.all(response.data.map(async (clothe) => {
          const totalResponse = await axios.get(`http://localhost:8004/product/${clothe.product_id}/total`);
          const totalQuantity = totalResponse.data;
          return {
            ...clothe,
            category: 'CLOTHES',
            id: clothe.product_id,
            totalQuantity: totalQuantity,
          };
        }));
        setClothes(clothesWithTotalQuantity);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchProductsWithTotalQuantity();
  }, []);

  const handleEdit = (id) => {
    // navigate(`/edit/${id}`);
    navigate(`/form/${id}/edit`);
    // Xử lý logic chỉnh sửa dựa trên dữ liệu hàng row
  };
  
  const handleDeleteClick = (id) => {
    setDeleteItemId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (deleteItemId) {
      axios.delete(`http://localhost:8004/product/${deleteItemId}`)
        .then((response) => {
          const updatedClothes = clothes.filter(item => item.id !== deleteItemId);
          setClothes(updatedClothes);
          setDeleteDialogOpen(false);
        })
        .catch((error) => {
          console.error("Error deleting item:", error);
        });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setDeleteItemId(null);
  };

  const columns = [
    { field: "product_id", headerName: "ID", flex: 0.5 },
    { field: "name",headerName: "Name",flex: 1,},
    { field: "category",headerName: " Category", flex: 1, headerAlign: "left", align: "left",},
    { field: "description", headerName: "Description", flex: 2 }, 
    { field: "price", headerName: "Price", flex: 1 },
    { field: "totalQuantity", headerName: "Total", flex: 1},
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <IconButton onClick={() => handleEdit(params.row.id)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDeleteClick(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header
        title="CLOTHES"
        subtitle="Manage clothes list"
      />
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
          rows={clothes}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel} >
        <div style={{backgroundColor: '#FAF0F1', color:'#000000'}}>
          <h3 style={{marginLeft: '16px'}}>Confirm delete product</h3>
          <DialogContent>
            Are you sure you want to delete this product?
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteConfirm} variant="contained" color="error">
              Yes
            </Button>
            <Button onClick={handleDeleteCancel} variant="outlined" color="primary">
              No
            </Button>
          </DialogActions>
        </div>
        
      </Dialog>
    </Box>
  );
};

export default Clothes;

import React from 'react';
import { Box , IconButton , Dialog, DialogTitle, DialogContent, DialogActions, Button} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { tokens } from "../../../theme";
import { useEffect, useState } from "react";
import axios from "axios";
import Header from '../../components/Header';
import { useTheme } from "@mui/material";
import { useNavigate } from 'react-router-dom';

const Handbag = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [productList, setProductList] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductsWithTotalQuantity = async () => {
      try {
        const response = await axios.get('http://localhost:8004/products/HANDBAG');
        const productsWithTotalQuantity = await Promise.all(response.data.map(async (product) => {
          const totalResponse = await axios.get(`http://localhost:8004/product/${product.product_id}/total`);
          const quantitySoldResponse = await axios.get(`http://localhost:8004/product/${product.product_id}/quantitySold`);
          const remainQuantityResponse = await axios.get(`http://localhost:8004/product/${product.product_id}/remainQuantity`);
          const interestResponse = await axios.get(`http://localhost:8004/product/${product.product_id}/interest`)
          const totalQuantity = totalResponse.data;
          const quantitySold = quantitySoldResponse.data;
          const remainQuantity = remainQuantityResponse.data;
          const interest = interestResponse.data;
          return {
            ...product,
            category: 'Túi xách',
            id: product.product_id,
            remainQuantity: remainQuantity,
            quantitySold: quantitySold,
            totalQuantity: totalQuantity,
            interest: interest
          };
        }));
        setProductList(productsWithTotalQuantity);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchProductsWithTotalQuantity();
  }, []);

  const handleEdit = (id) => {
    navigate(`/admin/form/${id}/edit`);
  };
  
  const handleDeleteClick = (id) => {
    setDeleteItemId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (deleteItemId) {
      axios.delete(`http://localhost:8004/product/${deleteItemId}`)
        .then((response) => {
          const updatedProducts = productList.filter(item => item.id !== deleteItemId);
          setProductList(updatedProducts);
          setDeleteDialogOpen(false);
          alert('Xóa thành công!!');
        })
        .catch((error) => {
          console.error("Lỗi", error);
        });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setDeleteItemId(null);
  };

  const columns = [
    { field: "name",headerName: "Tên",flex: 3,},
    { field: "description", headerName: "Mô tả", flex: 2 }, 
    { field: "price", headerName: "Giá gốc", flex: 1 },
    { field: "saleprice", headerName: "Giá bán", flex: 1 },
    { field: "quantitySold", headerName:"Đã Bán", flex: 1 },
    { field: "remainQuantity", headerName:"Còn lại", flex: 1 },
    { field: "totalQuantity", headerName: "Tổng", flex: 1},
    {
      field: "actions",
      headerName: "Thao tác",
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
        title="Túi xách"
        subtitle="Quản lý danh sách túi"
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
          rows={productList}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel} >
        <div style={{backgroundColor: '#FAF0F1', color:'#000000'}}>
          <h3 style={{marginLeft: '16px'}}>Xác nhận xóa</h3>
          <DialogContent>
          Bạn có chắc chắn muốn xóa sản phẩm này không ?
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteConfirm} variant="contained" color="error">
              Có
            </Button>
            <Button onClick={handleDeleteCancel} variant="outlined" color="primary">
              Hủy
            </Button>
          </DialogActions>
        </div>
        
      </Dialog>
    </Box>
  );
};

export default Handbag;

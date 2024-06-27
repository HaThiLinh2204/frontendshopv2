import React, { useState, useEffect } from "react";
import "./index.css";
import axios from "axios";
import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

function ListOrder() {
  const [orderItems, setOrderItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; 
  const navigate = useNavigate();
  const formatCurrency = (value) => {
    return value.toLocaleString('vi-VN', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  useEffect(() => {
    const userId = parseInt(localStorage.getItem("user_id"));

    const fetchOrderList = async () => {
      try {
        const response = await axios.get(`http://localhost:8004/order/${userId}`);
        const orderList = await Promise.all(
          response.data.ordersItems.map(async (product) => {
            const imageResponse = await axios.get(
              `http://localhost:8004/product/image/${product.productId}?limit=1`
            );
            const imageUrl = imageResponse.data[0]?.imageUrl || "";
            return { ...product, imageUrl };
          })
        );
        setOrderItems(orderList.sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated)));
      } catch (error) {
        alert('Lỗi khi lấy danh sách sản phẩm trong giỏ hàng');
        console.error("Lỗi khi lấy danh sách sản phẩm trong giỏ hàng:", error);
      }
    };

    fetchOrderList();
  }, []);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, orderItems.length);

  const paginatedOrderItems = orderItems.slice(startIndex, endIndex);

  const handleReviewClick = (orderItemId, productId) => {
    navigate(`/user/review/${orderItemId}/${productId}`);
  };

  const handleRebuyClick = async (productId) => {
    try {
      const response = await axios.get(`http://localhost:8004/product/${productId}`);
      const product = response.data;
  
      if (product.isDeleted) {
        alert('Sản phẩm không còn tồn tại');
      } else {
        navigate(`/user/products/${productId}`);
      }
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
    console.log(`Rebuy product with id: ${productId}`);
  };

  return (
    <div className="order-page">
      <h2>Danh sách sản phẩm đã đặt hàng</h2>
      {orderItems ? (
         <div className="order-items">
         {paginatedOrderItems.map((item, index) => (
           <Box 
             className="cart-item"
             key={index}
             display="grid"
             gridTemplateColumns="repeat(11, 1fr)"
             gridAutoRows="140px"
             gap="20px"
             alignItems="center"
            justifyContent="center"
             >
             <Box className="item1" gridColumn="span 1"> 
               <img src={item.imageUrl} alt={item.productName} />
             </Box>
             <Box gridColumn="span 3" className="product-name">{item.productName}</Box>
             <Box gridColumn="span 1">Loại:{item.sizeName}</Box>
             <Box gridColumn="span 1">Giá: {formatCurrency(item.price)}</Box>
             <Box gridColumn="span 2">Thành tiền: {formatCurrency(item.subTotal)}Đ</Box>
             <Box gridColumn="span 2">{item.dateCreated}</Box>
             <Box gridColumn="span 1">
             {item.isReviewed ? (
               <button className ="buy-button" onClick={() => handleRebuyClick(item.productId)}>Mua lại</button>
             ) : (
               <button className="comment-button" onClick={() => handleReviewClick(item.id, item.productId)}>Đánh giá</button>
             )}
             </Box>
           </Box>
         ))}
       </div>
      ): (
        <p>Đang tải thông tin sản phẩm...</p>
      )}
      {orderItems.length > itemsPerPage && (
         <div className="pagination">
           <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
             <ArrowBackIosIcon/>
           </button>
           <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === Math.ceil(orderItems.length / itemsPerPage)}>
             <ArrowForwardIosIcon/>
           </button>
         </div>
       )}
     
    </div>
  );
}

export default ListOrder;


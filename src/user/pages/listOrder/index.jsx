import React, { useState, useEffect } from "react";
import "./index.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

function ListOrder() {
  const [orderItems, setOrderItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; 
  const navigate = useNavigate();

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

  const handleReviewClick = (productId) => {
    navigate(`/user/review/${productId}`);
  };

  return (
    <div className="order-page">
      <h2>Danh sách sản phẩm đã đặt hàng</h2>
      <div className="order-items">
        {paginatedOrderItems.map((item, index) => (
          <div className="cart-item" key={index}>
            <div className="item1">
              {index + 1}. 
              <img src={item.imageUrl} alt={item.productName} />
            </div>
            <p>{item.productName}</p>
            <p>{item.sizeName}</p>
            <p>Giá: {item.price}</p>
            <input type="number" value={item.quantity} readOnly />
            <p>{item.subTotal}</p>
            <p>{item.dateCreated}</p>
            <button onClick={() => handleReviewClick(item.productId)}>Đánh giá</button>
          </div>
        ))}
      </div>

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

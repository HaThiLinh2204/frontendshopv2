import React, { useState, useEffect } from "react";
import "./index.css";
import axios from "axios";

function ListOrder() {
  const [orderItems, setOrderItems] = useState([]);
  useEffect(() => {
    const userId = parseInt(localStorage.getItem("user_id"));
    const fetchOrderList = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8004/order/${userId}`
        );
        const orderList = await Promise.all(
          response.data.ordersItems.map(async (product) => {
            const imageResponse = await axios.get(
              `http://localhost:8004/product/image/${product.productId}?limit=1`
            );
            const imageUrl = imageResponse.data[0]?.imageUrl || "";
            return { ...product, imageUrl };
          })
        );
        console.log("order", orderList);
        setOrderItems(orderList);
        console.log("AAAAA", orderItems);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách sản phẩm trong giỏ hàng:", error);
      }
    };
    setTimeout(() => {
      fetchOrderList();
    });
  }, []);

  return (
    <div className="order-page">
      <h2>Danh sách sản phẩm đã đặt hàng</h2>
      <div className="order-items">
        {orderItems.map((item, index) => (
          <div className="cart-item" key={index}>
            <div className="item1">
              <img src={item.imageUrl} alt={item.productName} />
            </div>
            <p>{item.productName}</p>
            <p>{item.sizeName}</p>
            <p>Giá: {item.price}</p>
            <input type="number" value={item.quantity} readOnly />
            <p>{item.subTotal}</p>
            <p>{item.dateCreated}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
export default ListOrder;

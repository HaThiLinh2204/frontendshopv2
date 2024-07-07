import React, { useState, useEffect } from "react";
import "./Cart.css";
import axios from "axios";
import { useCartItemCount } from "../../service/CartItemCountContext";
import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const { cartItemCount, setCartItemCount } = useCartItemCount();
  const navigate = useNavigate();
  const formatCurrency = (value) => {
    return value.toLocaleString('vi-VN', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };


  const updateCartItemCount = () => {
    const userId = parseInt(localStorage.getItem("user_id"));
    axios
      .get(`http://localhost:8004/cart/${userId}/items/count`)
      .then((response) => {
        setCartItemCount(response.data);
      })
      .catch((error) => {
        console.error("Error fetching cart item count:", error);
      });
  };

  useEffect(() => {
    const userId = parseInt(localStorage.getItem("user_id"));
    const fetchProducts = async () => {
      const lastAddedCartItem = parseInt(localStorage.getItem('lastAddedCartItem'));
      try {
        const response = await axios.get(
          `http://localhost:8004/cart/${userId}`
        );
        const processedProducts = await Promise.all(
          response.data.cartItems.map(async (product) => {
            const imageResponse = await axios.get(
              `http://localhost:8004/product/image/${product.productId}?limit=1`
            );
            const imageUrl = imageResponse.data[0]?.imageUrl || "";
            return { ...product, imageUrl };
          })
        );
        if (lastAddedCartItem) {
          processedProducts.forEach((cartItem, index) => {
            if(cartItem.id === lastAddedCartItem) {
              processedProducts[index].selected = true;
              checkSelectAll(processedProducts);
              localStorage.removeItem('lastAddedCartItem');
            }
          });
        }
        setCartItems(processedProducts);
      } catch (error) {
        alert("Lỗi khi lấy danh sách sản phẩm trong giỏ hàng:", error);
        console.error("Lỗi khi lấy danh sách sản phẩm trong giỏ hàng:", error);
      }
    };
    setTimeout(() => {
      fetchProducts();
    }, 100);
  }, []);

  const handleCheckboxChange = (index) => {
    const newCartItems = [...cartItems];
    newCartItems[index].selected = !newCartItems[index].selected;
    setCartItems(newCartItems);
    checkSelectAll(cartItems);
  };

  const handleSelectAllChange = () => {
    const newCartItems = cartItems.map((item) => {
      return { ...item, selected: !selectAll };
    });

    setCartItems(newCartItems);
    setSelectAll(!selectAll);
  };

  const handleDeleteItem = (index) => {
    const userId = parseInt(localStorage.getItem("user_id"));
    axios.delete(`http://localhost:8004/cart/${userId}/remove?cartItemId=${cartItems[index].id}`)
      .then((response) => {
        updateCartItemCount();
        const newCartItems = [...cartItems];
        newCartItems.splice(index, 1);
        setCartItems(newCartItems);
        alert("Đã xóa sản phẩm khỏi giỏ hàng");
      })
      .catch((error) => {
        alert("Lỗi khi xóa sản phẩm khỏi giỏ hàng:", error);
        console.error('Lỗi khi xóa sản phẩm khỏi giỏ hàng:', error);
      });
  };

  const checkSelectAll = (carts) => {
    if (carts.length) {
      const indexes = carts.map((item, index) => {
        if (item.selected) {
          console.log('item', item);
          return index;
        }
      }).filter(index => index !== undefined);
      if (indexes.length === cartItemCount) {
        setSelectAll(true);
      }
      else {
        setSelectAll(false);
      }
    }
  }

  const handleDeleteSelectedItems = () => {
    const userId = parseInt(localStorage.getItem("user_id"));
    if (selectAll) {
      axios
        .delete(`http://localhost:8004/cart/${userId}/clear`)
        .then((response) => {
        alert("Đã xóa sản phẩm khỏi giỏ hàng");
        console.log('Đã xóa sản phẩm khỏi giỏ hàng:', response.data);
          updateCartItemCount();
         const newCartItems = [];
          setCartItems(newCartItems);
          setSelectAll(!selectAll);
        })
    }
    else {
      cartItems.forEach((element, index) => {
        if (element.selected === true) {
          handleDeleteItem(index);
        }
      });
    }
  };

  const handlePlaceOrder = () => {
    const userId = parseInt(localStorage.getItem("user_id"));
    const orderItems = cartItems.filter((item) => item.selected);
    const normalizedOrderItems = orderItems.map(item => ({
      id: item.id,
      productId: item.productId,
      sizeId: item.sizeId,
      quantity: item.quantity,
      price: item.price,
      subTotal: item.subTotal,
      productName: item.productName,
      sizeName: item.sizeName,
      category: item.category
    }));
  
    const orderPromises = normalizedOrderItems.map(orderItem => {
      return axios.post(`http://localhost:8004/order/${userId}/create?userId=${userId}`, orderItem, {
        headers: {
          'Content-Type': 'application/json' 
        }
      });
    });
  
    Promise.all(orderPromises)
      .then(responses => {
        console.log('Đặt hàng thành công:', responses);
        alert('Đặt hàng thành công');
        setCartItems(cartItems.filter(item => !item.selected));
        updateCartItemCount();
        navigate(`/user/order`);
      })
      .catch(error => {
        alert('Lỗi đặt hàng:', error);
        console.error('Lỗi đặt hàng:', error);
      });
  };

  return (
    <div className="cart-page">
      <div className="cart-container">
        <h2>Giỏ hàng</h2>
        <div>
          <Box
            className="cart-header"
            display="grid"
            gridTemplateColumns="repeat(11, 1fr)"
            gridAutoRows="140px"
            gap="20px"
            alignItems="center"
            justifyContent="center"
          >
            <Box gridColumn="span 1">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAllChange}
              />
            </Box>
            <Box gridColumn="span 4">
              <h3 className="item1">Sản phẩm</h3>
            </Box>
            <Box gridColumn="span 1">
            <h3>Phân loại</h3>
            </Box>
            <Box gridColumn="span 1">
            <h3>Số tiền</h3>
            </Box>
            <Box gridColumn="span 1">
              <h3>số lượng</h3>
            </Box>
            <Box gridColumn="span 2">
              <h3>Thành tiền</h3>
            </Box>
            <Box gridColumn="span 1">
              <h3>Xóa</h3>
            </Box>
          </Box>
          {cartItems ? (
            <div className="cart-items">
              {cartItems.map((item, index) => (
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
                  <Box gridColumn="span 1">
                    <input
                      type="checkbox"
                      checked={item.selected || false}
                      onChange={() => handleCheckboxChange(index)}
                    />
                  </Box>
                  <Box className="item1" gridColumn="span 1">
                    <img src={item.imageUrl} alt={item.productName} />
                  </Box>
                  <Box gridColumn="span 3" className="product-name">
                    {item.productName}
                  </Box>
                  <Box gridColumn="span 1">Loại:{item.sizeName}</Box>
                  <Box gridColumn="span 1">
                    Giá: {formatCurrency(item.price)}
                  </Box>
                  <Box gridColumn="span 1">
                    <input type="number" value={item.quantity} readOnly />
                  </Box>
                  <Box gridColumn="span 2">
                    {formatCurrency(item.subTotal)}Đ
                  </Box>
                  <Box gridColumn="span 1">
                    <button onClick={() => handleDeleteItem(index)}>
                      <DeleteIcon style={{ border: "none" }} />
                    </button>
                  </Box>
                </Box>
              ))}
            </div>
          ) : (
            <p>Đang tải thông tin sản phẩm...</p>
          )}

          <button onClick={handleDeleteSelectedItems}>
            <RemoveShoppingCartIcon/>
          </button>
        </div>
        <button
          onClick={handlePlaceOrder}
          style={{
            background: "#FF6C37",
            color: "#fff",
            position: "absolute",
            right: "20px",
            fontSize: "20px",
            borderRadius: "10px",
            width: "150px",
            height:  "40px",
            cursor: "pointer"
          }}
        >
          Đặt hàng
        </button>
      </div>
    </div>
  );
}

export default Cart;

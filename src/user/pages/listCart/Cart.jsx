import React, { useState, useEffect } from "react";
import "./Cart.css";
import axios from "axios";
import { useCartItemCount } from "../../service/CartItemCountContext";
import { useNavigate } from "react-router-dom";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const { cartItemCount, setCartItemCount } = useCartItemCount();
  const navigate = useNavigate();


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
            console.log('PRODUCT', product);
            const imageUrl = imageResponse.data[0]?.imageUrl || "";
            return { ...product, imageUrl };
          })
        );
        if (lastAddedCartItem) {
          processedProducts.forEach((cartItem, index) => {
            if(cartItem.id === lastAddedCartItem) {
              console.log('selectedLastItem', lastAddedCartItem, index);
              processedProducts[index].selected = true;
              console.log('ddddddđ',processedProducts);
              checkSelectAll(processedProducts);
              localStorage.removeItem('lastAddedCartItem');
            }
          });
        }
        setCartItems(processedProducts);
      } catch (error) {
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
      console.log('Đã xóa sản phẩm khỏi giỏ hàng:', response.data);
        updateCartItemCount();
        const newCartItems = [...cartItems];
        newCartItems.splice(index, 1);
        setCartItems(newCartItems);
      })
      .catch((error) => {
      console.error('Lỗi khi xóa sản phẩm khỏi giỏ hàng:', error);
      });
  };

  const checkSelectAll = (carts) => {
    if (carts.length) {
      console.log('11111');
      const indexes = carts.map((item, index) => {
        if (item.selected) {
          console.log('item', item);
          return index;
        }
      }).filter(index => index !== undefined);
      console.log('indexsss', indexes);
      if (indexes.length === cartItemCount) {
        console.log('aaaaind22984');
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
    console.log('đặt hàng');
    const userId = parseInt(localStorage.getItem("user_id"));
    const orderItems = cartItems.filter((item) => item.selected);
    console.log('userId', userId, orderItems);
  
    // Chuẩn hóa các đối tượng orderItem
    const normalizedOrderItems = orderItems.map(item => ({
      id: item.id,
      productId: item.productId,
      sizeId: item.sizeId,
      quantity: item.quantity,
      price: item.price,
      subTotal: item.subTotal,
      productName: item.productName,
      sizeName: item.sizeName
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
        console.log('cartItems', cartItems);
        setCartItems(cartItems.filter(item => !item.selected));
        updateCartItemCount();
        navigate(`/user/order`);
      })
      .catch(error => {
        console.error('Lỗi đặt hàng:', error);
      });
  };

  return (
    <div className="cart-page">
      <div className="cart-container">
        <h2>Giỏ hàng</h2>
        <div>
          <div className="cart-header">
            <input
              type="checkbox"
              checked={selectAll}
              onChange={handleSelectAllChange}
            />
            <h3 className="item1">Sản phẩm</h3>
            <h3>Tên sản phẩm</h3>
            <h3>Phân loại</h3>
            <h3>Số lượng</h3>
            <h3>Số tiền</h3>
            <h3>Xóa</h3>
          </div>

          <div className="cart-items">
            {cartItems.map((item, index) => (
              <div className="cart-item" key={index}>
                <input
                  type="checkbox"
                  checked={item.selected || false}
                  onChange={() => handleCheckboxChange(index)}
                />
                <div className="item1">
                  <img src={item.imageUrl} alt={item.productName} />
                </div>
                <p>{item.productName}</p>
                <p>{item.sizeName}</p>
                <p>Giá: {item.price}</p>
                <input type="number" value={item.quantity} readOnly />
                <p>{item.subTotal}</p>
                <button onClick={() => handleDeleteItem(index)}>Xóa</button>
              </div>
            ))}
          </div>
          <button onClick={handleDeleteSelectedItems}>
            Xóa các sản phẩm được chọn
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
          }}
        >
          Đặt hàng
        </button>
      </div>
    </div>
  );
}

export default Cart;

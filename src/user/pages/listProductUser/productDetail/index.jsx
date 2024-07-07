import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./productDetail.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper";
import { useCartItemCount } from "../../../service/CartItemCountContext";
import { useNavigate } from 'react-router-dom';
import Rating from '@mui/material/Rating';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

function ProductDetail() {
  const { id } = useParams();
  const [products, setProducts] = useState(null);
  const [productImages, setProductImages] = useState([]);
  const [productSizes, setProductSizes] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [quantitySold, setQuantitySold] = useState(0);
  const { cartItemCount, setCartItemCount } = useCartItemCount();
  const formatCurrency = (value) => {
    return value.toLocaleString('vi-VN', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };
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
    axios
      .get(`http://localhost:8004/product/${id}`)
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching products details:", error);
      });

    axios
      .get(`http://localhost:8004/product/image/${id}`)
      .then((response) => {
        setProductImages(response.data);
      })
      .catch((error) => {
        console.error("Error fetching products images:", error);
      });

    axios
      .get(`http://localhost:8004/product/size/${id}`)
      .then((response) => {
        setProductSizes(response.data);
      })
      .catch((error) => {
        console.error("Error fetching products sizes:", error);
      });

    axios
      .get(`http://localhost:8004/reviews/products/${id}`)
      .then((response) => {
        setReviews(response.data);
      })
      .catch((error) => {
        console.error("Error fetching product reviews:", error);
      });

    axios
      .get(`http://localhost:8004/product/${id}/quantitySold`)
      .then((response) => {
        setQuantitySold(response.data);
      })
      .catch((error) => {
        console.error("Error fetching quantity sold:", error);
      });
  }, [id]);

  if (!products) {
    return <div>Loading...</div>;
  }

  const handleAddToCartAndBuy = () => {
    const userId = parseInt(localStorage.getItem("user_id"));
    handleAddToCart();
    if (selectedSize && userId) {
      navigate(`/user/cart`);
    }
  };

  const handleAddToCart = () => {
    const userId = parseInt(localStorage.getItem("user_id"));
     if (!userId) {
      alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.");
      return;
    }
    if (!selectedSize) {
      alert("Vui lòng chọn size.");
    } else {
      const userId = parseInt(localStorage.getItem("user_id"));
      if (!userId) {
        alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.");
        return;
      }
      axios
        .post(
          `http://localhost:8004/cart/${userId}/add?productId=${products.product_id}&sizeId=${selectedSize}&quantity=${selectedQuantity}`
        )
        .then((response) => {
          response.data.cartItems.forEach(element => {
            if (element.sizeId === selectedSize) {
              localStorage.setItem("lastAddedCartItem", element.id);
            }
          });
          alert('Thêm sản phẩm vào giỏ hàng thành công');
          updateCartItemCount();
        })
        .catch((error) => {
          console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", error);
        });
    }
  };

  return (
    <div className="page-detail">
      <div className="products-contain">
        <div className="products-images">
          <Swiper
            pagination={{
              dynamicBullets: true,
            }}
            modules={[Pagination]}
            className="mySwiper"
          >
            {productImages.map((image) => (
              <SwiperSlide key={image.imageId}>
                <img
                  src={image.imageUrl}
                  alt={`Ảnh sản phẩm ${products.name}`}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="product_description">
          <h2 className="product_name">{products.name}</h2>
          <div className="product_reviews">
            <Rating
              name="read-only"
              value={products.averageRating || 0}
              precision={0.1}
              readOnly
            />
            <span style={{ marginLeft: "10px" }}>Đã bán: {quantitySold}</span>
          </div>
          <span
            style={{
              display: "block",
              color: "#D0011B",
              fontSize: "25px",
              marginTop: "30px",
              marginLeft: "45px",
            }}
          >
            {formatCurrency(products.price)} đ
          </span>
          <div className="sizesSelect">
            <h4>Chọn size:</h4>
            {productSizes.map((sizeproducts) => (
              <button
                className="button-size"
                key={sizeproducts.sizeId}
                onClick={() => setSelectedSize(sizeproducts.sizeId)}
                style={{
                  color:
                    selectedSize === sizeproducts.sizeId ? "#ffffff" : "#000",
                  backgroundColor:
                    selectedSize === sizeproducts.sizeId
                      ? "#EE4D2D"
                      : "transparent",
                }}
              >
                {sizeproducts.sizeName}
              </button>
            ))}
          </div>
          <div className="quanlitySelect">
            <h4>Số lượng:</h4>
            <input
              className="button-quantity"
              type="number"
              value={selectedQuantity}
              onChange={(e) => setSelectedQuantity(e.target.value)}
            />
          </div>
          <div style={{ marginTop: "20px", display: "flex" }}>
            <button className="addToCartButton" onClick={handleAddToCart}>
              <AddShoppingCartIcon />
              Thêm vào giỏ hàng
            </button>
            <button className="buyButton" onClick={handleAddToCartAndBuy}>
              Mua ngay
            </button>
          </div>
        </div>
      </div>
      <div style={{ marginTop: "20px" }}>
        <p style={{ fontWeight: "bold" }}>MÔ TẢ : </p>
        <p style={{ fontSize: "20px", marginTop: "5px" }}>
          {products.description}
        </p>
      </div>
      <div style={{ marginTop: "20px" }}>
        <p style={{ fontWeight: "bold" }}>ĐÁNH GIÁ :</p>
        <div className="total-reviews">
          <Rating
            name="read-only"
            value={products.averageRating || 0}
            precision={0.1}
            readOnly
          />
          <span> ({products.reviewCount || 0} đánh giá)</span>
        </div>
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <div key={review.id} className="item-review">
              <div style={{ display: "flex", alignItems: "center" }}>
                {index + 1}.
                <Rating value={review.rating} readOnly className="rating" />
              </div>
              <div className="comment">{review.comment}</div>
            </div>
          ))
        ) : (
          <p>Chưa có đánh giá nào.</p>
        )}
      </div>
    </div>
  );
}

export default ProductDetail;

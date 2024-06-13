import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Rating } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import './index.css';  // import CSS cho style

function ReviewProduct() {
  const { id, productId } = useParams();
  const [product, setProduct] = useState(null);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(-1);
  const [reviewText, setReviewText] = useState('');
  const navigate = useNavigate();
  const userId = parseInt(localStorage.getItem("user_id"));
  const formatCurrency = (value) => {
    return value.toLocaleString('vi-VN', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:8004/order/orderItem/${id}`);
        const imageResponse = await axios.get(`http://localhost:8004/product/image/${productId}?limit=1`);
        const imageUrl = imageResponse.data[0]?.imageUrl || "";
        console.log('dataaaa', response.data);
        console.log('idddd', productId);
        setProduct({ ...response.data, imageUrl });
      } catch (error) {
        console.error("Lỗi khi lấy thông tin sản phẩm:", error);
      }
    };

    fetchProduct();
  }, [id, productId]);

  const handleRatingChange = (event, newValue) => {
    setRating(newValue);
  };

  const handleHoverChange = (event, newHover) => {
    setHover(newHover);
  };

  const handleReviewTextChange = (event) => {
    setReviewText(event.target.value);
  };

  // const handleSubmit = async () => {
  //   try {
  //     await axios.post(`http://localhost:8004/reviews/products/${id}/${userId}`, {
  //       rating,
  //       comment: reviewText
  //     }, {
  //       params: {
  //         rating,
  //         comment: reviewText
  //       }
  //     });
  //     navigate('/user/order');
  //   } catch (error) {
  //     console.error("Lỗi khi gửi đánh giá:", error);
  //   }
  // };
  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8004/reviews/add/orderItem/${id}`,
        {
          rating,
          comment: reviewText
        },
        {
          params: {
            rating,
            comment: reviewText
          }
        }
      );
      // Assuming response.data contains the newly created review object if successful
      console.log("Review created:", response.data);
      navigate('/user/order');
    } catch (error) {
      console.error("Lỗi khi gửi đánh giá:", error);
    }
  };
  

  return (
    <div className="review-page">
        <Box sx={{ p: 3 }}>
      {product ? (
        <div className="cart-item">
          <div className="item1">
            <img src={product.imageUrl} alt={product.name} />
          </div>
          <p className="product-name">{product.name}</p>
          <p>{product.description}</p>
          <p>Giá: {formatCurrency(product.price)}</p>
          <p>Thành tiền: {formatCurrency(product.subTotal)}đ</p>

          <Rating
            name="hover-feedback"
            value={rating}
            precision={1}
            onChange={handleRatingChange}
            onChangeActive={handleHoverChange}
          />
          {rating !== null && <Box sx={{ ml: 2 }}>{hover !== -1 ? hover : rating}</Box>}
          
          <TextField
            label="Viết đánh giá"
            multiline
            rows={4}
            value={reviewText}
            onChange={handleReviewTextChange}
            variant="outlined"
            fullWidth
            margin="normal"
          />

          <Button variant="contained" color="primary" onClick={handleSubmit}>Gửi Đánh Giá</Button>
        </div>
      ) : (
        <p>Đang tải thông tin sản phẩm...</p>
      )}
    </Box>
    </div>
    
  );
}

export default ReviewProduct;

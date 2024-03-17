import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./productDetail.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper";

function ProductDetail() {
  const { id } = useParams();
  const [shoe, setshoe] = React.useState(null);
  const [shoeImages, setShoeImages] = useState([]);
  const [shoeSizes, setShoeSizes] = useState([]);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [availableQuantity, setAvailableQuantity] = useState(0);

  React.useEffect(() => {
    axios
      .get(`http://localhost:8004/product/${id}`)
      .then((response) => {
        setshoe(response.data);
      })
      .catch((error) => {
        console.error("Error fetching shoe details:", error);
      });
    axios
      .get(`http://localhost:8004/product/image/${id}`)
      .then((response) => {
        setShoeImages(response.data);
      })
      .catch((error) => {
        console.error("Error fetching shoe images:", error);
      });
    axios
      .get(`http://localhost:8004/product/size/${id}`)
      .then((response) => {
        
        setShoeSizes(response.data);
        console.log('shoe', shoeSizes);
      })
      .catch((error) => {
        console.error("Error fetching shoe sizes:", error);
      });
  }, [id, shoe]);
//   React.useEffect(() => {
//     if (selectedColor && selectedSize) {
//       // Calculate available quantity based on selected color and size
//       const selectedSizeObj = shoeSizes.find(
//         (size) => size.mauSac === selectedColor && size.size === selectedSize
//       );
//       if (selectedSizeObj) {
//         setAvailableQuantity(selectedSizeObj.soLuong);
//       } else {
//         setAvailableQuantity(0);
//       }
//     }
//   }, [selectedColor, selectedSize, shoeSizes]);

  if (!shoe) {
    return <div>Loading...</div>;
  }

  return (
    <div className="page-detail-giay">
      <div className="shoe-contain">
        <div className="shoe-images">
          <Swiper
            pagination={{
              dynamicBullets: true,
            }}
            modules={[Pagination]}
            className="mySwiper"
          >
            {shoeImages.map((image) => (
              <SwiperSlide>
                <img
                  key={image.imageId}
                  src={image.imageUrl}
                  alt={`Ảnh giày ${shoe.name}`}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="Mo_ta_giay">
          <h2>{shoe.name}</h2>
          <span
            style={{
              display: "block",
              color: "#D0011B",
              fontSize: "25px",
              marginTop: "20px",
              marginLeft: "20px",
            }}
          >
            {shoe.price} đ
          </span>
          <div>
            <p>Sizes:</p>
            {shoeSizes.forEach((size) => (
                 <button
                    key={size.sizeId}
                    // onClick={() => setSelectedSize(size.size)}
                    style={{width:'200px',height:'50px', color:'#EE4D2D', borderColor:'red',marginRight:'20px', fontSize:'20px'}}
               >
                 {size.sizeName}
               </button>
            ))
            }
          </div>
          <div style={{marginTop:'150px'}}>
            <button style={{width:'200px',height:'50px', color:'#EE4D2D', borderColor:'red',marginRight:'20px', fontSize:'20px'}}>Thêm vào giỏ hàng</button>
            <button  style={{width:'200px',height:'50px', color:'#ffffff', borderColor:'#ffffff',backgroundColor:'#EE4D2D',marginRight:'20px', fontSize:'20px'}}>Mua ngay</button>
          </div>
          
        </div>
      </div>
      <div style={{ marginTop: "20px" }}>
        <p style={{ fontWeight: "bold" }}>MÔ TẢ : </p>
        <p style={{ fontSize: "20px", marginTop: "5px" }}>{shoe.description}</p>
      </div>
    </div>
  );
}
export default ProductDetail;

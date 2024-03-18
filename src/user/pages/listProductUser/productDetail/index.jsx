import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./productDetail.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper";

function ProductDetail() {
  const { id } = useParams();
  const [products, setProducts] = React.useState(null);
  const [productImages, setProductImages] = useState([]);
  const [productSizes, setProductSizes] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [availableQuantity, setAvailableQuantity] = useState(0);

  React.useEffect(() => {
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
        console.log('products', productSizes);
      })
      .catch((error) => {
        console.error("Error fetching products sizes:", error);
      });
    }, [id, products]);

  if (!products) {
    return <div>Loading...</div>;
  }

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
              <SwiperSlide>
                <img
                  key={image.imageId}
                  src={image.imageUrl}
                  alt={`Ảnh sản phẩm ${products.name}`}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="product_description">
          <h2>{products.name}</h2>
          <span
            style={{
              display: "block",
              color: "#D0011B",
              fontSize: "25px",
              marginTop: "20px",
              marginLeft: "20px",
            }}
          >
            {products.price} đ
          </span>
          <div>
            <h4>Sizes:</h4>
            {productSizes.map((sizeproducts) => (
              <button
                  key={sizeproducts.sizeId}
                  //onClick={() => setSelectedSize(sizeproducts.size)}
                  style={{
                      width: '200px',
                      height: '50px',
                      color: '#EE4D2D',
                      borderColor: 'red',
                      marginRight: '20px',
                      fontSize: '20px'
                  }}
              >
                  {sizeproducts.sizeName}
              </button>
          ))}
          </div>
          <div style={{marginTop:'150px'}}>
            <button style={{width:'200px',height:'50px', color:'#EE4D2D', borderColor:'red',marginRight:'20px', fontSize:'20px'}}>Thêm vào giỏ hàng</button>
            <button  style={{width:'200px',height:'50px', color:'#ffffff', borderColor:'#ffffff',backgroundColor:'#EE4D2D',marginRight:'20px', fontSize:'20px'}}>Mua ngay</button>
          </div>
          
        </div>
      </div>
      <div style={{ marginTop: "20px" }}>
        <p style={{ fontWeight: "bold" }}>MÔ TẢ : </p>
        <p style={{ fontSize: "20px", marginTop: "5px" }}>{products.description}</p>
      </div>
    </div>
  );
}
export default ProductDetail;

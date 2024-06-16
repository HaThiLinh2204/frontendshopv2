import "./HomePage.css";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination, FreeMode } from "swiper";
import "swiper/css/free-mode";
import "swiper/swiper.min.css";

export default function HomePage() {
  const [newProducts, setNewProducts] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8004/products")
      .then((response) => {
        const products = response.data;
        const sortedProducts = products.sort(
          (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
        );
        const topNewProducts = sortedProducts.slice(0, 10);

        const fetchImages = topNewProducts.map((product) =>
          axios
            .get(`http://localhost:8004/product/image/${product.product_id}?limit=1`)
            .then((imgResponse) => {
              product.imageUrl = imgResponse.data[0]?.imageUrl || "";
              return product;
            })
        );

        Promise.all(fetchImages).then((productsWithImages) => {
          setNewProducts(productsWithImages);
        });
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);
  return (
    <div className="homepage-contaner">
      <div className="main">
        <div className="slider-main">
          <Swiper
            slidesPerView={2}
           spaceBetween={30}
            loop={true}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
            }}
            navigation={true}
           modules={[Autoplay, Pagination, Navigation]}
            className="mySwiper"
          >
            <SwiperSlide>
              <img
                style={{width: "100%", height: "60vh", objectFit: "scale-down"}}
                src="https://down-vn.img.susercontent.com/file/sg-11134201-7rbn6-lpqanxanipw0e6"
                alt=""
              />
            </SwiperSlide>
            <SwiperSlide>
              <img
                style={{ width: "100%", height: "60vh", objectFit: "scale-down" }}
                src="https://down-vn.img.susercontent.com/file/sg-11134201-7qvef-lk0t3f9t0fma03"
                alt=""
              />
            </SwiperSlide>
            <SwiperSlide>
              <img
                style={{ width: "100%", height: "60vh", objectFit: "scale-down" }}
                src="https://down-vn.img.susercontent.com/file/sg-11134201-7rcee-lss3e3uhvgzy92"
                alt=""
              />
            </SwiperSlide>
            <SwiperSlide>
              <img
                style={{ width: "100%", height: "60vh", objectFit: "scale-down" }}
                src="https://down-vn.img.susercontent.com/file/sg-11134201-7rbl8-lntq8annbhmtc3"
                alt=""
              />
            </SwiperSlide>
          </Swiper>
        </div>
        <div className="container-item" id="sanphammoi">
          <div className="item-title">SẢN PHẨM MỚI</div>
          <div className="container">
            <div className="">
              <Swiper
                slidesPerView={4}
                spaceBetween={30}
                freeMode={true}
                pagination={{
                  clickable: true,
                }}
                navigation={{
                  nextEl: ".swiper-button-next",
                  prevEl: ".swiper-button-prev",
                }}
                modules={[FreeMode, Pagination]}
                className="mySwiper"
              >
                {newProducts.map((product) => (
                  <SwiperSlide key={product.product_id}>
                    <Link to={`/user/products/${product.product_id}`}>
                      <img style={{ width: "300px", height: "300px" }} src={product.imageUrl} alt={product.name} />
                    </Link>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
        <div className="container-item" id="blog">
          <div className="item-title">FURLA'S BLOG</div>
          <div className="item-title-detail">
            ĐÓN ĐẦU XU HƯỚNG, ĐỊNH HÌNH PHONG CÁCH
          </div>
          <div className="container">
            <Swiper
              slidesPerView={3}
              spaceBetween={30}
              freeMode={true}
              pagination={{
                clickable: true,
              }}
              modules={[FreeMode, Pagination]}
              className="mySwiper"
            >
              <SwiperSlide>
                <img
                  src="https://file.hstatic.net/200000182297/article/web_6fb6ad7b835f456aba636f2a29c0eaf8_large.jpg"
                  alt=""
                />
              </SwiperSlide>
              <SwiperSlide>
                <img
                  src="https://file.hstatic.net/200000182297/article/278773775_2415192895285264_2361528904623727306_n_e5175a3f6a4b4781b74421a84641fa90_large.jpg"
                  alt=""
                />
              </SwiperSlide>
              <SwiperSlide>
                <img
                  src="https://file.hstatic.net/200000182297/article/277792773_2405871579550729_300161647078595887_n_94aacacb7a204191a62d1baf91d110c4_large.jpg"
                  alt=""
                />
              </SwiperSlide>
              <SwiperSlide>
                <img
                  src="https://file.hstatic.net/200000182297/article/270790785_2325991570872064_3732375015176452639_n_e0a8a768f6494c68b29ffde935fec684_large.jpg"
                  alt=""
                />
              </SwiperSlide>
            </Swiper>
          </div>
        </div>
      </div>
    </div>
  );
}

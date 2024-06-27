import React, { useState, useEffect } from "react";
import "./index.css";
import axios from "axios";
import { Link } from "react-router-dom";
import { Box, IconButton } from "@mui/material";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";

import {removeDiacritics} from "../../../service/utils/utils.js";

function HandBagList() {
    const [products, setProducts] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const formatCurrency = (value) => {
        return value.toLocaleString('vi-VN', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
      };
    useEffect(() => {
        console.log('kkkkkk');
      const fetchProducts = async () => {
        try {
          const response = await axios.get("http://localhost:8004/products/handbag");
          const processedProducts = await Promise.all(
            response.data.map(async (handbag) => {
              const imageResponse = await axios.get(
                `http://localhost:8004/product/image/${handbag.product_id}?limit=1`
              );
              const imageUrl = imageResponse.data[0]?.imageUrl || "";
              return { ...handbag, imageUrl };
            })
          );
          console.log('wwwww', processedProducts);
          setProducts(processedProducts);
        } catch (error) {
          console.error("Error fetching products:", error);
        }
      };
  
      fetchProducts();
    }, []);
  
    const handleSearchChange = (event) => {
      setSearchKeyword(event.target.value);
    };
  
    const handleMinPriceChange = (event) => {
      setMinPrice(event.target.value);
    };
  
    const handleMaxPriceChange = (event) => {
      setMaxPrice(event.target.value);
    };
    const filteredproducts = products.filter((handbag) => {
        console.log('products', products);
      const handbagPrice = parseInt(handbag.saleprice);
      if (minPrice && maxPrice) {
        return (
            handbagPrice >= parseInt(minPrice) &&
            handbagPrice <= parseInt(maxPrice) &&
          removeDiacritics(handbag.name.toLowerCase()).includes(
            removeDiacritics(searchKeyword.toLowerCase())
          )
        );
      } else if (minPrice) {
        return (
            handbagPrice >= parseInt(minPrice) &&
          removeDiacritics(handbag.name.toLowerCase()).includes(
            removeDiacritics(searchKeyword.toLowerCase())
          )
        );
      } else if (maxPrice) {
        return (
            handbagPrice <= parseInt(maxPrice) &&
          removeDiacritics(handbag.name.toLowerCase()).includes(
            removeDiacritics(searchKeyword.toLowerCase())
          )
        );
      }
      return removeDiacritics(handbag.name.toLowerCase()).includes(
        removeDiacritics(searchKeyword.toLowerCase())
      );
    });

    return (
      <div className="handBag-list">
        <div className="navbar-filter">
          <div className="filter">
            <div className="navbar-filter-item1">
              <button type="submit" className="button-search">
                <SearchIcon />
              </button>
              <InputBase
                className="search-box"
                value={searchKeyword}
                onChange={handleSearchChange}
                placeholder="Nhập từ khóa để tìm kiếm"
              />
            </div>
            <div className="navbar-filter-item2">
              <label style={{ fontSize: "20px", fontWeight: "bold" }}>
                {" "}
                Khoảng giá:
              </label>
              <input
                type="number"
                placeholder="Từ"
                value={minPrice}
                onChange={handleMinPriceChange}
              />
              -
              <input
                type="number"
                placeholder="Đến"
                value={maxPrice}
                onChange={handleMaxPriceChange}
              />
            </div>
          </div>
          <div className="result-count" style={{ textAlign: "right" }}>
            {filteredproducts.length} kết quả được tìm thấy
          </div>
        </div>

        <div className="container-page">
          {filteredproducts.map((handbag) => (
            <div className="container-item" key={handbag.product_id}>
              <Link to={`/user/products/${handbag.product_id}`}>
                <div className="item-img">
                  <img
                    src={handbag.imageUrl}
                    alt={`Ảnh của giày ${handbag.name}`}
                  />
                </div>
                <div className="item-information">
                  <div className="item-name">{handbag.name}</div>
                  <div className="item-price">
                    {formatCurrency(handbag.saleprice)}đ
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    );
}
export default HandBagList;
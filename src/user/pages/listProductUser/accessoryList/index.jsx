import React, { useState, useEffect } from "react";
import "./index.css";
import axios from "axios";
import { Link } from "react-router-dom";
import { Box, IconButton } from "@mui/material";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import { removeDiacritics } from "../../../service/utils/utils.js";

function AccessoryList() {

    const [products, setProducts] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const formatCurrency = (value) => {
      return value.toLocaleString('vi-VN', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    };
    useEffect(() => {
      const fetchProducts = async () => {
        try {
          const response = await axios.get("http://localhost:8004/products/accessory");
          const processedProducts = await Promise.all(
            response.data.map(async (accessory) => {
              const imageResponse = await axios.get(
                `http://localhost:8004/product/image/${accessory.product_id}?limit=1`
              );
              const imageUrl = imageResponse.data[0]?.imageUrl || "";
              return { ...accessory, imageUrl };
            })
          );
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
    const filteredproducts = products.filter((accessory) => {
        console.log('products', products);
      const accessoryPrice = parseInt(accessory.saleprice);
      if (minPrice && maxPrice) {
        return (
            accessoryPrice >= parseInt(minPrice) &&
            accessoryPrice <= parseInt(maxPrice) &&
          removeDiacritics(accessory.name.toLowerCase()).includes(
            removeDiacritics(searchKeyword.toLowerCase())
          )
        );
      } else if (minPrice) {
        return (
            accessoryPrice >= parseInt(minPrice) &&
          removeDiacritics(accessory.name.toLowerCase()).includes(
            removeDiacritics(searchKeyword.toLowerCase())
          )
        );
      } else if (maxPrice) {
        return (
            accessoryPrice <= parseInt(maxPrice) &&
          removeDiacritics(accessory.name.toLowerCase()).includes(
            removeDiacritics(searchKeyword.toLowerCase())
          )
        );
      }
      return removeDiacritics(accessory.name.toLowerCase()).includes(
        removeDiacritics(searchKeyword.toLowerCase())
      );
    });

    return (
      <div className="accessory-list">
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
          {filteredproducts.map((accessory) => (
            <div className="container-item" key={accessory.product_id}>
              <Link to={`/user/products/${accessory.product_id}`}>
                <div className="item-img">
                  <img
                    src={accessory.imageUrl}
                    alt={`Ảnh của giày ${accessory.name}`}
                  />
                </div>
                <div className="item-information">
                  <div className="item-name">{accessory.name}</div>
                  <div className="item-price">
                    {formatCurrency(accessory.saleprice)}đ
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    );
}
export default AccessoryList;

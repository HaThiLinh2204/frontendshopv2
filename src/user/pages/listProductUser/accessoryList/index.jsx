import React, { useState, useEffect } from "react";
import "./index.css";
import axios from "axios";
import { Link } from "react-router-dom";
import { Box, IconButton } from "@mui/material";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";

import { removeDiacritics } from "D:/gr2/frontend2/frontendshopv2/src/user/service/utils/utils.js";

function AccessoryList() {

    const [products, setProducts] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    useEffect(() => {
        console.log('kkkkkk');
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
    const filteredproducts = products.filter((accessory) => {
        console.log('products', products);
      const accessoryPrice = parseInt(accessory.price);
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
        <div className = "accessory-list">
             <div className="navbar-filter">
            <div className="navbar-filter-item1">
              {/* <button type="submit" className="button-search">
                Search
              </button> */}

              <Box
                display="flex"
                backgroundColor="#F0F0F0"
                borderRadius="3px"
              >
                <button type="submit" sx={{ p: 1 }} className = "button-search">
                  <SearchIcon />
                </button>
                <InputBase 
                  className="search-box"
                  sx={{ ml: 2, flex: 1 }}
                  value={searchKeyword}
                  onChange={handleSearchChange}
                  placeholder="Tìm kiếm giày.." />
              </Box>
            </div>
            <div className="navbar-filter-item2">
              <label style={{ fontSize: "20px", fontWeight: "bold" }}>
                {" "}
                Khoảng giá:
              </label>
              <input
                type="number"
                placeholder="đ TỪ"
                value={minPrice}
                onChange={handleMinPriceChange}
              />
              -
              <input
                type="number"
                placeholder="đ ĐẾN"
                value={maxPrice}
                onChange={handleMaxPriceChange}
              />
            </div>
          </div>
          <div className="result-count" style={{ textAlign: "right" }}>
            {filteredproducts.length} kết quả được tìm thấy
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
                    <div className="item-price">{accessory.price}đ</div>
                    {/* <button class="buy-item-button">
                      <span class="item-button">Mua hàng</span>
                    </button> */}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
    )
}
export default AccessoryList;
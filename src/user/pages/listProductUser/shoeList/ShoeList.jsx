import React, { useState, useEffect } from "react";
import "./ShoeList.css";
import axios from "axios";
import { Link } from "react-router-dom";
import { Box, IconButton } from "@mui/material";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";

import { removeDiacritics } from "D:/gr2/frontend2/frontendshopv2/src/user/service/utils/utils.js";
function ShoeList() {
  const [products, setProducts] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8004/products/shoe");
        const processedProducts = await Promise.all(
          response.data.map(async (shoe) => {
            const imageResponse = await axios.get(
              `http://localhost:8004/product/image/${shoe.product_id}?limit=1`
            );
            const imageUrl = imageResponse.data[0]?.imageUrl || "";
            return { ...shoe, imageUrl };
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
  const filteredproducts = products.filter((shoe) => {
    const shoePrice = parseInt(shoe.price);
    if (minPrice && maxPrice) {
      return (
        shoePrice >= parseInt(minPrice) &&
        shoePrice <= parseInt(maxPrice) &&
        removeDiacritics(shoe.name.toLowerCase()).includes(
          removeDiacritics(searchKeyword.toLowerCase())
        )
      );
    } else if (minPrice) {
      return (
        shoePrice >= parseInt(minPrice) &&
        removeDiacritics(shoe.name.toLowerCase()).includes(
          removeDiacritics(searchKeyword.toLowerCase())
        )
      );
    } else if (maxPrice) {
      return (
        shoePrice <= parseInt(maxPrice) &&
        removeDiacritics(shoe.name.toLowerCase()).includes(
          removeDiacritics(searchKeyword.toLowerCase())
        )
      );
    }
    return removeDiacritics(shoe.name.toLowerCase()).includes(
      removeDiacritics(searchKeyword.toLowerCase())
    );
  });
  return (
    <>
      <div className="shoe-list">
        <div className="container-main">
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

              {/* <button type="submit" class="button-search">
                search
              </button>
              <input
                type="text"
                placeholder="Tìm kiếm giày..."
                value={searchKeyword}
                onChange={handleSearchChange}
                className="search-box"
              /> */}
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
            {filteredproducts.map((shoe) => (
              <div className="container-item" key={shoe.product_id}>
                <Link to={`/user/products/${shoe.product_id}`}>
                  <div className="item-img">
                    <img
                      src={shoe.imageUrl}
                      alt={`Ảnh của giày ${shoe.name}`}
                    />
                  </div>
                  <div className="item-information">
                    <div className="item-name">{shoe.name}</div>
                    <div className="item-price">{shoe.price}đ</div>
                    {/* <button class="buy-item-button">
                      <span class="item-button">Mua hàng</span>
                    </button> */}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
export default ShoeList;

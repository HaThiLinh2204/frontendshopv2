import React, { useState, useEffect } from "react";
import "./ShoeList.css";
import axios from "axios";
import { Link } from "react-router-dom";

import { removeDiacritics } from "D:/gr2/frontend2/frontendshopv2/src/service/utils/utils.js";
function ShoeList() {
  const [shoes, setShoes] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  useEffect(() => {
    const fetchShoes = async () => {
      try {
        const response = await axios.get('http://localhost:8004/products/shoe');
        const processedShoes = await Promise.all(
          response.data.map(async (shoe) => {
            const imageResponse = await axios.get(`http://localhost:8004/product/image/${shoe.product_id}?limit=1`);
            const imageUrl = imageResponse.data[0]?.imageUrl || '';
            return { ...shoe, imageUrl };
          })
        );
        setShoes(processedShoes);
      } catch (error) {
        console.error('Error fetching shoes:', error);
      }
    };

    fetchShoes();
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
  const filteredShoes = shoes.filter((shoe) => {
    const shoePrice = parseInt(shoe.price);
    if (minPrice && maxPrice) {
      return (
        shoePrice >= parseInt(minPrice) &&
        shoePrice <= parseInt(maxPrice) &&
        removeDiacritics(shoe.name.toLowerCase()).includes(
          removeDiacritics(searchKeyword.toLowerCase())
        )
      );
    }
    else if (minPrice) {
      return (
        shoePrice >= parseInt(minPrice) &&
        removeDiacritics(shoe.name.toLowerCase()).includes(
          removeDiacritics(searchKeyword.toLowerCase())
        )
      );
    }
    else if (maxPrice) {
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
      <div className="page-giay">
        <div className="container-main">
          <div className="navbar-filter">
            <div className="navbar-filter-item1">
              <input
                type="text"
                placeholder="Tìm kiếm giày..."
                value={searchKeyword}
                onChange={handleSearchChange}
                className="search-box"
              />
              <button type="submit" className="button-search">
                Search
              </button>
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
            {filteredShoes.length} kết quả được tìm thấy
          </div>
          <div className="container-page">
            {filteredShoes.map((shoe) => (
              <div className="container-item" key={shoe.product_id}>
                <Link to={`/products/${shoe.product_id}`}>
                    <img
                      src={shoe.imageUrl}
                      alt={`Ảnh của giày ${shoe.name}`}
                    />

                  <div className="item-name">{shoe.name}</div>
                  <div className="item-price">{shoe.price}đ</div>
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

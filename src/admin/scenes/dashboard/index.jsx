import React, { useEffect, useState } from 'react';
import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import axios from 'axios';
import Header from '../../components/Header';
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import RollerSkatingIcon from '@mui/icons-material/RollerSkating';
import EmailIcon from "@mui/icons-material/Email";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrafficIcon from "@mui/icons-material/Traffic";
import StatBox from '../../components/StatBox';
import LineChart from '../../components/LineChart';
import ProgressCircle from '../../components/ProgressCircle';
import BarChart from '../../components/BarChart';
import PieChart from '../../components/PieChart';


const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [allQuantitySold, setAllQuantitySold] = useState(0);
  const [allRemainQuantity, setAllRemainQuantity] = useState(0);
  const [allPrincipalAmount, setAllPrincipalAmount] = useState(0);
  const [allMoneySold, setAllMoneySold] = useState(0);
  const [statisticsByShoes, setStatisticsByShoes] = useState([]);
  const [statisticsByClothes, setStatisticsByClothes] = useState([]);
  const [statisticsByAccessory, setStatisticsByAccessory] = useState([]);
  const [statisticsByHandBags, setStatisticsByHandBags] = useState([]);
  const [data, setData] = useState([]);
  const [topSoldProducts, setTopSoldProducts] = useState([]);
  const [revenueByDay, setRevenueByDay] = useState(0.0);
  const [quantityOrder, setQuantityOrder] = useState(0);
  const formatCurrency = (value) => {
    return value.toLocaleString('vi-VN', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const productsResponse = await axios.get("http://localhost:8004/products");
        const products = productsResponse.data;
        const productPromises = products.map(async (product) => {
          const quantitySoldResponse = await axios.get(`http://localhost:8004/product/${product.product_id}/quantitySold`);
          return {
            ...product,
            quantitySold: quantitySoldResponse.data,
          };
        });

        const productsWithQuantitySold = await Promise.all(productPromises);
        const sortedProducts = productsWithQuantitySold.sort((a, b) => b.quantitySold - a.quantitySold);
        const top10Products = sortedProducts.slice(0, 6);
        setTopSoldProducts(top10Products);
      } catch (error) {
        console.error("Error fetching products or quantity sold", error);
      }
    };

    fetchAllProducts();
  }, []);

  useEffect(() => {
    const getTodaysRevenueAsync = async () => {
      const today = new Date();
      // Chuyển đổi thành chuỗi ISO và lấy phần ngày
      const formattedDate = today.toISOString().split('T')[0];
  
      try {
        const response = await fetch(`http://localhost:8004/business-metrics/1/revenue/day?date=${formattedDate}`);
        if (!response.ok) {
          throw new Error(`Lỗi khi lấy doanh thu: ${response.statusText}`);
        }
  
        const revenueData = await response.json();
        setRevenueByDay(revenueData);
        console.log('Ngày UTC:', formattedDate, 'Dữ liệu doanh thu:', revenueData);
      } catch (error) {
        console.error("Lỗi:", error);
      }
    };
  
    getTodaysRevenueAsync();
  }, []);
  
  useEffect(() => {
    const fetchTotalOrderItems = async () => {
      try {
        const response = await fetch('http://localhost:8004/order/totalOrderItems');
        if (response.ok) {
          const data = await response.json();
          setQuantityOrder(data);
          console.log('aaaa', data);
        } else {
          console.error('Failed to fetch total order items');
        }
      } catch (error) {
        console.error('Error fetching total order items:', error);
      }
  };
  fetchTotalOrderItems();
},[]);

  useEffect(() => {
    const fetchDataByCategory = async (category) => {
      try {
        const [
          totalProductsResponse,
          totalQuantityResponse,
          totalSoldQuanlityResponse] = await axios.all([
            axios.get(`http://localhost:8004/product/${category}/totalItems`),
            axios.get(`http://localhost:8004/product/${category}/totalQuantity`),
            axios.get(`http://localhost:8004/product/${category}/totalSold`)
          ]);
          if (category === 'shoe') {
            setStatisticsByShoes([
              totalProductsResponse.data,
              totalQuantityResponse.data,
              totalSoldQuanlityResponse.data,
            ]);
          }
          else if (category === 'handbag') {
            setStatisticsByHandBags([
              totalProductsResponse.data,
              totalQuantityResponse.data,
              totalSoldQuanlityResponse.data,
            ]);
          }
          else if (category === 'accessory') {
            setStatisticsByAccessory([
              totalProductsResponse.data,
              totalQuantityResponse.data,
              totalSoldQuanlityResponse.data,
            ]);
          }
          else {
            setStatisticsByClothes([totalProductsResponse.data, totalQuantityResponse.data, totalSoldQuanlityResponse.data]);
          }
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    const fetchAllData = async () => {
      try {
        const [ totalProductsResponse,
                totalQuantityResponse,
                allQuantitySoldResponse,
                allRemainQuantityResponse,
                allPrincipalAmountResponse,
                allMoneySoldResponse] = await axios.all([
          axios.get("http://localhost:8004/products/total"),
          axios.get("http://localhost:8004/product/getAllTotalQuantity"),
          axios.get("http://localhost:8004/product/getAllQuantitySold"),
          axios.get("http://localhost:8004/product/getAllRemainQuantity"),
          axios.get("http://localhost:8004/product/getAllPrincipalAmount"),
          axios.get("http://localhost:8004/product/getAllMoneySold")
        ]);

        setTotalProducts(totalProductsResponse.data);
        setTotalQuantity(totalQuantityResponse.data);
        setAllQuantitySold(allQuantitySoldResponse.data);
        setAllRemainQuantity(allRemainQuantityResponse.data);
        setAllPrincipalAmount(allPrincipalAmountResponse.data);
        setAllMoneySold(allMoneySoldResponse.data);
      }catch (error) {
        console.error("Error fetching data", error);
      }
    }

    fetchAllData();
    fetchDataByCategory('shoe');
    fetchDataByCategory('accessory');
    fetchDataByCategory('handbag');
    fetchDataByCategory('clothes');
   
  }, []);

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Trang chủ" subtitle="Chào mừng tới trang quản lý" />
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(11, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection = "column"
          borderRadius = "20px"
        > 
          <div style = {{fontSize: "20px"}}>Tổng mặt hàng </div>
          <div style = {{fontSize: "20px"}}>{totalProducts}</div>
          <div>{totalQuantity} sản phẩm</div>
        </Box>
        <Box
          gridColumn="span 2"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection = "column"
          borderRadius = "20px"
        > 
          <div style = {{fontSize: "20px"}}>Giày </div>
          <div style = {{fontSize: "20px"}}>{statisticsByShoes[0]}</div>
          <div>{(statisticsByShoes[1] - statisticsByShoes[2])} sản phẩm</div>
        </Box>
        <Box
          gridColumn="span 2"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection = "column"
          borderRadius = "20px"
        > 
          <div style = {{fontSize: "20px"}}>Quần áo </div>
          <div style = {{fontSize: "20px"}}>{statisticsByClothes[0]}</div>
          <div>{(statisticsByClothes[1]-statisticsByClothes[2])} sản phẩm</div>
        </Box>
        <Box
          gridColumn="span 2"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection = "column"
          borderRadius = "20px"
        > 
          <div style = {{fontSize: "20px"}}>Túi xách</div>
          <div style = {{fontSize: "20px"}}>{statisticsByHandBags[0]}</div>
          <div>{(statisticsByHandBags[1] - statisticsByHandBags[2])} sản phẩm</div>
        </Box>
        <Box
          gridColumn="span 2"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection = "column"
          borderRadius = "20px"
        > 
          <div style = {{fontSize: "20px"}}>Phụ kiện </div>
          <div style = {{fontSize: "20px"}}>{statisticsByAccessory[0]}</div>
          <div>{(statisticsByAccessory[1]-statisticsByAccessory[2])} sản phẩm</div>
          
        </Box>
        {/* ROW 2 */}
        <Box  gridColumn="span 7" gridRow="span 3">
          <div style = {{fontWeight: "600"}}>THỐNG KÊ SỐ LƯỢNG SẢN PHẨM ĐÃ BÁN</div>
          <PieChart />
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 3"
          backgroundColor={colors.primary[400]}
          overflow="auto"
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[500]}`}
            colors={colors.grey[100]}
            p="15px"
          >
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
              TOP 6 SẢN PHẨM BÁN CHẠY NHẤT
            </Typography>
          </Box>
          {topSoldProducts.map((product, i) => (
            <Box
              key={product.product_id}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`4px solid ${colors.primary[500]}`}
              p="15px"
            >
              <Box>
                <Typography
                  color={colors.greenAccent[500]}
                  variant="h5"
                  fontWeight="400"
                >
                  {i+1}. {product.name}
                </Typography>
              </Box>
              <Box
                backgroundColor={colors.greenAccent[500]}
                p="5px 10px"
                borderRadius="4px"
              >
                {product.quantitySold}
              </Box>
            </Box>
          ))}
        </Box>
        
        
        {/* ROW 3 */}
        <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Box
            mt="25px"
            p="0 30px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="600"
                color={colors.grey[100]}
              >
                Thống kê doanh thu 6 tháng gần đây nhất theo danh mục
              </Typography>
            </Box>
          </Box>
          <Box height="250px" m="-20px 0 0 0">
            <LineChart isDashboard={true} dataType={"monthAndCategory"} />
          </Box>
        </Box>
       

        {/* ROW 3 */}
        <Box
          gridColumn="span 3"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          p="30px"
        >
          <Typography variant="h5" fontWeight="600">
            PHẦN TRĂM THU HỒI VỐN
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            mt="25px"
          >
            <Typography
              variant="h5"
              color={colors.greenAccent[500]}
              sx={{ mt: "15px" }}
            >
              Tổng đơn hàng thành công: {quantityOrder} đơn
            </Typography>
            <Typography
              variant="h5"
              color={colors.greenAccent[500]}
              sx={{ mt: "15px" }}
            >
              Tổng doanh thu: {formatCurrency(allMoneySold)} Đ
            </Typography>
            <Typography
              variant="h5"
              color={colors.greenAccent[500]}
              sx={{ mt: "15px" }}
            >
              Tổng tiền vốn: {formatCurrency(allPrincipalAmount)} Đ
            </Typography>
            <Typography 
              variant="h5"
              sx={{ mt: "15px" }}
              >Phần trăm thu hồi vốn khoảng: {formatCurrency(allMoneySold/allPrincipalAmount*100)}%
            </Typography> 
          </Box>
        </Box>
        <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Box
            mt="25px"
            p="0 30px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="600"
                color={colors.grey[100]}
              >
                Thống kê tổng doanh thu 6 tháng gần đây nhất
              </Typography>
              <Typography
                variant="h4"
                fontWeight="bold"
                color={colors.greenAccent[500]}
              >
                {formatCurrency(allMoneySold)} Đ
              </Typography>
            </Box>
          </Box>
          <Box height="250px" m="-20px 0 0 0">
            <LineChart isDashboard={true} dataType={"month"} />
          </Box>
        </Box>
      </Box>
      
    </Box>
  );
};

export default Dashboard;

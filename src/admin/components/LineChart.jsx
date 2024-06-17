import { ResponsiveLine } from "@nivo/line";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LineChart = ({ isCustomLineColors = false, isDashboard = false, dataType }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [lineData, setLineData] = useState([]);
  const businessMetricsId = 1; 
  const categories = ['SHOE', 'CLOTHES', 'HANDBAG', 'ACCESSORY'];

  function getLastSixMonths() {
    const months = [];
    const today = new Date();
    for (let i = 0; i < 6; i++) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      months.push({
        month: date.getMonth() + 1,
        year: date.getFullYear()
      });
    }
    return months.reverse();
  };

  async function getRevenueByCategory(businessMetricsId, month, year, category) {
    try {
      const response = await axios.get(`http://localhost:8004/business-metrics/${businessMetricsId}/revenue/month/${category}`, {
        params: { month, year }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching revenue for ${month}/${year} and category ${category}:`, error);
      return 0;
    }
  };

  async function getRevenue(businessMetricsId, month, year) {
    try {
      const response = await axios.get(`http://localhost:8004/business-metrics/${businessMetricsId}/revenue/month`, {
        params: { month, year }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching revenue for ${month}/${year}:`, error);
      return 0;
    }
  }

  async function fetchRevenuesByCategory(businessMetricsId) {
    const months = getLastSixMonths();
    const revenuesByCategory = {};

    for (const category of categories) {
      revenuesByCategory[category] = [];
      for (const { month, year } of months) {
        const revenue = await getRevenueByCategory(businessMetricsId, month, year, category);
        revenuesByCategory[category].push({ month, year, revenue });
      }
    }

    return revenuesByCategory;
  };

  async function fetchRevenues(businessMetricsId) {
    const months = getLastSixMonths();
    const revenues = [];
    for (const { month, year } of months) {
        const revenue = await getRevenue(businessMetricsId, month, year);
        revenues.push({ month, year, revenue });
      }

    return revenues;
  };

  useEffect(() => {
    fetchRevenuesByCategory(businessMetricsId).then(revenuesByCategory => {
      setTimeout(() => {
        const formattedDataByCategory = [
          {
            id: "Giày dép",
            color: tokens("dark").greenAccent[500],
            data: revenuesByCategory.SHOE.map(item => ({ x: "Tháng " + item.month, y: item.revenue })),
          },
          {
            id: "Quần áo",
            color: tokens("dark").blueAccent[300],
            data: revenuesByCategory.CLOTHES.map(item => ({ x: "Tháng " + item.month, y: item.revenue })),
          },
          {
            id: "Túi xách",
            color: tokens("dark").redAccent[200],
            data: revenuesByCategory.HANDBAG.map(item => ({ x: "Tháng " + item.month, y: item.revenue })),
          },
          {
            id: "Phụ kiện",
            color: tokens("dark").redAccent[500],
            data: revenuesByCategory.ACCESSORY.map(item => ({ x: "Tháng " + item.month, y: item.revenue })),
          },
        ];
        if (dataType === "monthAndCategory") {
          setLineData(formattedDataByCategory);
        }
      })
      
    });

    fetchRevenues(businessMetricsId).then(revenues => {
      setTimeout(() => {
        const formatData1 = [
          {
            id: "Doanh thu",
            color: tokens("dark").redAccent[500],
            data: revenues.map(item => ({ x: "Tháng " + item.month, y: item.revenue })),
          },
        ];
        if (dataType === "month") {
          setLineData(formatData1);
        }
      });
   
      
    });

  }, []);

  const formatCurrency = (value) => {
    return value.toLocaleString('vi-VN', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  return (
    <ResponsiveLine
      data={lineData}
      theme={{
        axis: {
          domain: {
            line: {
              stroke: colors.grey[100],
            },
          },
          legend: {
            text: {
              fill: colors.grey[100],
            },
          },
          ticks: {
            line: {
              stroke: colors.grey[100],
              strokeWidth: 1,
            },
            text: {
              fill: colors.grey[100],
              tickPadding: 15
            },
          },
        },
        legends: {
          text: {
            fill: colors.grey[100],
          },
        },
        tooltip: {
          container: {
            color: colors.primary[500],
          },
        },
      }}
      colors={isDashboard ? { datum: "color" } : { scheme: "nivo" }} // added
      margin={{ top: 50, right: 110, bottom: 50, left: 80 }} // Increase left margin
      xScale={{ type: "point" }}
      yScale={{
        type: "linear",
        min: 0,
        max: "auto",
        stacked: false,
        reverse: false,
      }}
      yFormat={formatCurrency}
      curve="catmullRom"
      axisTop={null}
      axisRight={null}
      axisBottom={{
        orient: "bottom",
        tickSize: 0,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? undefined : "Tháng",
        legendOffset: 36,
        legendPosition: "middle",
      }}
      axisLeft={{
        orient: "left",
        tickSize: 5,
        tickPadding: 15,
        tickRotation: 0,
        legend: isDashboard ? undefined : "Doanh thu",
        legendOffset: -60,
        legendPosition: "middle",
        format: formatCurrency
      }}
      enableGridX={false}
      enableGridY={false}
      pointSize={8}
      pointColor={{ theme: "background" }}
      pointBorderWidth={2}
      pointBorderColor={{ from: "serieColor" }}
      pointLabelYOffset={-12}
      useMesh={true}
      legends={[
        {
          anchor: "bottom-right",
          direction: "column",
          justify: false,
          translateX: 100,
          translateY: 0,
          itemsSpacing: 0,
          itemDirection: "left-to-right",
          itemWidth: 80,
          itemHeight: 20,
          itemOpacity: 0.75,
          symbolSize: 12,
          symbolShape: "circle",
          symbolBorderColor: "rgba(0, 0, 0, .5)",
          effects: [
            {
              on: "hover",
              style: {
                itemBackground: "rgba(0, 0, 0, .03)",
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
    />
  );
};

export default LineChart;

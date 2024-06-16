import { ResponsiveLine } from "@nivo/line";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LineChart = ({ isCustomLineColors = false, isDashboard = false }) => {
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

  async function getRevenue(businessMetricsId, month, year, category) {
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

  async function fetchRevenues(businessMetricsId) {
    const months = getLastSixMonths();
    const revenues = {};

    for (const category of categories) {
      revenues[category] = [];
      for (const { month, year } of months) {
        const revenue = await getRevenue(businessMetricsId, month, year, category);
        revenues[category].push({ month, year, revenue });
      }
    }

    return revenues;
  };

  useEffect(() => {
    fetchRevenues(businessMetricsId).then(revenues => {
      const formattedData = [
        {
          id: "Giày dép",
          color: tokens("dark").greenAccent[500],
          data: revenues.SHOE.map(item => ({ x: "Tháng " + item.month, y: item.revenue })),
        },
        {
          id: "Quần áo",
          color: tokens("dark").blueAccent[300],
          data: revenues.CLOTHES.map(item => ({ x: "Tháng " + item.month, y: item.revenue })),
        },
        {
          id: "Túi xách",
          color: tokens("dark").redAccent[200],
          data: revenues.HANDBAG.map(item => ({ x: "Tháng " + item.month, y: item.revenue })),
        },
        {
          id: "Phụ kiện",
          color: tokens("dark").redAccent[500],
          data: revenues.ACCESSORY.map(item => ({ x: "Tháng " + item.month, y: item.revenue })),
        },
      ];
      console.log('Formatted Data for LineChart:', formattedData);
      setLineData(formattedData);
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
              tickPadding: 15 // Adding padding to avoid cutting off the labels
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
        min: 0, // Setting minimum to 0
        max: "auto", // Let Nivo calculate the max value based on your data
        stacked: false, // Ensure it is not stacked to avoid cumulative effect
        reverse: false,
      }}
      yFormat={formatCurrency} // Use formatCurrency function
      curve="catmullRom"
      axisTop={null}
      axisRight={null}
      axisBottom={{
        orient: "bottom",
        tickSize: 0,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? undefined : "Tháng", // added
        legendOffset: 36,
        legendPosition: "middle",
      }}
      axisLeft={{
        orient: "left",
        tickSize: 5,
        tickPadding: 15, // Adding padding to avoid cutting off the labels
        tickRotation: 0,
        legend: isDashboard ? undefined : "Doanh thu", // added
        legendOffset: -60, // Move legend to the right
        legendPosition: "middle",
        format: formatCurrency // Format y-axis ticks using formatCurrency
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

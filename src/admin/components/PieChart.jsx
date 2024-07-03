import React, { useEffect, useState } from 'react';
import { ResponsivePie } from "@nivo/pie";
import { tokens } from "../../theme";
import { useTheme } from "@mui/material";
import axios from "axios";
// import { mockPieData as data } from "../data/mockData";


const PieChart = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [quantitySoldShoe, setQuantitySoldShoe] = useState(0);
  const [quantitySoldClothes, setQuantitySoldClothes] = useState(0);
  const [quantitySoldAccessory, setQuantitySoldAccessory] = useState(0);
  const [quantitySoldHandBags, setQuantitySoldHandBags] = useState(0);
  const [data, setData] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    const fetchDataByCategory = async (category, setState) => {
      try { 
        const response = await axios.get(`http://localhost:8004/product/${category}/totalSold`);
        // console.log('11111');
        // console.log(`Response for ${category}:`, response);
        setState(response.data);
        // console.log(`${category} sold:`, response.data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchDataByCategory('shoe', setQuantitySoldShoe);
    fetchDataByCategory('accessory', setQuantitySoldAccessory);
    fetchDataByCategory('handbag', setQuantitySoldHandBags);
    fetchDataByCategory('clothes', setQuantitySoldClothes);
  }, []);

  useEffect(() => {
    // console.log('22222',quantitySoldShoe, quantitySoldClothes, quantitySoldHandBags, quantitySoldAccessory);
    setData([
      {
        id: "Giày dép",
        label: "Giày dép",
        value: quantitySoldShoe,
        color: "hsl(104, 70%, 50%)",
      },
      {
        id: "Quần áo",
        label: "Quần áo",
        value: quantitySoldClothes,
        color: "hsl(162, 70%, 50%)",
      },
      {
        id: "Túi xách",
        label: "Túi xách",
        value: quantitySoldHandBags,
        color: "hsl(291, 70%, 50%)",
      },
      {
        id: "Phụ kiện",
        label: "Phụ kiện",
        value: quantitySoldAccessory,
        color: "hsl(229, 70%, 50%)",
      }
    ]);
    setDataLoaded(true);
  }, [quantitySoldShoe, quantitySoldClothes, quantitySoldAccessory, quantitySoldHandBags])

  const tooltipFormat = ( datum) => {
    const entry = datum;
    if (entry) {
      return `${entry.label}: ${entry.value}`;
    } else {
      console.warn(`Tooltip: Entry with id "${id}" or data index not found`);
      return `${id || '(Unknown)'}: ${value}`;
    }
  };
  return (
    <>
      {" "}
      {dataLoaded && (
        <ResponsivePie
          data={data}
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
                },
              },
            },
            legends: {
              text: {
                fill: colors.grey[100],
              },
            },
          }}
          margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
          innerRadius={0.5}
          padAngle={0.7}
          cornerRadius={3}
          activeOuterRadiusOffset={8}
          borderColor={{
            from: "color",
            modifiers: [["darker", 0.2]],
          }}
          arcLinkLabelsSkipAngle={10}
          arcLinkLabelsTextColor={colors.grey[100]}
          arcLinkLabelsThickness={2}
          arcLinkLabelsColor={{ from: "color" }}
          enableArcLabels={false}
          arcLabelsRadiusOffset={0.4}
          arcLabelsSkipAngle={7}
          arcLabelsTextColor={{
            from: "color",
            modifiers: [["darker", 2]],
          }}
          defs={[
            {
              id: "dots",
              type: "patternDots",
              background: "inherit",
              color: "rgba(255, 255, 255, 0.3)",
              size: 4,
              padding: 1,
              stagger: true,
            },
            {
              id: "lines",
              type: "patternLines",
              background: "inherit",
              color: "rgba(255, 255, 255, 0.3)",
              rotation: -45,
              lineWidth: 6,
              spacing: 10,
            },
          ]}
          legends={[
            {
              anchor: "bottom",
              direction: "row",
              justify: false,
              translateX: 0,
              translateY: 56,
              itemsSpacing: 0,
              itemWidth: 100,
              itemHeight: 18,
              itemTextColor: "#999",
              itemDirection: "left-to-right",
              itemOpacity: 1,
              symbolSize: 18,
              symbolShape: "circle",
              effects: [
                {
                  on: "hover",
                  style: {
                    itemTextColor: "#fff",
                  },
                },
              ],
            },
          ]}
          tooltip={({ datum }) => (
            <div
              style={{
                background: "white",
                padding: "10px",
                border: "1px solid black",
                color: "red",
                borderRadius: "10px",
              }}
            >
              {tooltipFormat(datum)}
            </div>
          )}
        />
      )}
    </>
  );
};

export default PieChart;

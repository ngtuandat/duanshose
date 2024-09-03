import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import ApexCharts from "react-apexcharts";

interface ChartData {
  series: { name: string; data: number[] }[];
  categories: string[];
}

const Area = ({ data }: any) => {
  const [chartData, setChartData] = useState<ChartData>({
    series: [],
    categories: [],
  });

  useEffect(() => {
    if (data && data.length > 0) {
      const monthRevenueMap: Record<string, number> = {};

      data.forEach((item: any) => {
        if (item.status === "delivered") {
          const date = new Date(item.createdAt);
          const monthYear = `${date.getMonth() + 1}-${date.getFullYear()}`; // Format: MM-YYYY
          const revenue = item.priceProd * item.quantityProd;

          if (!monthRevenueMap[monthYear]) {
            monthRevenueMap[monthYear] = 0;
          }
          monthRevenueMap[monthYear] += revenue;
        }
      });

      // Tạo mảng chứa tất cả 12 tháng của năm hiện tại
      const year = new Date().getFullYear();
      const allMonths = Array.from(
        { length: 12 },
        (_, i) => `${i + 1}-${year}`
      );

      // Đảm bảo rằng tất cả các tháng có mặt trong dữ liệu
      const categories = allMonths.map((monthYear) => {
        const [month, year] = monthYear.split("-");
        return `${month}/${year}`;
      });

      // Thêm dữ liệu 0 cho các tháng không có dữ liệu
      const seriesData = allMonths.map(
        (monthYear) => monthRevenueMap[monthYear] || 0
      );

      setChartData({
        series: [{ name: "Tổng Thu Nhập", data: seriesData }],
        categories,
      });
    }
  }, [data]);

  const options: ApexOptions = {
    colors: ["rgba(0,170,85,0.7)"],
    chart: {
      foreColor: "rgb(83,97,111)",
      height: 350,
      type: "area",
      toolbar: {
        show: false,
        tools: {
          download: false,
          selection: false,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: false,
          customIcons: [],
        },
      },
    },
    grid: {
      position: "back",
      borderColor: "rgb(51,61,73)",
      strokeDashArray: 5,
      show: true,
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
    xaxis: {
      tickAmount: undefined,
      axisTicks: {
        color: "transparent",
      },
      axisBorder: {
        color: "rgb(51,61,73)",
      },
      type: "category",
      categories: chartData.categories,
    },
    tooltip: {
      fixed: {
        enabled: false,
      },
      marker: {
        show: false,
      },
      theme: "dark",
      x: {
        show: false,
      },
      y: {},
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "vertical",
        shadeIntensity: 0,
        opacityFrom: 0.7,
        opacityTo: 0,
      },
    },
    legend: {
      show: true,
      showForSingleSeries: false,
      showForNullSeries: true,
      showForZeroSeries: true,
      position: "top",
      horizontalAlign: "right",
      floating: false,
      fontSize: "12px",
      fontWeight: 500,
      offsetX: 0,
      offsetY: 0,
      labels: {
        colors: "#fff",
        useSeriesColors: false,
      },
      // Removed 'markers' as it was causing type errors
      itemMargin: {
        horizontal: 10,
        vertical: 0,
      },
      onItemClick: {
        toggleDataSeries: true,
      },
      onItemHover: {
        highlightDataSeries: true,
      },
    },
  };

  return (
    <div className="bg-product rounded-lg p-6">
      <div className="mb-5">
        <p className="text-lg font-bold">Bán Hàng Theo Tháng</p>
        <p className="text-sm font-medium text-[rgb(187,195,202)]">
          (+43%){" "}
          <span className="text-[rgb(145,158,171)] font-normal">
            so với tháng trước
          </span>
        </p>
      </div>
      <ApexCharts
        options={options}
        series={chartData.series}
        type="area"
        height={350}
      />
    </div>
  );
};

export default Area;

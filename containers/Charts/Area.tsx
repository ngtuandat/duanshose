import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Tải ApexCharts chỉ trên client-side
const ApexCharts = dynamic(() => import("react-apexcharts"), { ssr: false });

const Area = ({ data }: any) => {
  const [chartData, setChartData] = useState<any>({
    series: [],
    categories: [],
  });

  useEffect(() => {
    if (data && data.length > 0) {
      const monthRevenueMap: Record<string, number> = {};
      data.forEach((item: any) => {
        if (item.status === "delivered") {
          const date = new Date(item.createdAt);
          const monthYear = `${date.getMonth() + 1}-${date.getFullYear()}`;
          const revenue = item.priceProd * item.quantityProd;

          if (!monthRevenueMap[monthYear]) {
            monthRevenueMap[monthYear] = 0;
          }
          monthRevenueMap[monthYear] += revenue;
        }
      });

      const year = new Date().getFullYear();
      const allMonths = Array.from(
        { length: 12 },
        (_, i) => `${i + 1}-${year}`
      );
      const categories = allMonths.map((monthYear) => {
        const [month, year] = monthYear.split("-");
        return `${month}/${year}`;
      });

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
      position: "top",
      horizontalAlign: "right",
      fontSize: "12px",
      fontWeight: 500,
      itemMargin: {
        horizontal: 10,
        vertical: 0,
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

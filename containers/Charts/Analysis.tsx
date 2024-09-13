import React from "react";
import dynamic from "next/dynamic";

interface AnalysisProps {
  name: string;
  parameter: number;
  color: string;
  percent: string;
}

const Analysis = ({ name, parameter, color, percent }: AnalysisProps) => {
  const ApexCharts = dynamic(() => import("react-apexcharts"), { ssr: false });

  // Giá trị tham chiếu (baseline), có thể thay đổi để phù hợp với ngữ cảnh của bạn
  const baseline = 0;

  // Dữ liệu cho biểu đồ
  const data = [baseline, parameter];

  // Tạo dữ liệu series
  const series = [
    {
      name: "",
      data: data,
    },
  ];

  // Xác định kiểu đường và cấu hình y-axis
  const options = {
    chart: {
      type: "line",
      sparkline: {
        enabled: true,
      },
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
      y: {
        formatter: (val: number) => `${val}`,
      },
    },
    stroke: {
      show: true,
      curve: "smooth",
      lineCap: "round",
      width: 3,
      colors: [color],
      dashArray: 0,
    },
    colors: [color],
    yaxis: {
      min: Math.min(...data) - 5, // Điều chỉnh khoảng cách tối thiểu
      max: Math.max(...data) + 5, // Điều chỉnh khoảng cách tối đa
    },
    xaxis: {
      categories: ["Baseline", "Current"], // Nhãn cho các điểm dữ liệu
    },
    markers: {
      size: 6,
      colors: [color],
      strokeColor: "#fff",
      strokeWidth: 2,
      hover: {
        size: 8,
      },
    },
    grid: {
      show: true,
      borderColor: "#e0e0e0",
      strokeDashArray: 5,
    },
  };

  // Xác định kích thước biểu đồ
  const chartHeight = "40%";
  const chartWidth = "60%";

  return (
    <div className="bg-product p-6 pr-0 rounded-lg flex items-center justify-between">
      <div className="space-y-4">
        <p className="text-sm font-semibold">{name}</p>
        <p className="font-bold text-3xl">{parameter.toLocaleString("vi")}</p>
        {/* <div className="flex items-center space-x-2">
          <img
            src={
              percent.includes("+")
                ? "/images/svg/increase.svg"
                : "/images/svg/abatement.svg"
            }
            className={`${
              percent.includes("+")
                ? "bg-[rgba(54,179,126,0.16)]"
                : "bg-[rgba(255,86,48,0.16)]"
            } p-1 rounded-full`}
            alt=""
          />
          <p className="text-sm font-semibold">
            {percent}{" "}
            <span className="text-[rgb(145,158,171)] font-normal">
              so với tuần trước
            </span>
          </p>
        </div> */}
      </div>
      <div className="mr-2">
        <ApexCharts
          options={Object(options)}
          type="line"
          series={series}
          height={chartHeight}
          width={chartWidth}
        />
      </div>
    </div>
  );
};

export default Analysis;

import React from "react";
import dynamic from "next/dynamic";

const Area = () => {
  const ApexCharts = dynamic(() => import("react-apexcharts"), { ssr: false });
  const series = [
    {
      name: "Tổng Thu Nhập",
      data: [31, 40, 28, 51, 42, 109, 100],
    },
    {
      name: "Tổng Chi Phí",
      data: [11, 32, 45, 32, 34, 52, 41],
    },
  ];
  const options = {
    colors: ["rgba(248,167,2,0.7)", "rgba(0,170,85,0.7)"],
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
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
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
      markers: {
        width: 12,
        height: 12,
        strokeWidth: 0,
        strokeColor: "#fff",
        radius: 12,
        offsetX: -5,
        offsetY: 0,
      },
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
        <p className=" text-lg font-bold">Bán Hàng Theo Tháng</p>
        <p className="text-sm font-medium text-[rgb(187,195,202)]">
          (+43%){" "}
          <span className="text-[rgb(145,158,171)] font-normal">
            so với tháng trước
          </span>
        </p>
      </div>
      <ApexCharts
        options={Object(options)}
        series={series}
        type="area"
        height={350}
      />
    </div>
  );
};

export default Area;

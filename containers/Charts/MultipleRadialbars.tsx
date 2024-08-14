import React from "react";
import dynamic from "next/dynamic";

const MultipleRadialbars = () => {
  const ApexCharts = dynamic(() => import("react-apexcharts"), { ssr: false });
  const series = [44, 55];
  var options = {
    colors: ["rgb(248,167,2)", "rgb(0,170,85)"],
    chart: {
      type: "radialBar",
      height: 350,
      width: 380,
      offsetY: -30,
    },
    plotOptions: {
      radialBar: {
        size: undefined,
        inverseOrder: true,
        hollow: {
          margin: 5,
          size: "68%",
          background: "transparent",
        },
        track: {
          show: true,
          startAngle: undefined,
          endAngle: undefined,
          background: "rgb(51,61,73)",
          strokeWidth: "97%",
          opacity: 1,
          margin: 5,
          dropShadow: {
            enabled: false,
            top: 0,
            left: 0,
            blur: 3,
            opacity: 0.5,
          },
        },
        dataLabels: {
          name: {
            fontSize: "22px",
          },
          value: {
            fontSize: "25px",
            color: "#fff",
            fontWeight: 700,
          },
          total: {
            show: true,
            label: "Tổng",
            color: "rgb(127,140,152)",
            fontSize: "16px",
            formatter: function (w: any) {
              return 100;
            },
          },
        },
      },
    },
    stroke: {
      lineCap: "round",
    },
    legend: {
      show: true,
      showForSingleSeries: false,
      showForNullSeries: true,
      showForZeroSeries: true,
      position: "bottom",
      horizontalAlign: "center",
      floating: false,
      fontSize: "14px",
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
        offsetX: 0,
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

    labels: ["Men", "Women"],
  };
  return (
    <div className="bg-product rounded-lg p-6 pb-0">
      <p className="mb-10 text-lg font-bold">Bán Theo Giới Tính</p>
      <ApexCharts
        options={Object(options)}
        series={series}
        type="radialBar"
        height={400}
      />
    </div>
  );
};

export default MultipleRadialbars;

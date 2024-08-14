import React, { useState } from "react";
import dynamic from "next/dynamic";

interface AnalysisProps {
  name: string;
  parameter: number;
  color: string;
  percent: string;
}

const randomColor = ["rgb(0,170,85)", "rgb(0,184,217)", "rgb(248,167,2)"];

const Analysis = ({ name, parameter, color, percent }: AnalysisProps) => {
  const ApexCharts = dynamic(() => import("react-apexcharts"), { ssr: false });
  const series = [
    {
      name: "",
      data: [25, 66, 41, 89, 63, 25, 44, 12, 36],
    },
  ];
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
      y: {},
    },
    stroke: {
      show: true,
      curve: "smooth",
      lineCap: "butt",
      width: 2,
      colors: color,
      dashArray: 0,
    },
    colors: [color],
  };
  return (
    <div className="bg-product p-6 pr-0 rounded-lg flex items-center justify-between">
      <div className="space-y-4">
        <p className="text-sm font-semibold">{name}</p>
        <p className="font-bold text-3xl">{parameter.toLocaleString("vi")}</p>
        <div className="flex items-center space-x-2">
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
        </div>
      </div>
      <div className="mr-2">
        <ApexCharts
          options={Object(options)}
          type="line"
          series={series}
          height="40%"
          width="60%"
        />
      </div>
    </div>
  );
};

export default Analysis;

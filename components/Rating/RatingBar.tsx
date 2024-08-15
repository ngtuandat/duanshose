import React from "react";

const RatingBar = ({ percent }: { percent: number }) => {
  const widthBar = String(percent) + "%";
  return (
    <div className="relative bg-[rgb(99,106,114)] w-full h-1 rounded-md">
      {" "}
      <span
        className="absolute h-full top-0 left-0 bg-white rounded-md"
        style={{ width: widthBar }}
      ></span>
    </div>
  );
};

export default RatingBar;

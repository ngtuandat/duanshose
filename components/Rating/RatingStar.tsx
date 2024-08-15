import React from "react";
import {
  TiStarHalfOutline,
  TiStarFullOutline,
  TiStarOutline,
} from "react-icons/ti";

const RatingStar = ({
  star,
  className,
}: {
  star: number;
  className?: string;
}) => {
  const rating = Array.from({ length: 5 }, (item, idx) => {
    return (
      <span className={`${className}`} key={idx}>
        {star >= idx + 1 ? (
          <TiStarFullOutline className="text-yellow-500" />
        ) : idx < star && star < idx + 0.5 ? (
          <TiStarHalfOutline className="text-yellow-500" />
        ) : (
          <TiStarOutline className="text-yellow-500" />
        )}
      </span>
    );
  });
  return <div className="flex">{rating}</div>;
};

export default RatingStar;

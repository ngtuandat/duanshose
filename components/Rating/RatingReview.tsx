import React, { useRef, useState } from "react";
import {
  TiStarHalfOutline,
  TiStarFullOutline,
  TiStarOutline,
} from "react-icons/ti";

interface RatingReviewProps {
  currentStar: number | undefined;
  setCurrentStar: React.Dispatch<React.SetStateAction<number | undefined>>;
}

const RatingReview = ({ currentStar, setCurrentStar }: RatingReviewProps) => {
  const [currentStarHover, setCurrentStarHover] = useState<number>();

  const rating = Array.from({ length: 5 }, (item, idx) => {
    return (
      <span
        className="cursor-pointer text-xl"
        onMouseEnter={() => setCurrentStarHover(idx)}
        onMouseLeave={() => setCurrentStarHover(currentStar)}
        onClick={() => setCurrentStar(idx)}
        key={idx}
      >
        {Number(currentStarHover) >= idx ? (
          <TiStarFullOutline className="text-yellow-500 hover:scale-125" />
        ) : (
          <TiStarOutline className="text-yellow-500" />
        )}
      </span>
    );
  });
  return <div className="flex">{rating}</div>;
};

export default RatingReview;

import React from "react";

const colorStyle = [
  "#2E7D7A",
  "#B24AAE",
  "#C9040C",
  "#E8A82C",
  "#058A2A",
  "#1D46EB",
  "#CF6319",
  "#7C5B26",
  "#6E9805",
  "#1C8983",
  "#FCDF82",
  "#DA3B63",
  "#DFD363",
  "#08818F",
  "#0F0B3F",
  "#8F548D",
  "#1BBB72",
  "#7A2887",
  "#CBDBC1",
  "#885F41",
];

const LetterAvatar = ({
  name,
  className,
}: {
  name: string;
  className?: string;
}) => {
  return (
    <>
      <div
        className={`w-9 h-9 rounded-full flex justify-center items-center ${className}`}
        style={{
          backgroundColor:
            colorStyle[Math.floor(Math.random() * colorStyle.length)],
        }}
      >
        <span className="text-lg uppercase text-white font-bold">
          {name.slice(0, 1)}
        </span>
      </div>
    </>
  );
};

export default LetterAvatar;

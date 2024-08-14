import React from "react";

const LoadingPage = () => {
  return (
    <div className="bg-[rgb(22,28,36)] z-[9999] text-white fixed inset-0 flex justify-center items-center">
      <img
        src="/images/logo.svg"
        className="animate-scale w-14 h-w-14 fixed"
        alt=""
      />
      <div className="animate-spin-increase border-green-500 fixed " />
      <div className="animate-spin-abatement border-green-500 fixed " />
    </div>
  );
};

export default LoadingPage;

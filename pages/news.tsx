import React, { ReactElement, useState } from "react";
import MainClient from "../components/Layouts/MainClient";
import { CustomHeader } from "../components/Header/CustomHeader";
import Footer from "../components/Footer";
import { NewEvents } from "../mockData";

const News = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Tính toán tổng số trang
  const totalPages = Math.ceil(NewEvents.length / itemsPerPage);

  // Lấy các tin tức hiện tại theo trang
  const currentNews = NewEvents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Hàm chuyển trang
  const goToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="px-4 py-8">
      <CustomHeader>
        <title>Tin Tức - Sự kiện | FitFusionZone</title>
      </CustomHeader>
      <div className="text-white text-3xl font-bold mb-8 text-center">
        Tin Tức - Sự kiện
      </div>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {currentNews.map((item, index) => (
          <div
            key={index}
            className="flex flex-col bg-gray-800 rounded-lg overflow-hidden shadow-lg"
          >
            <img
              src={item.image}
              alt={item.title}
              className="object-cover h-48 w-full"
            />
            <div className="p-4">
              <div className="text-white text-lg font-semibold mb-2">
                {item.title}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Phân trang */}
      <div className="flex justify-center mt-8 space-x-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => goToPage(index + 1)}
            className={`px-4 py-2 rounded ${
              currentPage === index + 1
                ? "bg-[#17A34A] text-white"
                : "bg-gray-300 text-gray-800"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      <Footer />
    </div>
  );
};

News.getLayout = function getLayout(page: ReactElement) {
  return <MainClient>{page}</MainClient>;
};

export default News;

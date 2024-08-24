import React, { ReactElement } from "react";
import MainClient from "../components/Layouts/MainClient";
import { CustomHeader } from "../components/Header/CustomHeader";
import Footer from "../components/Footer";

const News = () => {
  return (
    <div>
      <CustomHeader>
        <title>Tin Tức - Sự kiện | Cuc Shoes</title>
      </CustomHeader>
      <div className="text-white text-2xl font-bold">Tin Tức - Sự kiện</div>
      <Footer />
    </div>
  );
};

News.getLayout = function getLayout(page: ReactElement) {
  return <MainClient>{page}</MainClient>;
};

export default News;

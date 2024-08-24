import React, { ReactElement } from "react";
import MainClient from "../components/Layouts/MainClient";
import { CustomHeader } from "../components/Header/CustomHeader";
import Footer from "../components/Footer";

const Category = () => {
  return (
    <div>
      <CustomHeader>
        <title>Danh mục | Cuc Shoes</title>
      </CustomHeader>
      <div className="text-white text-2xl font-bold">Danh mục</div>
      <Footer />
    </div>
  );
};

Category.getLayout = function getLayout(page: ReactElement) {
  return <MainClient>{page}</MainClient>;
};

export default Category;

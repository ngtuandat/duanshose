import React, { ReactElement } from "react";
import { CustomHeader } from "../../components/Header/CustomHeader";
import MainClient from "../../components/Layouts/MainClient";
import LoadingPage from "../../components/Loading/LoadingPage";
import FilterContent from "../../containers/FilterContent";
import ProductContent from "../../containers/ProductContent";

const Product = ({ loading }: { loading: Boolean }) => {
  return (
    <>
      {loading && <LoadingPage />}
      <CustomHeader title="Sản phẩm">
        <title>Sản phẩm | Cuc Shoes</title>
      </CustomHeader>
      <div className="text-white">
        <FilterContent />
        <ProductContent />
      </div>
    </>
  );
};

Product.getLayout = function getLayout(page: ReactElement) {
  return <MainClient>{page}</MainClient>;
};

export default Product;

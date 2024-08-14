import React, { ReactElement, useEffect } from "react";
import MainClient from "../components/Layouts/MainClient";
import BackHome from "../containers/BackHome";
import ContentHome from "../containers/ContentHome";
import { CustomHeader } from "./../components/Header/CustomHeader";
import { useRouter } from "next/router";
import LoadingPage from "../components/Loading/LoadingPage";
import NavClient from "../components/NavBar/NavClient";

const Home = ({ loading }: { loading: Boolean }) => {
  return (
    <div>
      {loading && <LoadingPage />}
      <CustomHeader>
        <title>Trang Chủ | Cuc Shoes</title>
      </CustomHeader>
      {/* <BackHome /> */}
      <div className="bg-dark w-full z-[1200] relative  ">
        <ContentHome />
      </div>
    </div>
  );
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <MainClient>{page}</MainClient>;
};

export default Home;

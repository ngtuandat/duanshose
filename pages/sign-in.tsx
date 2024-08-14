import React, { ReactElement } from "react";
import Sign from "../components/Layouts/Sign";
import LoadingPage from "../components/Loading/LoadingPage";
import { CustomHeader } from "./../components/Header/CustomHeader";
import Login from "./../containers/Login";

const SignIn = ({ loading }: { loading: Boolean }) => {
  return (
    <div className="w-full">
      {loading && <LoadingPage />}
      <CustomHeader>
        <title>Login | Cuc Shoes</title>
      </CustomHeader>
      <Login />
    </div>
  );
};

SignIn.getLayout = function getLayout(page: ReactElement) {
  return <Sign>{page}</Sign>;
};

export default SignIn;

import React from "react";
import { ReactElement } from "react";
import { CustomHeader } from "../components/Header/CustomHeader";
import Sign from "../components/Layouts/Sign";
import LoadingPage from "../components/Loading/LoadingPage";
import Register from "../containers/Register";

const SignUp = ({ loading }: { loading: Boolean }) => {
  return (
    <>
      {loading && <LoadingPage />}
      <CustomHeader>
        <title>Register | Cuc Shoes</title>
      </CustomHeader>
      <Register />
    </>
  );
};
SignUp.getLayout = function getLayout(page: ReactElement) {
  return <Sign>{page}</Sign>;
};

export default SignUp;

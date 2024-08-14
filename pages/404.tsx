import React from "react";
import { ReactElement } from "react";
import Sign from "../components/Layouts/Sign";

const NotFound = () => {
  return (
    <>
      <div>
        <div>
          <h1>Opps! page not found!</h1>
          <p>
            Chắc có điều gì nhầm lẫn ở đường dẫn của bạn vui lòng kiểm tra
            lại...
          </p>
        </div>
        <img src="/images/notfound.svg" alt="" />
      </div>
    </>
  );
};

NotFound.getLayout = function getLayout(page: ReactElement) {
  return <Sign>{page}</Sign>;
};

export default NotFound;

import { ReactElement } from "react";
import ContentHeader from "../../../components/Header/ContentHeader";
import MainAdmin from "../../../components/Layouts/MainAdmin";
import LoadingPage from "../../../components/Loading/LoadingPage";
import ProductUpload from "../../../containers/Uploads/ProductUpload";

const Create = ({ loading }: { loading: Boolean }) => {
  return (
    <>
      {loading && <LoadingPage />}
      <ContentHeader title="Thêm sản phẩm" name="Thêm một sản phẩm mới" />
      <ProductUpload />
    </>
  );
};
Create.getLayout = function getLayout(page: ReactElement) {
  return <MainAdmin>{page}</MainAdmin>;
};
export default Create;

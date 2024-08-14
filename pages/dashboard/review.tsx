import { ReactElement, useEffect, useMemo, useState } from "react";
import ContentHeader from "../../components/Header/ContentHeader";
import MainAdmin from "../../components/Layouts/MainAdmin";
import LoadingPage from "../../components/Loading/LoadingPage";
import { getFullReview } from "../../services/review";
import { ListReview, ReviewProps } from "../../interfaces/product";
import _ from "lodash";
import TableGroup from "../../components/Table/TableGroup";

const Voucher = ({ loading }: { loading: Boolean }) => {
  const [listReview, setListReview] = useState<any>();

  const column = ["STT", "Người đánh giá", "Số sao", "Nội dung"];
  const handleGetFullReview = async () => {
    const res = await getFullReview();
    setListReview(res.data);
  };
  useEffect(() => {
    handleGetFullReview();
  }, []);

  const groupedReviews = useMemo(() => {
    return _.chain(listReview)
      .groupBy("productId")
      .map((reviewsForProduct, productId) => ({
        productId,
        reviews: reviewsForProduct,
      }))
      .value();
  }, [listReview]);

  console.log({ groupedReviews });

  const dataSource = useMemo(() => {
    return groupedReviews.map((item) => {
      const prod = item.reviews[0].product;
      return {
        item: (
          <div className="flex items-center gap-5">
            <img className="w-14 h-14 rounded-lg" src={prod.listImage[0]} />
            <p className="font-bold text-green-400">{prod.name}</p>
          </div>
        ),

        children: item.reviews.map((i, idx) => {
          return [
            <> {idx + 1}</>,
            <>{i.nameUser}</>,
            <>{i.rating}</>,
            <>{i.content}</>,
          ];
        }),
      };
    });
  }, [groupedReviews]);

  console.log({ dataSource });
  return (
    <div>
      {loading && <LoadingPage />}
      <ContentHeader title="Quản lý đánh giá" name="Danh sách đánh giá" />
      <TableGroup columns={column} dataSource={dataSource} />
    </div>
  );
};
Voucher.getLayout = function getLayout(page: ReactElement) {
  return <MainAdmin>{page}</MainAdmin>;
};

export default Voucher;

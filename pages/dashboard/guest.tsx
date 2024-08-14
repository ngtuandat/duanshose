import { ReactElement, useEffect, useMemo, useState } from "react";
import Card from "../../components/Card";
import ContentHeader from "../../components/Header/ContentHeader";
import MainAdmin from "../../components/Layouts/MainAdmin";
import LoadingPage from "../../components/Loading/LoadingPage";
import Table from "../../components/Table";
import { useRouter } from "next/router";
import { getPurchaseAll } from "../../services/product";
import { updateStatus } from "../../services/purchase";
import toast from "react-hot-toast";
import DropDown from "../../components/DropDown";
import dateFormat from "dateformat";
import { getOrderGuestAll, updateStatusGuest } from "../../services/guest";

const Guest = ({ loading }: { loading: Boolean }) => {
  const columnPurchase = [
    "Số thứ tự",
    "Người mua",
    "Tên sản phẩm",
    "Size",
    "Màu sắc",
    "Ảnh",
    "Giá",
    "Số lượng",
    "Ngày bán",
    "Trạng thái",
  ];

  const listStatus = [
    { title: "Đang chờ", value: "pending" },
    { title: "Đang xử lý", value: "processing" },
    { title: "Đang giao hàng", value: "shipped" },
    { title: "Đã giao thành công", value: "delivered" },
    { title: "Đã hủy", value: "cancelled" },
  ];
  const [dataPurchase, setDataPurchase] = useState<any[]>([]);
  const router = useRouter();

  const fetchAllPurchase = async () => {
    try {
      const res = await getOrderGuestAll();
      setDataPurchase(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllPurchase();
  }, []);

  const handleItemSelected = async (
    selectedItem: { title: string; value: string },
    id: string
  ) => {
    try {
      const res = await updateStatusGuest({ id, status: selectedItem.value });
      if (res.status === 200) {
        toast.success("Cập nhật trạng thái đơn hàng thành công!");
        fetchAllPurchase();
      }
    } catch (error) {
      console.log(error);
    }
  };

  console.log({ dataPurchase });

  const dataSourcePurchase = useMemo(() => {
    return dataPurchase.map((item, index) => {
      const product = JSON.parse(item.products);
      return [
        <> {index + 1}</>,
        <div className="text-primary font-bold">{item.buyerName}</div>,
        <div>{product.name}</div>,
        <div>{product.size}</div>,
        <div>{product.color}</div>,
        <img
          className="w-1/2 cursor-pointer rounded-lg object-cover"
          src={product.image}
        />,
        <p>{(product?.quantity * product?.price).toLocaleString("vi")} đ</p>,
        <p>{product.quantity}</p>,
        <>{dateFormat(item?.updatedAt, "HH:MM dd/mm/yyyy")}</>,
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold`}
        >
          <DropDown
            onChange={handleItemSelected}
            listData={listStatus}
            defaultValue={item.status}
            itemId={item.id}
          />
        </span>,
      ];
    });
  }, [dataPurchase]);

  return (
    <div>
      {loading && <LoadingPage />}
      <ContentHeader
        title="Quản lý khách vãng lai"
        name="Danh sách khách vãng lai"
      />
      <Card>
        <Card.Content>
          {" "}
          <Table columns={columnPurchase} dataSource={dataSourcePurchase} />
        </Card.Content>
      </Card>
    </div>
  );
};
Guest.getLayout = function getLayout(page: ReactElement) {
  return <MainAdmin>{page}</MainAdmin>;
};

export default Guest;

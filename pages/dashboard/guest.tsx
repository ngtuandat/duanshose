import { ReactElement, useEffect, useMemo, useState, useRef } from "react";
import Card from "../../components/Card";
import ContentHeader from "../../components/Header/ContentHeader";
import MainAdmin from "../../components/Layouts/MainAdmin";
import LoadingPage from "../../components/Loading/LoadingPage";
import Table from "../../components/Table";
import { useRouter } from "next/router";
import { getOrderGuestAll, updateStatusGuest } from "../../services/guest";
import toast from "react-hot-toast";
import DropDown from "../../components/DropDown";
import dateFormat from "dateformat";

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
  const dataPurchaseRef = useRef<any[]>([]); // Thêm ref để giữ trạng thái hiện tại
  const router = useRouter();

  const fetchAllPurchase = async () => {
    try {
      const res = await getOrderGuestAll();
      setDataPurchase(res.data);
      dataPurchaseRef.current = res.data; // Lưu dữ liệu vào ref
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

        // Cập nhật trạng thái trong dữ liệu hiện tại mà không cần tải lại từ API
        setDataPurchase((prevData) =>
          prevData.map((item) =>
            item.id === id ? { ...item, status: selectedItem.value } : item
          )
        );
        dataPurchaseRef.current = dataPurchaseRef.current.map((item) =>
          item.id === id ? { ...item, status: selectedItem.value } : item
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const dataSourcePurchase = useMemo(() => {
    return dataPurchase.map((item, index) => {
      let product;
      try {
        const productsArray = JSON.parse(item.products);
        product = productsArray[0];
      } catch (error) {
        console.error("Error parsing JSON:", error);
        product = {};
      }

      return [
        <> {index + 1}</>,
        <div className="text-primary font-bold">{item.buyerName}</div>,
        <div>{product.name}</div>,
        <div>{product.size}</div>,
        <div>{product.color}</div>,
        <img
          className="w-full max-w-xs h-auto cursor-pointer rounded-lg object-cover"
          src={product.image}
          alt={product.name || "Product Image"}
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

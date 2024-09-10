import { ReactElement, useEffect, useMemo, useState } from "react";
import Card from "../../components/Card";
import ContentHeader from "../../components/Header/ContentHeader";
import MainAdmin from "../../components/Layouts/MainAdmin";
import LoadingPage from "../../components/Loading/LoadingPage";
import Table from "../../components/Table";
import { getOrderGuestAll, updateStatusGuest } from "../../services/guest";
import toast from "react-hot-toast";
import DropDown from "../../components/DropDown";
import dateFormat from "dateformat";
import ModalDetailVisitor from "../../components/Modal/ModalDetailVisitor";

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
    "Chi tiết",
  ];

  const listStatus = [
    { title: "Đang chờ", value: "pending" },
    { title: "Đang xử lý", value: "processing" },
    { title: "Đang giao hàng", value: "shipped" },
    { title: "Đã giao thành công", value: "delivered" },
    { title: "Đã hủy", value: "cancelled" },
    { title: "Trả hàng", value: "returns" },
  ];

  const statusOrder = [
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
    "returns",
  ];

  const [dataPurchase, setDataPurchase] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Số sản phẩm trên mỗi trang
  const totalPages = Math.ceil(dataPurchase.length / itemsPerPage);

  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  // const fetchAllPurchase = async () => {
  //   try {
  //     const res = await getOrderGuestAll();
  //     setDataPurchase(res.data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const fetchAllPurchase = async () => {
    try {
      const res = await getOrderGuestAll();
      const sortedData = res.data.sort(
        (a: any, b: any) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
      setDataPurchase(sortedData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllPurchase();
  }, []);

  const getFilteredStatusList = (currentStatus: string) => {
    if (currentStatus === "returns") {
      return [{ title: "Trả hàng", value: "returns" }];
    }

    const currentIndex = statusOrder.indexOf(currentStatus);
    return listStatus.filter(
      (status) => statusOrder.indexOf(status.value) >= currentIndex
    );
  };

  const handleItemSelected = async (
    selectedItem: { title: string; value: string },
    id: string
  ) => {
    try {
      const res = await updateStatusGuest({ id, status: selectedItem.value });
      if (res.status === 200) {
        toast.success("Cập nhật trạng thái đơn hàng thành công!");
        setDataPurchase((prevData: any) =>
          prevData.map((item: any) =>
            item.id === id ? { ...item, status: selectedItem.value } : item
          )
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleViewDetails = (order: any) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  // Tính toán phần dữ liệu cần hiển thị dựa trên trang hiện tại
  const dataSourcePurchase = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    return dataPurchase.slice(startIndex, endIndex).map((item, index) => {
      let product;
      try {
        const productsArray = JSON.parse(item.products);
        product = productsArray[0];
      } catch (error) {
        console.error("Error parsing JSON:", error);
        product = {};
      }

      return [
        <> {startIndex + index + 1}</>, // Đánh số theo trang hiện tại
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
            onChange={(selectedItem) =>
              handleItemSelected(selectedItem, item.id)
            }
            listData={getFilteredStatusList(item.status)}
            defaultValue={item.status}
            itemId={item.id}
          />
        </span>,
        <button
          onClick={() => handleViewDetails(item)}
          className="text-blue-500 hover:underline"
        >
          Chi tiết
        </button>,
      ];
    });
  }, [dataPurchase, currentPage]);

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
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="bg-green-600 text-white px-4 py-2 rounded-lg"
          disabled={currentPage === 1}
        >
          Trang trước
        </button>
        <div className="text-white">
          Trang {currentPage} / {totalPages}
        </div>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          className="bg-green-600 text-white px-4 py-2 rounded-lg"
          disabled={currentPage === totalPages}
        >
          Trang sau
        </button>
      </div>
      {selectedOrder && (
        <ModalDetailVisitor
          open={modalOpen}
          setOpen={() => setModalOpen(false)}
          orderDetail={selectedOrder}
        />
      )}
    </div>
  );
};

Guest.getLayout = function getLayout(page: ReactElement) {
  return <MainAdmin>{page}</MainAdmin>;
};

export default Guest;

import React, { ReactElement, useEffect, useMemo, useState } from "react";
import MainAdmin from "../../components/Layouts/MainAdmin";
import { getPurchaseAll } from "../../services/product";
import LoadingPage from "../../components/Loading/LoadingPage";
import ContentHeader from "../../components/Header/ContentHeader";
import Card from "../../components/Card";
import Table from "../../components/Table";
import ModalImg from "../../components/Modal/ModalImg";
import { useRouter } from "next/router";
import { PurchaseProps } from "../../interfaces/product";
import dateFormat from "dateformat";
import DropDown from "../../components/DropDown";
import { updateStatus } from "../../services/purchase";
import toast from "react-hot-toast";

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

const getFilteredStatusList = (currentStatus: string) => {
  const currentIndex = statusOrder.indexOf(currentStatus);

  if (currentStatus === "pending" || currentStatus === "processing") {
    return listStatus.filter(
      (status) => statusOrder.indexOf(status.value) >= currentIndex
    );
  }

  // Hiển thị tất cả các trạng thái, bao gồm "cancelled"
  return listStatus.filter(
    (status) => statusOrder.indexOf(status.value) >= currentIndex
  );
};

const Purchase = ({ loading }: { loading: Boolean }) => {
  const [dataPurchase, setDataPurchase] = useState<PurchaseProps[]>([]);
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const fetchAllPurchase = async () => {
    try {
      const res = await getPurchaseAll();
      setDataPurchase(res.data.result);
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
      const res = await updateStatus({ id, status: selectedItem.value });
      if (res.status === 200) {
        toast.success("Cập nhật trạng thái đơn hàng thành công!");
        fetchAllPurchase();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleRowClick = (id: string) => {
    router.push(`/purchase/${id}`); // Điều hướng đến trang chi tiết
  };

  const dataSourcePurchase = useMemo(() => {
    const filteredPurchases = dataPurchase.filter((item) => {
      const fullName = `${item.user.firstName} ${item.user.lastName}`;
      const matchesSearchTerm =
        fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.nameProd.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        selectedStatus === "" || item.status === selectedStatus;
      return matchesSearchTerm && matchesStatus;
    });

    return filteredPurchases.map((item, index) => {
      return [
        <> {index + 1}</>,
        <div className="text-primary font-bold">
          {item.user.firstName} {item.user.lastName}
        </div>,
        <div>{item.nameProd}</div>,
        <div>{item.sizeProd}</div>,
        <div>{item.colorProd}</div>,
        <img
          className="w-1/2 cursor-pointer rounded-lg object-cover"
          src={item.imageProd}
        />,
        <p>{item?.priceProd.toLocaleString("vi")} đ</p>,
        <p>{item.quantityProd}</p>,
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
      ];
    });
  }, [dataPurchase, searchTerm, selectedStatus]);

  return (
    <>
      {loading && <LoadingPage />}
      <ContentHeader
        title="Quản lý sản phẩm đã bán"
        name="Danh sách sản phẩm đã bán"
      />
      <div className="flex justify-between items-end">
        <div className="mb-4">
          <form action="">
            <input
              id="search"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm người mua, sản phẩm..."
              className="border p-2 w-[300px] text-white bg-black border-green-500 rounded-lg"
            />
          </form>
        </div>
        <div className="mb-4 flex flex-col space-y-2">
          <label htmlFor="status" className="text-white">
            Lọc theo trạng thái
          </label>
          <select
            id="status"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-xl p-2 bg-black border-[1px] border-green-500 text-white"
          >
            <option value="">Tất cả</option>
            {listStatus.map((status) => (
              <option key={status.value} value={status.value}>
                {status.title}
              </option>
            ))}
          </select>
        </div>
      </div>
      <Card>
        <Card.Content>
          <Table
            columns={columnPurchase}
            dataSource={dataSourcePurchase}
            // onRowClick={handleRowClick} // Uncomment to enable row click handling
          />
        </Card.Content>
      </Card>
    </>
  );
};

Purchase.getLayout = function getLayout(page: ReactElement) {
  return <MainAdmin>{page}</MainAdmin>;
};

export default Purchase;

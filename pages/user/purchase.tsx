import Cookies from "js-cookie";
import React, { ReactElement, useEffect, useState } from "react";
import { CustomHeader } from "../../components/Header/CustomHeader";
import MainClient from "../../components/Layouts/MainClient";
import { getPurchaseOrder, updateOrderStatus } from "../../services/product";
import jwt_decode from "jwt-decode";
import { PurchaseProps } from "../../interfaces/product";
import { BsTruck } from "react-icons/bs";
import { MdOutlineDeleteSweep } from "react-icons/md";
import LoadingPage from "../../components/Loading/LoadingPage";
import ModalCancel from "../../components/Modal/ModalCancel";
import Button from "../../components/Button";
import toast from "react-hot-toast";
import { deleteOrderGuest, getOrderGuestByPhone } from "../../services/guest";
import { FaPencilAlt } from "react-icons/fa";
import { getOrderStatusInVietnamese } from "../../utils/statusOrder";

const listStatus = [
  { title: "Tất cả", value: "all" },
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

const Purchase = ({ loading }: { loading: Boolean }) => {
  const [listPurchase, setListPurchase] = useState<PurchaseProps[]>();
  const [listPurchaseGuest, setListPurchaseGuest] = useState<any[]>();

  const token = Cookies.get("token");
  const [openModalCancel, setOpenModalCancel] = useState(false);
  const [itemCancel, setItemCancel] = useState<PurchaseProps>();
  const [loadingCancel, setLoadingCancel] = useState(false);
  const [phoneFind, setPhoneFind] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const fetchPurchase = async (id: string) => {
    try {
      const res = await getPurchaseOrder(id);
      setListPurchase(res.data.result);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateOrderStatus = async (id: string, status: string) => {
    setLoadingCancel(true);
    try {
      if (token) {
        const res = await updateOrderStatus(id, status);
        if (res.status === 200) {
          const decoded: any = jwt_decode(token);
          await fetchPurchase(decoded.id);
          setOpenModalCancel(false);
          toast.success("Đã cập nhật trạng thái đơn hàng");
        }
      } else {
        const res = await deleteOrderGuest(id);
        if (res.status === 200) {
          await handleFindOrderGuest();
          setOpenModalCancel(false);
          toast.success("Đã cập nhật trạng thái đơn hàng");
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Có lỗi xảy ra khi cập nhật trạng thái đơn hàng");
    }
    setLoadingCancel(false);
  };

  const handleFindOrderGuest = async () => {
    const res = await getOrderGuestByPhone(phoneFind.slice(1));
    if (res.data.error) {
      toast.error(res.data.error);
    } else {
      setListPurchaseGuest(res.data);
    }
  };

  useEffect(() => {
    if (token) {
      const decoded: any = jwt_decode(token);
      fetchPurchase(decoded.id);
    }
  }, [token]);

  const filterOrders = (orders: any) => {
    if (selectedStatus === "all") {
      return orders;
    }
    return orders.filter((order: any) => order.status === selectedStatus);
  };

  const filteredPurchase = filterOrders(listPurchase || []);
  const filteredPurchaseGuest = filterOrders(listPurchaseGuest || []);

  return (
    <div>
      {loading && <LoadingPage />}
      <CustomHeader title="Đơn mua">
        <title>Đơn mua | Cuc Shoes</title>
      </CustomHeader>
      <ModalCancel
        open={openModalCancel}
        setOpen={setOpenModalCancel}
        title="Cập nhật trạng thái đơn hàng này?"
      >
        <div className="flex items-center justify-center gap-10 mt-10">
          <Button
            onClick={() => setOpenModalCancel(false)}
            className="w-40"
            label="Không"
            variant="outline"
          />
          <Button
            onClick={() => {
              itemCancel &&
                handleUpdateOrderStatus(itemCancel?.id, "cancelled");
            }}
            className="w-40"
            label="Huỷ Đơn"
            loading={loadingCancel}
          />
        </div>
      </ModalCancel>
      {!token && (
        <div className="flex items-center justify-center gap-2 mb-5">
          <input
            className="bg-transparent border-white/20 border px-4 py-2 text-white rounded-lg"
            placeholder="Số điện thoại"
            onChange={(e) => setPhoneFind(e.target.value)}
            type="text"
          />
          <Button onClick={handleFindOrderGuest} label="Tìm" />
        </div>
      )}

      <div className="w-full lg:w-2/3 mx-auto pb-8">
        <div className="flex text-white justify-between py-7 bg-[#212B36] mb-5 px-4 rounded-xl">
          {listStatus.map((item) => (
            <div
              key={item.value}
              className={`hover:cursor-pointer hover:text-green-500 ${
                selectedStatus === item.value ? "text-green-500" : ""
              }`}
              onClick={() => setSelectedStatus(item.value)}
            >
              {item.title}
            </div>
          ))}
        </div>
        {filteredPurchase.length > 0 || filteredPurchaseGuest.length > 0 ? (
          <div>
            {(filteredPurchase.length > 0
              ? filteredPurchase
              : filteredPurchaseGuest
            ).map((item: any, idx: any) => (
              <div
                className="bg-[rgb(33,43,54)] rounded-xl mb-4 last:mb-0 p-6 "
                key={idx}
              >
                <div className="mb-3 flex items-center justify-end space-x-2 text-green-500 text-sm">
                  <BsTruck /> <p>{getOrderStatusInVietnamese(item.status)}</p>
                </div>
                <div className="flex flex-col lg:flex-row items-start justify-between">
                  <div className="flex items-start space-x-5 lg:w-fit">
                    <img
                      className="w-20 h-20 object-cover rounded-md border border-dashed border-color-primary"
                      src={item?.imageProd}
                      alt={item?.nameProd}
                    />
                    <div className="text-white">
                      <p className="text-base lg:text-xl font-bold">
                        {item?.nameProd}
                      </p>
                      <p className="text-sm text-[rgb(145,158,171)]">
                        Size: {item?.sizeProd}
                      </p>
                      <p className="text-sm text-[rgb(145,158,171)] flex items-center">
                        Màu sắc:{" "}
                        <span
                          className="ml-2 w-4 h-4 rounded-full block"
                          style={{ backgroundColor: item?.colorProd }}
                        />
                      </p>
                      <p className="text-sm font-semibold">
                        x{item?.quantityProd}
                      </p>
                    </div>
                  </div>
                  <div className="flex lg:flex-col lg:w-fit w-full mt-5 lg:mt-0 justify-between items-center lg:items-end lg:space-y-5">
                    <div className="flex items-start space-x-2 text-white">
                      <p className="text-sm font-semibold whitespace-nowrap">
                        Thành tiền:
                      </p>
                      <div className="flex flex-col gap-1">
                        <p
                          className={`text-base text-red-500 font-semibold whitespace-nowrap ${
                            item.finalPrice !== item.priceProd && "line-through"
                          }`}
                        >
                          {(
                            item?.quantityProd * item?.priceProd
                          ).toLocaleString("vi")}{" "}
                          đ
                        </p>
                        {item.finalPrice !== item.priceProd && (
                          <p className="text-sm text-red-500 font-semibold whitespace-nowrap">
                            {item.finalPrice?.toLocaleString("vi")} đ
                          </p>
                        )}
                      </div>
                    </div>
                    {item.status === "pending" && (
                      <button
                        onClick={() => {
                          setItemCancel(item);
                          setOpenModalCancel(true);
                        }}
                        className="text-white hover:bg-red-700 hover:bg-opacity-10 max-w-[140
px] border-2 border-red-500 px-4 py-2 rounded-md text-sm"
                      >
                        <div className="flex items-center space-x-2">
                          <MdOutlineDeleteSweep />
                          <p>Huỷ Đơn</p>
                        </div>
                      </button>
                    )}
                    {item.status === "shipped" && (
                      <button
                        onClick={() => {
                          setItemCancel(item);
                          setOpenModalCancel(true);
                        }}
                        className="text-white hover
hover
max-w-[140px] border-2 border-red-500 px-4 py-2 rounded-md text-sm"
                      >
                        <div className="flex items-center space-x-2">
                          <FaPencilAlt />
                          <p>Trả hàng</p>
                        </div>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-white text-center text-lg font-semibold">
            Không có đơn hàng nào
          </div>
        )}
      </div>
    </div>
  );
};

Purchase.getLayout = function getLayout(page: ReactElement) {
  return <MainClient>{page}</MainClient>;
};

export default Purchase;

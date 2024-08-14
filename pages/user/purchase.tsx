import Cookies from "js-cookie";
import React, { ReactElement, useEffect, useState } from "react";
import { CustomHeader } from "../../components/Header/CustomHeader";
import MainClient from "../../components/Layouts/MainClient";
import { deletePurchase, getPurchaseOrder } from "../../services/product";
import jwt_decode from "jwt-decode";
import { PurchaseProps } from "../../interfaces/product";
import { BsTruck } from "react-icons/bs";
import { MdOutlineDeleteSweep } from "react-icons/md";
import LoadingPage from "../../components/Loading/LoadingPage";
import ModalCancel from "../../components/Modal/ModalCancel";
import Button from "../../components/Button";
import toast from "react-hot-toast";
import { getOrderStatusInVietnamese } from "../../utils/statusOrder";
import { deleteOrderGuest, getOrderGuestByPhone } from "../../services/guest";
import { FaPencilAlt } from "react-icons/fa";

const Purchase = ({ loading }: { loading: Boolean }) => {
  const [listPurchase, setListPurchase] = useState<PurchaseProps[]>();
  const [listPurchaseGuest, setListPurchaseGuest] = useState<any[]>();

  const token = Cookies.get("token");
  const [openModalCancel, setOpenModalCancel] = useState(false);
  const [itemCancel, setItemCancel] = useState<PurchaseProps>();
  const [loadingCancel, setLoadingCancel] = useState(false);
  const [phoneFind, setPhoneFind] = useState("");
  const fetchPurchase = async (id: string) => {
    try {
      const res = await getPurchaseOrder(id);
      setListPurchase(res.data.result);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeletePurchase = async (id: string) => {
    setLoadingCancel(true);
    try {
      if (token) {
        const res = await deletePurchase(id);
        if (res.status === 200 && token) {
          const decoded: any = jwt_decode(token);
          await fetchPurchase(decoded.id);
          setOpenModalCancel(false);
          toast.success("Đã huỷ đơn hàng");
        }
      } else {
        const res = await deleteOrderGuest(id);
        if (res.status === 200) {
          await handleFindOrderGuest();
          setOpenModalCancel(false);
          toast.success("Đã huỷ đơn hàng");
        }
      }
    } catch (error) {
      console.log(error);
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

  console.log({ listPurchaseGuest });

  useEffect(() => {
    if (token) {
      const decoded: any = jwt_decode(token);
      fetchPurchase(decoded.id);
    }
  }, [token]);

  const Status = [
    "Tất cả",
    "Đang chờ",
    "Đang xử lý",
    "Đang giao hàng",
    "Đã giao thành công",
    "Đã huỷ",
  ];

  const [selectedStatus, setSelectedStatus] = useState("Tất cả");

  const filterOrders = (orders: any) => {
    if (selectedStatus === "Tất cả") {
      return orders;
    }
    return orders.filter(
      (order: any) =>
        getOrderStatusInVietnamese(order.status) === selectedStatus
    );
  };

  const filteredPurchase = filterOrders(listPurchase || []);

  console.log(filteredPurchase, "filteredPurchase");
  const filteredPurchaseGuest = filterOrders(listPurchaseGuest || []);
  console.log(filteredPurchaseGuest, "filteredPurchaseGuest");

  return (
    <div>
      {loading && <LoadingPage />}
      <CustomHeader title="Đơn mua">
        <title>Đơn mua | Cuc Shoes</title>
      </CustomHeader>
      <ModalCancel
        open={openModalCancel}
        setOpen={setOpenModalCancel}
        title="Huỷ đơn hàng này?"
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
              itemCancel && handleDeletePurchase(itemCancel?.id);
            }}
            className="w-40"
            label="Huỷ đơn"
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

      {token ? (
        <div className="w-full lg:w-2/3 mx-auto pb-8">
          <div className="flex text-white justify-between py-7 bg-[#212B36] mb-5 px-4 rounded-xl">
            {Status.map((item) => (
              <div
                key={item}
                className={`hover:cursor-pointer hover:text-green-500 ${
                  selectedStatus === item ? "text-green-500" : ""
                }`}
                onClick={() => setSelectedStatus(item)}
              >
                {item}
              </div>
            ))}
          </div>
          {filteredPurchase && filteredPurchase?.length > 0 ? (
            <div>
              {filteredPurchase?.map((item: any, idx: any) => (
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
                              item.finalPrice !== item.priceProd &&
                              "line-through"
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
                          // onClick={() => handleDeletePurchase(item?.id)}
                          onClick={() => {
                            setItemCancel(item);
                            setOpenModalCancel(true);
                          }}
                          className="text-white hover:bg-red-700 hover:bg-opacity-10 max-w-[140px] flex items-center justify-center space-x-2 border border-color-primary px-1 py-2 rounded-md"
                        >
                          <span className="font-bold text-sm flex items-center space-x-1">
                            <MdOutlineDeleteSweep /> <p>Hủy đơn</p>
                          </span>
                        </button>
                      )}
                      {item.status === "delivered" && (
                        <button
                          // onClick={() => handleDeletePurchase(item?.id)}

                          className="text-white hover:bg-red-700 hover:bg-opacity-10 max-w-[140px] flex items-center justify-center space-x-2 border border-color-primary px-1 py-2 rounded-md"
                        >
                          <span className="font-bold text-sm flex items-center space-x-1">
                            <FaPencilAlt />
                            <p>Đánh Giá</p>
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>
              <p className="flex text-white w-full justify-center items-center text-xl sm:text-2xl font-bold py-40 opacity-50">
                {token
                  ? "Bạn chưa từng mua đơn hàng nào!!"
                  : "Tra cứu đơn của bạn"}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full lg:w-2/3 mx-auto pb-8">
          {filteredPurchaseGuest && filteredPurchaseGuest?.length > 0 ? (
            <div>
              {filteredPurchaseGuest?.map((item: any, idx: any) => {
                const product = JSON.parse(item.products);
                return (
                  <div
                    className="bg-[rgb(33,43,54)] rounded-xl mb-4 last:mb-0 p-6 "
                    key={idx}
                  >
                    <div className="mb-3 flex items-center justify-end space-x-2 text-green-500 text-sm">
                      <BsTruck />{" "}
                      <p>{getOrderStatusInVietnamese(item.status)}</p>
                    </div>
                    <div className="flex flex-col lg:flex-row items-start justify-between">
                      <div className="flex items-start space-x-5 lg:w-fit">
                        <img
                          className="w-20 h-20 object-cover rounded-md border border-dashed border-color-primary"
                          src={product?.image}
                          alt={product?.name}
                        />
                        <div className="text-white">
                          <p className="text-base lg:text-xl font-bold">
                            {product?.name}
                          </p>
                          <p className="text-sm text-[rgb(145,158,171)]">
                            Size: {product?.size}
                          </p>
                          <p className="text-sm text-[rgb(145,158,171)] flex items-center">
                            Màu sắc:{" "}
                            <span
                              className="ml-2 w-4 h-4 rounded-full block"
                              style={{ backgroundColor: product?.color }}
                            />
                          </p>
                          <p className="text-sm font-semibold">
                            x{product?.quantity}
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
                                item.finalPrice !==
                                  product.price * product.quantity &&
                                "line-through"
                              }`}
                            >
                              {(
                                product?.quantity * product?.price
                              ).toLocaleString("vi")}{" "}
                              đ
                            </p>
                            {item.finalPrice !==
                              product.price * product.quantity && (
                              <p className="text-sm text-red-500 font-semibold whitespace-nowrap">
                                {item.finalPrice?.toLocaleString("vi")} đ
                              </p>
                            )}
                          </div>
                        </div>
                        <button
                          // onClick={() => handleDeletePurchase(item?.id)}
                          onClick={() => {
                            setItemCancel(item);
                            setOpenModalCancel(true);
                          }}
                          className="text-white hover:bg-red-700 hover:bg-opacity-10 max-w-[140px] flex items-center justify-center space-x-2 border border-color-primary px-1 py-2 rounded-md"
                        >
                          <span className="font-bold text-sm flex items-center space-x-1">
                            <MdOutlineDeleteSweep /> <p>Hủy đơn</p>
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div>
              <p className="flex text-white w-full justify-center items-center text-xl sm:text-2xl font-bold py-40 opacity-50">
                {token
                  ? "Bạn chưa từng mua đơn hàng nào!!"
                  : "Tra cứu đơn của bạn"}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

Purchase.getLayout = function getLayout(page: ReactElement) {
  return <MainClient>{page}</MainClient>;
};

export default Purchase;

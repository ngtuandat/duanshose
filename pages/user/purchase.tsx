import Cookies from "js-cookie";
import React, { ReactElement, useCallback, useEffect, useState } from "react";
import { CustomHeader } from "../../components/Header/CustomHeader";
import MainClient from "../../components/Layouts/MainClient";
import {
  addReview,
  addToCart,
  getDetailProduct,
  getPurchaseOrder,
  getRatingStarProd,
  updateOrderStatus,
} from "../../services/product";
import jwt_decode from "jwt-decode";
import {
  ListProduct,
  PurchaseProps,
  RatingStarProps,
} from "../../interfaces/product";
import { BsTruck } from "react-icons/bs";
import { MdOutlineDeleteSweep } from "react-icons/md";
import LoadingPage from "../../components/Loading/LoadingPage";
import ModalCancel from "../../components/Modal/ModalCancel";
import Button from "../../components/Button";
import toast from "react-hot-toast";
import {
  deleteOrderGuest,
  getOrderGuestByPhone,
  updateStatusGuest,
} from "../../services/guest";
import { FaPencilAlt } from "react-icons/fa";
import {
  getOrderStatusInVietnamese,
  getStatusColor,
} from "../../utils/statusOrder";
import { useRouter } from "next/router";
import RatingReview from "../../components/Rating/RatingReview";
import Modal from "../../components/Modal";
import Review from "../../containers/Review";
import { useCart } from "../../contexts/cart/CartContext";
import ReviewDone from "../../containers/ReviewDone";
import Link from "next/link";
import Footer from "../../components/Footer";

const listStatus = [
  { title: "Tất cả", value: "all" },
  { title: "Đang chờ", value: "pending" },
  { title: "Đang xử lý", value: "processing" },
  { title: "Chờ giao hàng", value: "shipped" },
  { title: "Đã giao", value: "transferred" },
  { title: "Đã giao thành công", value: "delivered" },
  { title: "Đã hủy", value: "cancelled" },
  { title: "Trả hàng", value: "returns" },
  { title: "Yêu cầu trả hàng", value: "requestreturn" },
];

const statusOrder = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "returns",
  "requestreturn",
];

interface ReviewModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  fetchDetail: (id: string | string[]) => Promise<void>;
  fetchRating: (id: string) => Promise<void>;
}

const Purchase = ({ loading }: { loading: Boolean }) => {
  const router = useRouter();
  const token = Cookies.get("token");
  const { count, fetchCart } = useCart();
  const [listPurchase, setListPurchase] = useState<PurchaseProps[]>();
  console.log(listPurchase, "listPurchase");
  const [listPurchaseGuest, setListPurchaseGuest] = useState<any[]>();

  const [openModalCancel, setOpenModalCancel] = useState(false);
  const [openModalReturn, setOpenModalReturn] = useState(false);
  const [openModalConfirm, setOpenModalConfirm] = useState(false);
  const [openModalRequestreturn, setopenModalRequestreturn] = useState(false);
  const [openWriteReview, setOpenWriteReview] = useState(false);

  const [searchTriggered, setSearchTriggered] = useState(false);

  // New state for return modal

  const [itemCancel, setItemCancel] = useState<PurchaseProps>();
  console.log(itemCancel, "itemCancel");
  const [loadingCancel, setLoadingCancel] = useState(false);
  const [phoneFind, setPhoneFind] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const [currentStar, setCurrentStar] = useState<number>();
  const [errStar, setErrStar] = useState<string>();
  const [contentReview, setContentReview] = useState<string>("");
  const [nameUser, setNameUser] = useState<string>("");

  const fetchPurchase = async (id: string) => {
    try {
      const res = await getPurchaseOrder(id);
      setListPurchase(res.data.result);
    } catch (error) {
      console.error("Lỗi khi lấy đơn hàng:", error);
      toast.error("Không thể lấy dữ liệu đơn hàng.");
    }
  };

  const handleUpdateOrderStatus = async (id: string, status: string) => {
    setLoadingCancel(true);
    try {
      let res;

      if (token) {
        // Nếu có token, gọi API cập nhật trạng thái đơn hàng của người dùng đã đăng nhập
        res = await updateOrderStatus(id, status);
        // Cập nhật danh sách đơn hàng của người dùng đã đăng nhập
        if (res.status === 200) {
          setListPurchase((prevList: any) =>
            prevList?.map((order: any) =>
              order.id === id ? { ...order, status } : order
            )
          );
        }
      } else {
        // Nếu không có token, gọi API cập nhật trạng thái đơn hàng của khách
        if (status === "cancelled") {
          res = await updateStatusGuest({ id, status: "cancelled" });
        } else {
          // Nếu không phải trạng thái "cancelled", không cần thay đổi
          res = await updateStatusGuest({ id, status });
        }
        // Cập nhật danh sách đơn hàng của khách
        if (res.status === 200) {
          setListPurchaseGuest((prevList: any) =>
            prevList?.map((order: any) =>
              order.id === id ? { ...order, status } : order
            )
          );
        }
      }

      if (res.status === 200) {
        // Đóng các modal nếu mở
        setOpenModalCancel(false);
        setOpenModalReturn(false);
        setOpenModalConfirm(false);
        setopenModalRequestreturn(false);

        // Hiển thị thông báo thành công
        toast.success("Đã cập nhật trạng thái đơn hàng");
      } else {
        toast.error("Không thể cập nhật trạng thái đơn hàng");
      }
    } catch (error) {
      console.log(error);
      toast.error("Có lỗi xảy ra khi cập nhật trạng thái đơn hàng");
    } finally {
      setLoadingCancel(false);
    }
  };

  const handleFindOrderGuest = useCallback(async (phone: string) => {
    try {
      const res = await getOrderGuestByPhone(phone.slice(1)); // Ví dụ: slice(1) để loại bỏ ký tự đầu tiên
      if (res.data.error) {
        toast.error(res.data.error);
      } else {
        setListPurchaseGuest(res.data);
      }
    } catch (error) {
      console.error("Error fetching guest orders:", error);
    }
  }, []);

  // Xử lý thay đổi trong input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPhone = e.target.value;
    setPhoneFind(newPhone);

    if (newPhone === "") {
      // Nếu số điện thoại bị xóa hết, ẩn sản phẩm
      setListPurchaseGuest([]);
      setSearchTriggered(false);
    }
  };

  // Xử lý nhấn nút tìm kiếm
  const handleSearchClick = () => {
    setSearchTriggered(true);
    if (phoneFind) {
      handleFindOrderGuest(phoneFind);
    }
  };

  const checkAndUpdateOrderStatus = async (orders: PurchaseProps[]) => {
    const now = new Date();
    for (const order of orders) {
      {
        console.log(order, "orderr");
      }
      const orderDate = new Date(order.createdAt);
      const diffDays = Math.floor(
        (now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (order.status === "shipped" && diffDays >= 1) {
        await handleUpdateOrderStatus(order.id, "delivered");
      }
    }
  };

  // const checkAndUpdateOrderStatus = async (orders: PurchaseProps[]) => {
  //   const now = new Date();
  //   for (const order of orders) {
  //     console.log(order, "orderr");
  //     const orderDate = new Date(order.createdAt);
  //     const diffMinutes = Math.floor(
  //       (now.getTime() - orderDate.getTime()) / (1000 * 60) // Tính bằng phút
  //     );
  //     if (order.status === "shipped" && diffMinutes >= 3) {
  //       // Kiểm tra sau 3 phút
  //       await handleUpdateOrderStatus(order.id, "delivered");
  //     }
  //   }
  // };

  // const isReturnable = (orderDate: Date) => {
  //   const now = new Date();
  //   const diffMinutes = Math.floor(
  //     (now.getTime() - orderDate.getTime()) / (1000 * 60)
  //   );
  //   return diffMinutes <= 3;
  // };

  const isReturnable = (orderDate: Date) => {
    const now = new Date();
    const diffDays = Math.floor(
      (now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    return diffDays <= 7;
  };

  useEffect(() => {
    if (token) {
      const decoded: any = jwt_decode(token);
      fetchPurchase(decoded.id);
    }
  }, [token]);

  useEffect(() => {
    if (listPurchase) {
      checkAndUpdateOrderStatus(listPurchase);
    }
  }, [listPurchase]);

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
        <title>Đơn mua | FitFusionZone</title>
      </CustomHeader>
      <ModalCancel
        open={openModalCancel}
        setOpen={setOpenModalCancel}
        title="Xác nhận huỷ đơn hàng này?"
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
            className="w-40 bg-red-500 hover:bg-red-600 text-white"
            label="Huỷ Đơn"
            loading={loadingCancel}
          />
        </div>
      </ModalCancel>
      {/* New Modal for Return Confirmation */}
      <ModalCancel
        open={openModalReturn}
        setOpen={setOpenModalReturn}
        title="Bạn có muốn trả hàng không?"
      >
        <div className="mt-4">
          <p className="text-sm text-gray-600">
            Nội quy trả hàng:
            <ul className="list-disc list-inside mt-2">
              <li>Sản phẩm phải còn nguyên tem mác và chưa qua sử dụng.</li>
              <li>
                Đơn hàng trả hàng phải được thực hiện trong vòng 7 ngày kể từ
                ngày nhận hàng.
              </li>
              <li>
                Vui lòng giữ lại biên lai mua hàng và hóa đơn để việc trả hàng
                được xử lý nhanh chóng.
              </li>
            </ul>
          </p>
        </div>
        <div className="flex items-center justify-center gap-10 mt-10">
          <Button
            onClick={() => setOpenModalReturn(false)}
            className="w-40"
            label="Không"
            variant="outline"
          />
          <Button
            onClick={() => {
              if (itemCancel) {
                handleUpdateOrderStatus(itemCancel?.id, "requestreturn");
              }
            }}
            className="w-40 bg-orange-500 hover:bg-orange-600 text-white"
            label="Trả Hàng"
            loading={loadingCancel}
          />
        </div>
      </ModalCancel>

      <ModalCancel
        open={openModalConfirm}
        setOpen={setOpenModalConfirm}
        title="Xác nhận đã nhận hàng?"
      >
        <div className="flex items-center justify-center gap-10 mt-10">
          <Button
            onClick={() => setOpenModalConfirm(false)}
            className="w-40"
            label="Đóng"
            variant="outline"
          />
          <Button
            onClick={() => {
              itemCancel &&
                handleUpdateOrderStatus(itemCancel?.id, "delivered");
            }}
            className="w-40 bg-blue-500 hover:bg-blue-600 text-white"
            label="Đã Nhận"
            loading={loadingCancel}
          />
        </div>
      </ModalCancel>
      <ModalCancel
        open={openModalRequestreturn}
        setOpen={setopenModalRequestreturn}
        title="Xác nhận huỷ trả hàng?"
      >
        <div className="flex items-center justify-center gap-10 mt-10">
          <Button
            onClick={() => setOpenModalConfirm(false)}
            className="w-40"
            label="Đóng"
            variant="outline"
          />
          <Button
            onClick={() => {
              itemCancel &&
                handleUpdateOrderStatus(itemCancel?.id, "delivered");
            }}
            className="w-40"
            label="Xác Nhận"
            loading={loadingCancel}
          />
        </div>
      </ModalCancel>

      {/* {!token && (
        <div className="flex items-center justify-center gap-2 mb-5">
          <input
            className="bg-transparent border-white/20 border px-4 py-2 text-white rounded-lg"
            placeholder="Số điện thoại"
            onChange={(e) => setPhoneFind(e.target.value)}
            type="text"
          />
          <Button onClick={handleFindOrderGuest} label="Tìm" />
        </div>
      )} */}
      {!token && (
        <div className="flex items-center justify-center gap-2 mb-5">
          <input
            className="bg-transparent border-white/20 border px-4 py-2 text-white rounded-lg"
            placeholder="Số điện thoại"
            value={phoneFind}
            onChange={handleInputChange}
            type="text"
          />
          <Button onClick={handleSearchClick} label="Tìm" />
        </div>
      )}

      {token ? (
        <div className="w-full lg:w-2/3 mx-auto pb-8">
          <div className="flex text-white justify-between py-7 bg-[#212B36] mb-5 px-4 rounded-xl">
            {listStatus
              .filter((item) => item.value !== "requestreturn")
              .map((item) => (
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
                  className={`bg-[rgb(33,43,54)] rounded-xl mb-4 last:mb-0 p-6 ${
                    item.status === "requestreturn" && "border border-red-500"
                  }`}
                  key={idx}
                >
                  <div
                    className={`mb-3 flex items-center justify-end space-x-2 text-sm   ${getStatusColor(
                      item.status
                    )}`}
                  >
                    <BsTruck /> <p>{getOrderStatusInVietnamese(item.status)}</p>
                  </div>
                  <div className="flex flex-col lg:flex-row items-start justify-between">
                    <div className="flex items-start space-x-5 lg:w-fit">
                      <div className="bg-white w-20 h-20 rounded-md flex items-center justify-center overflow-hidden">
                        <img
                          className="object-contain w-full h-full"
                          src={item?.imageProd}
                          alt={item?.nameProd}
                        />
                      </div>

                      <div className="text-white">
                        <p className="text-base lg:text-xl font-bold max-w-[400px]">
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
                        <p className="text-sm text-[rgb(145,158,171)]">
                          Giá: {item?.priceProd}đ
                        </p>
                        <p className="text-sm text-[rgb(145,158,171)]">
                          Số lượng: {item?.quantityProd}
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-start justify-end space-x-2 text-white mb-2">
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
                              {console.log(item.finalPrice, "loghogia")}
                              {item.finalPrice?.toLocaleString("vi")} đ
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-end mb-3 text-white">
                        Chi tiết đơn
                      </div>
                      <div className="flex flex-col items-end">
                        {item?.status === "pending" && (
                          <div className="flex items-center space-x-4">
                            <Button
                              className="bg-red-500 hover:bg-red-600"
                              onClick={() => {
                                setItemCancel(item);
                                setOpenModalCancel(true);
                              }}
                              icon={<MdOutlineDeleteSweep />}
                              label="Huỷ Đơn"
                            />
                          </div>
                        )}
                        {item?.status === "transferred" && (
                          <div className="flex items-center space-x-4">
                            <Button
                              className="bg-blue-500 hover:bg-blue-600 text-white"
                              onClick={() => {
                                setItemCancel(item);
                                setOpenModalConfirm(true);
                              }}
                              icon={<FaPencilAlt />}
                              label="Đã Nhận Hàng"
                            />
                          </div>
                        )}
                        <div className="">
                          {isReturnable(new Date(item.createdAt)) &&
                            item?.status === "delivered" && (
                              <div className="flex items-center space-x-4 ">
                                <Button
                                  className="bg-orange-500 hover:bg-orange-600"
                                  onClick={() => {
                                    setItemCancel(item);
                                    setOpenModalReturn(true); // Open return modal
                                  }}
                                  icon={<FaPencilAlt />}
                                  label="Trả Hàng"
                                />
                              </div>
                            )}
                        </div>
                        {item?.status === "requestreturn" && (
                          <div className="flex items-center space-x-4">
                            <Button
                              className="bg-gray-500 hover:bg-gray-600"
                              onClick={() => {
                                setItemCancel(item);
                                setopenModalRequestreturn(true);
                              }}
                              icon={<FaPencilAlt />}
                              label="Huỷ Trả Hàng"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full text-center">
              <p className="text-[#8692A6]">Không có đơn hàng nào</p>
            </div>
          )}
        </div>
      ) : (
        ///đây là phần khách hàng vãn lai
        <div className="w-full lg:w-2/3 mx-auto pb-8">
          {filteredPurchaseGuest &&
            filteredPurchaseGuest
              .slice() // Tạo bản sao của mảng để không làm thay đổi mảng gốc
              .sort(
                (a: any, b: any) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
              ) // Sắp xếp theo thời gian tạo mới nhất lên đầu
              .map((item: any, idx: any) => {
                const product = Array.isArray(JSON.parse(item.products))
                  ? JSON.parse(item.products)
                  : []; // Đảm bảo product luôn là một mảng

                // Tính tổng giá trị sản phẩm
                const totalPrice = product.reduce(
                  (total: number, productItem: any) =>
                    total + productItem.price * productItem.quantity,
                  0
                );

                return (
                  <div
                    className="bg-[rgb(33,43,54)] rounded-xl mb-4 last:mb-0 p-6"
                    key={idx}
                  >
                    <div
                      className={`mb-3 flex items-center justify-end space-x-2 text-sm ${getStatusColor(
                        item.status
                      )}`}
                    >
                      <BsTruck />{" "}
                      <p>{getOrderStatusInVietnamese(item.status)}</p>
                    </div>
                    <div className="flex flex-col lg:flex-row items-start justify-between">
                      <div className="flex flex-col space-y-4 lg:w-fit">
                        {product.map((productItem: any, index: number) => (
                          <div
                            className="flex items-start space-x-5"
                            key={index}
                          >
                            <div className="bg-white w-20 h-20 rounded-md flex items-center justify-center overflow-hidden">
                              <img
                                className="object-contain w-full h-full"
                                src={productItem.image}
                                alt={productItem.name}
                              />
                            </div>
                            <div className="text-white">
                              <p className="text-base lg:text-xl font-bold max-w-[400px]">
                                {productItem.name}
                              </p>
                              <p className="text-sm text-[rgb(145,158,171)]">
                                Size: {productItem.size}
                              </p>
                              <p className="text-sm text-[rgb(145,158,171)] flex items-center">
                                Màu sắc:{" "}
                                <span
                                  className="ml-2 w-4 h-4 rounded-full block"
                                  style={{
                                    backgroundColor: productItem.color,
                                  }}
                                />
                              </p>
                              <p className="text-sm font-semibold">
                                x{productItem.quantity}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div>
                        <div className="flex items-start justify-end space-x-2 text-white mb-5">
                          <p className="text-sm font-semibold whitespace-nowrap">
                            Thành tiền:
                          </p>
                          <div className="flex flex-col gap-1">
                            <p
                              className={`text-base font-semibold whitespace-nowrap ${
                                item.finalPrice !== totalPrice
                                  ? "text-red-500"
                                  : "text-white"
                              }`}
                            >
                              {totalPrice.toLocaleString("vi")}
                              {item.finalPrice !== totalPrice &&
                                item.finalPrice && (
                                  <> {item.finalPrice.toLocaleString("vi")} đ</>
                                )}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          {item?.status === "pending" && (
                            <div className="flex items-center space-x-4">
                              <Button
                                className="bg-red-500 hover:bg-red-600"
                                onClick={() => {
                                  setItemCancel(item);
                                  setOpenModalCancel(true);
                                }}
                                icon={<MdOutlineDeleteSweep />}
                                label="Huỷ Đơn"
                              />
                            </div>
                          )}
                          {item?.status === "transferred" && (
                            <div className="flex items-center space-x-4">
                              <Button
                                className="bg-blue-500 hover:bg-blue-600 text-white"
                                onClick={() => {
                                  setItemCancel(item);
                                  setOpenModalConfirm(true);
                                }}
                                icon={<FaPencilAlt />}
                                label="Đã Nhận Hàng"
                              />
                            </div>
                          )}
                          {item?.status === "requestreturn" && (
                            <div className="flex items-center space-x-4">
                              <Button
                                className="bg-gray-500 hover:bg-gray-600"
                                onClick={() => {
                                  setItemCancel(item);
                                  setopenModalRequestreturn(true);
                                }}
                                icon={<FaPencilAlt />}
                                label="Huỷ Trả Hàng"
                              />
                            </div>
                          )}
                          {isReturnable(new Date(item.createdAt)) &&
                            item?.status === "delivered" && (
                              <div className="flex items-center space-x-4">
                                <Button
                                  className="bg-orange-500 hover:bg-orange-600 text-white"
                                  onClick={() => {
                                    setItemCancel(item);
                                    setOpenModalReturn(true); // Open return modal
                                  }}
                                  icon={<FaPencilAlt />}
                                  label="Trả Hàng"
                                />
                              </div>
                            )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
        </div>
      )}
      {/* <Footer /> */}
    </div>
  );
};

Purchase.getLayout = function getLayout(page: ReactElement) {
  return <MainClient>{page}</MainClient>;
};

export default Purchase;

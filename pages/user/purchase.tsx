import Cookies from "js-cookie";
import React, { ReactElement, useEffect, useState } from "react";
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
import { deleteOrderGuest, getOrderGuestByPhone } from "../../services/guest";
import { FaPencilAlt } from "react-icons/fa";
import { getOrderStatusInVietnamese } from "../../utils/statusOrder";
import { useRouter } from "next/router";
import RatingReview from "../../components/Rating/RatingReview";
import Modal from "../../components/Modal";
import Review from "../../containers/Review";
import { useCart } from "../../contexts/cart/CartContext";
import ReviewDone from "../../containers/ReviewDone";
import Link from "next/link";

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
  const [openWriteReview, setOpenWriteReview] = useState(false);

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

  // const handleAddReview = async () => {
  //   try {
  //     if (!currentStar) {
  //       setErrStar("Hãy chọn số sao bạn muốn");
  //       return;
  //     }

  //     const commentUser = {
  //       idProduct: router.query.product,
  //       rating: Number(currentStar) + 1,
  //       name: nameUser,
  //       content: contentReview,
  //     };

  //     await addReview(commentUser);

  //     if (router.query.product) {
  //       // fetchDetail(router.query.product);
  //       fetchRating(String(router.query.product));
  //     }

  //     setOpenModalReview(false);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  // const handleAddReview = async () => {
  //   try {
  //     if (!currentStar) {
  //       setErrStar("Hãy chọn số sao bạn muốn");
  //       return;
  //     }

  //     const commentUser = {
  //       idProduct: router.query.product,
  //       rating: Number(currentStar) + 1,
  //       name: nameUser,
  //       content: contentReview,
  //     };

  //     const response = await addReview(commentUser);

  //     if (response.status === 200) {
  //       if (router.query.product) {
  //         fetchRating(String(router.query.product));
  //       }
  //       setOpenModalReview(false);
  //     } else {
  //       // Handle unexpected status codes
  //       toast.error(`Failed to add review: ${response.statusText}`);
  //     }
  //   } catch (error) {
  //     console.error("Error adding review:", error);
  //     toast.error("Có lỗi xảy ra khi thêm đánh giá.");
  //   }
  // };
  // const fetchDetailProduct = async (id: string | string[]) => {
  //   try {
  //     const res = await getDetailProduct(String(id));
  //     setDataProduct(res.data.detail);
  //     setSizeValue(res.data.detail.size[0]);
  //     setColorCheck(res.data.detail.color[0]);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  // useEffect(() => {
  //   if (token) {
  //     const decoded: any = jwt_decode(token);
  //     fetchCart(decoded.id);
  //   }
  //   if (router.query.product) {
  //     fetchDetailProduct(router.query.product);
  //   }
  // }, []);

  const fetchPurchase = async (id: string) => {
    try {
      const res = await getPurchaseOrder(id);
      setListPurchase(res.data.result);
    } catch (error) {
      console.error("Lỗi khi lấy đơn hàng:", error);
      toast.error("Không thể lấy dữ liệu đơn hàng.");
    }
  };

  // const handleUpdateOrderStatus = async (id: string, status: string) => {
  //   setLoadingCancel(true);
  //   try {
  //     if (token) {
  //       const res = await updateOrderStatus(id, status);
  //       if (res.status === 200) {
  //         const decoded: any = jwt_decode(token);
  //         await fetchPurchase(decoded.id); // Cập nhật lại danh sách đơn hàng
  //         setOpenModalCancel(false);
  //         setOpenModalReturn(false); // Close return modal if open
  //         toast.success("Đã cập nhật trạng thái đơn hàng");
  //       }
  //     } else {
  //       const res = await deleteOrderGuest(id);
  //       if (res.status === 200) {
  //         await handleFindOrderGuest(); // Cập nhật lại danh sách đơn hàng của khách
  //         setOpenModalCancel(false);
  //         setOpenModalReturn(false); // Close return modal if open
  //         toast.success("Đã cập nhật trạng thái đơn hàng");
  //       }
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     toast.error("Có lỗi xảy ra khi cập nhật trạng thái đơn hàng");
  //   }
  //   setLoadingCancel(false);
  // };

  const handleUpdateOrderStatus = async (id: string, status: string) => {
    setLoadingCancel(true);
    try {
      if (token) {
        const res = await updateOrderStatus(id, status);
        if (res.status === 200) {
          const decoded: any = jwt_decode(token);
          // Cập nhật đơn hàng trong danh sách hiện tại mà không thay đổi vị trí
          setListPurchase((prevList: any) => {
            return prevList.map((order: any) =>
              order.id === id ? { ...order, status } : order
            );
          });
          setOpenModalCancel(false);
          setOpenModalReturn(false); // Đóng modal trả hàng nếu mở
          setOpenModalConfirm(false);

          toast.success("Đã cập nhật trạng thái đơn hàng");
        }
      } else {
        // Cập nhật trạng thái đơn hàng của khách
        const res = await updateOrderStatus(id, status);
        if (res.status === 200) {
          // Cập nhật lại danh sách đơn hàng của khách
          await handleFindOrderGuest();
          setOpenModalCancel(false);
          setOpenModalReturn(false);
          setOpenModalConfirm(false);

          toast.success("Đã cập nhật trạng thái đơn hàng");
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Có lỗi xảy ra khi cập nhật trạng thái đơn hàng");
    }
    setLoadingCancel(false);
  };

  // const handleUpdateOrderStatus = async (id: string, status: string) => {
  //   setLoadingCancel(true);
  //   try {
  //     if (token) {
  //       const res = await updateOrderStatus(id, status);
  //       if (res.status === 200) {
  //         const decoded: any = jwt_decode(token);
  //         // Cập nhật đơn hàng trong danh sách hiện tại mà không thay đổi vị trí
  //         setListPurchase((prevList: any) => {
  //           return prevList.map((order: any) =>
  //             order.id === id ? { ...order, status } : order
  //           );
  //         });
  //         setOpenModalCancel(false);
  //         setOpenModalReturn(false); // Đóng modal trả hàng nếu mở
  //         setOpenModalConfirm(false);

  //         toast.success("Đã cập nhật trạng thái đơn hàng");
  //       }
  //     } else {
  //       // Cập nhật trạng thái đơn hàng của khách
  //       const res = await updateOrderStatus(id, status);
  //       if (res.status === 200) {
  //         // Cập nhật lại danh sách đơn hàng của khách
  //         await handleFindOrderGuest();
  //         setOpenModalCancel(false);
  //         setOpenModalReturn(false);
  //         setOpenModalConfirm(false);

  //         toast.success("Đã cập nhật trạng thái đơn hàng");
  //       }
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     toast.error("Có lỗi xảy ra khi cập nhật trạng thái đơn hàng");
  //   }
  //   setLoadingCancel(false);
  // };

  // const handleUpdateOrderStatus = async (id: string, status: string) => {
  //   setLoadingCancel(true);
  //   try {
  //     if (token) {
  //       const res = await updateOrderStatus(id, status);
  //       if (res.status === 200) {
  //         const decoded: any = jwt_decode(token);
  //         await fetchPurchase(decoded.id); // Cập nhật lại danh sách đơn hàng
  //         setOpenModalCancel(false);
  //         setOpenModalReturn(false); // Đóng modal trả hàng nếu mở
  //         setOpenModalConfirm(false);

  //         toast.success("Đã cập nhật trạng thái đơn hàng");
  //       }
  //     } else {
  //       const res = await deleteOrderGuest(id);
  //       if (res.status === 200) {
  //         await handleFindOrderGuest(); // Cập nhật lại danh sách đơn hàng của khách
  //         setOpenModalCancel(false);
  //         setOpenModalReturn(false);
  //         setOpenModalConfirm(false); // Đóng modal trả hàng nếu mở
  //         toast.success("Đã cập nhật trạng thái đơn hàng");
  //       }
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     toast.error("Có lỗi xảy ra khi cập nhật trạng thái đơn hàng");
  //   }
  //   setLoadingCancel(false);
  // };

  const handleFindOrderGuest = async () => {
    const res = await getOrderGuestByPhone(phoneFind.slice(1));
    if (res.data.error) {
      toast.error(res.data.error);
    } else {
      setListPurchaseGuest(res.data);
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
        <title>Đơn mua | Cuc Shoes</title>
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
            className="w-40"
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
        <div className="flex items-center justify-center gap-10 mt-10">
          <Button
            onClick={() => setOpenModalReturn(false)}
            className="w-40"
            label="Không"
            variant="outline"
          />
          <Button
            onClick={() => {
              itemCancel && handleUpdateOrderStatus(itemCancel?.id, "returns");
            }}
            className="w-40"
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
            className="w-40"
            label="Đã Nhận"
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
                      <div className="flex items-start justify-end space-x-2 text-white mb-5">
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
                      <div className="flex flex-col items-end">
                        {item?.status === "pending" && (
                          <div className="flex items-center space-x-4">
                            <Button
                              onClick={() => {
                                setItemCancel(item);
                                setOpenModalCancel(true);
                              }}
                              icon={<MdOutlineDeleteSweep />}
                              label="Huỷ Đơn"
                            />
                          </div>
                        )}
                        {item?.status === "shipped" && (
                          <div className="flex items-center space-x-4">
                            <Button
                              onClick={() => {
                                setItemCancel(item);
                                setOpenModalConfirm(true);
                              }}
                              icon={<FaPencilAlt />}
                              label="Đã Nhận Hàng"
                            />
                          </div>
                        )}
                        <div className="flex space-x-3">
                          {item?.status === "delivered" && (
                            <div className="flex items-center space-x-4">
                              {/* <Button
                                onClick={() => {
                                  setItemCancel(item);
                                  setOpenWriteReview(true); // Open return modal
                                }}
                                icon={<FaPencilAlt />}
                                label="Đánh giá"
                              /> */}
                              <button
                                onClick={() => {
                                  setItemCancel(item);
                                  // setOpenModalCancel(true);
                                }}
                              >
                                <Link href="/product/cm06vkeu2000clb039xm8uv1v">
                                  Đánh Giá
                                </Link>
                              </button>
                            </div>
                          )}
                          {openWriteReview && <ReviewDone />}
                          {isReturnable(new Date(item.createdAt)) &&
                            item?.status === "delivered" && (
                              <div className="flex items-center space-x-4">
                                <Button
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
          {filteredPurchaseGuest && filteredPurchaseGuest.length > 0 ? (
            <div>
              {filteredPurchaseGuest
                .slice() // Tạo bản sao của mảng để không làm thay đổi mảng gốc
                .reverse() // Đảo ngược mảng
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
                      <div className="mb-3 flex items-center justify-end space-x-2 text-green-500 text-sm">
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
                                    <>
                                      {" "}
                                      {item.finalPrice.toLocaleString("vi")} đ
                                    </>
                                  )}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            {item?.status === "pending" && (
                              <div className="flex items-center space-x-4">
                                <Button
                                  onClick={() => {
                                    setItemCancel(item);
                                    setOpenModalCancel(true);
                                  }}
                                  icon={<MdOutlineDeleteSweep />}
                                  label="Huỷ Đơn"
                                />
                              </div>
                            )}
                            {item?.status === "shipped" && (
                              <div className="flex items-center space-x-4">
                                <Button
                                  onClick={() => {
                                    setItemCancel(item);
                                    setOpenModalConfirm(true);
                                  }}
                                  icon={<FaPencilAlt />}
                                  label="Đã Nhận Hàng"
                                />
                              </div>
                            )}
                            {isReturnable(new Date(item.createdAt)) &&
                              item?.status === "delivered" && (
                                <div className="flex items-center space-x-4">
                                  <Button
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

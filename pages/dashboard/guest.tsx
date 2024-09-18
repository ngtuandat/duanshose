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
import { format } from "date-fns";
import Analysis from "../../containers/Charts/Analysis";
import Button from "../../components/Button";

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
    "",
  ];

  const listStatus = [
    { title: "Đang chờ", value: "pending" },
    { title: "Đang xử lý", value: "processing" },
    { title: "Chờ giao hàng", value: "shipped" },
    { title: "Đã giao", value: "transferred" },
    { title: "Đã giao thành công", value: "delivered" },
    { title: "Huỷ Đơn", value: "cancelled" },
    { title: "Trả hàng", value: "returns" },
    { title: "Yêu cầu trả hàng", value: "requestreturn" },
  ];

  const statusOrder = [
    "pending",
    "processing",
    "shipped",
    "transferred",
    "delivered",
    "cancelled",
    "returns",
    "requestreturn",
  ];

  interface Product {
    name: string | undefined;
    size: string | undefined;
    color: string | undefined;
    image: string | undefined;
    price: number | undefined;
    quantity: number | undefined;
  }

  const [dataPurchase, setDataPurchase] = useState<any[]>([]);
  const [isLoading, setisLoading] = useState(false);

  console.log(dataPurchase, "dataPurchasexxx");
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(dataPurchase.length / itemsPerPage);

  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"list" | "stats">("list");

  // Mặc định là ngày hiện tại
  const today = new Date();
  const [startDate, setStartDate] = useState<Date | null>(today);
  const [endDate, setEndDate] = useState<Date | null>(today);

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
    if (
      currentStatus === "returns" ||
      currentStatus === "delivered" ||
      currentStatus === "cancelled"
    ) {
      return [
        {
          title:
            listStatus.find((status) => status.value === currentStatus)
              ?.title || "",
          value: currentStatus,
        },
      ];
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
    setisLoading(true);
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

  const dataSourcePurchase = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    return dataPurchase.slice(startIndex, endIndex).map((item, index) => {
      // let product;
      let product: Product | undefined;
      try {
        const productsArray = JSON.parse(item.products);
        product = productsArray[0];
      } catch (error) {
        console.error("Error parsing JSON:", error);
        // product = {};
        product = undefined;
      }
      console.log(product, "llogdulieu");

      const productName = product?.name || "N/A";
      const productSize = product?.size || "N/A";
      const productColor = product?.color || "N/A";
      const productImage = product?.image || "";
      const productQuantity = product?.quantity ?? 0; // Use default value of 0 if undefined
      const productPrice = product?.price ?? 0;
      return [
        <> {startIndex + index + 1}</>,
        <div className="text-primary font-bold">{item.buyerName}</div>,
        <div>{productName}</div>,
        <div>{productSize}</div>,
        <div>{productColor}</div>,
        <img
          className="w-full max-w-xs h-auto cursor-pointer rounded-lg object-cover"
          src={productImage}
          alt={productImage || "Product Image"}
        />,
        <p>{(productQuantity * productPrice).toLocaleString("vi")} đ</p>,
        <p>{productQuantity}</p>,
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
        <>
          {item.status === "requestreturn" && (
            <div className="flex">
              <Button
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                // loading={isLoading}
                onClick={() =>
                  handleItemSelected(
                    { title: "Chấp Nhận", value: "returns" },
                    item.id
                  )
                }
                label="Chấp Nhận"
              />
              <Button
                // loading={isLoading}
                onClick={() =>
                  handleItemSelected(
                    { title: "Từ Chối", value: "delivered" },
                    item.id
                  )
                }
                className="bg-red-600 hover:bg-red-800 text-white px-4 py-2 rounded-lg ml-2"
                label="Từ Chối"
              />
            </div>
          )}
        </>,
      ];
    });
  }, [dataPurchase, currentPage]);

  // Hàm tính toán thống kê
  // const calculateStats = () => {
  //   if (!startDate || !endDate)
  //     return { totalOrders: 0, totalAmount: 0, totalQuantity: 0 };

  //   // Điều chỉnh thời gian khi ngày bắt đầu và kết thúc giống nhau
  //   const start = new Date(startDate);
  //   const end = new Date(endDate);

  //   if (start.toDateString() === end.toDateString()) {
  //     start.setHours(0, 0, 0, 0); // 0h ngày bắt đầu
  //     end.setHours(23, 59, 59, 999); // 23h59 ngày kết thúc
  //   } else {
  //     end.setHours(23, 59, 59, 999); // Đảm bảo giờ kết thúc là cuối ngày
  //   }

  //   const filteredOrders = dataPurchase.filter((item) => {
  //     const orderDate = new Date(item.updatedAt);
  //     return (
  //       item.status === "delivered" && orderDate >= start && orderDate <= end
  //     );
  //   });

  //   const totalOrders = filteredOrders.length;
  //   const totalAmount = filteredOrders.reduce((sum, item) => {
  //     let product;
  //     try {
  //       const productsArray = JSON.parse(item.products);
  //       product = productsArray[0];
  //     } catch (error) {
  //       console.error("Error parsing JSON:", error);
  //       product = {};
  //     }
  //     return sum + product.quantity * product.price;
  //   }, 0);

  //   const totalQuantity = filteredOrders.reduce((sum, item) => {
  //     let product;
  //     try {
  //       const productsArray = JSON.parse(item.products);
  //       product = productsArray[0];
  //     } catch (error) {
  //       console.error("Error parsing JSON:", error);
  //       product = {};
  //     }
  //     return sum + product.quantity;
  //   }, 0);

  //   return { totalOrders, totalAmount, totalQuantity };
  // };
  const calculateStats = () => {
    if (!startDate || !endDate)
      return {
        totalOrders: 0,
        totalAmount: 0,
        totalQuantity: 0,
        shippingOrders: 0,
        shippingQuantity: 0,
        shippingAmount: 0,
      };

    // Điều chỉnh thời gian khi ngày bắt đầu và kết thúc giống nhau
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start.toDateString() === end.toDateString()) {
      start.setHours(0, 0, 0, 0); // 0h ngày bắt đầu
      end.setHours(23, 59, 59, 999); // 23h59 ngày kết thúc
    } else {
      end.setHours(23, 59, 59, 999); // Đảm bảo giờ kết thúc là cuối ngày
    }

    // Đơn hàng đã giao
    const filteredOrders = dataPurchase.filter((item) => {
      const orderDate = new Date(item.updatedAt);
      return (
        item.status === "delivered" && orderDate >= start && orderDate <= end
      );
    });

    const totalOrders = filteredOrders.length;
    const totalAmount = filteredOrders.reduce((sum, item) => {
      let product: Product | undefined;
      try {
        const productsArray = JSON.parse(item.products);
        product = productsArray[0];
      } catch (error) {
        console.error("Error parsing JSON:", error);
        product = undefined;
      }
      // Nếu sản phẩm hợp lệ
      if (product && product.price && product.quantity) {
        return sum + product.price * product.quantity;
      }
      return sum;
    }, 0);

    const totalQuantity = filteredOrders.reduce((sum, item) => {
      let product: Product | undefined;
      try {
        const productsArray = JSON.parse(item.products);
        product = productsArray[0];
      } catch (error) {
        console.error("Error parsing JSON:", error);
        product = undefined;
      }
      // Nếu sản phẩm hợp lệ
      if (product && product.quantity) {
        return sum + product.quantity;
      }
      return sum;
    }, 0);

    // Đơn hàng đang giao
    const shippingOrdersData = dataPurchase.filter((item) => {
      const orderDate = new Date(item.updatedAt);
      return (
        item.status !== "delivered" &&
        item.status !== "cancelled" &&
        item.status !== "returns" &&
        orderDate >= start &&
        orderDate <= end
      );
    });

    const shippingOrders = shippingOrdersData.length;
    const shippingAmount = shippingOrdersData.reduce((sum, item) => {
      let product: Product | undefined;
      try {
        const productsArray = JSON.parse(item.products);
        product = productsArray[0];
      } catch (error) {
        console.error("Error parsing JSON:", error);
        product = undefined;
      }
      // Nếu sản phẩm hợp lệ
      if (product && product.price && product.quantity) {
        return sum + product.price * product.quantity;
      }
      return sum;
    }, 0);

    const shippingQuantity = shippingOrdersData.reduce((sum, item) => {
      let product: Product | undefined;
      try {
        const productsArray = JSON.parse(item.products);
        product = productsArray[0];
      } catch (error) {
        console.error("Error parsing JSON:", error);
        product = undefined;
      }
      // Nếu sản phẩm hợp lệ
      if (product && product.quantity) {
        return sum + product.quantity;
      }
      return sum;
    }, 0);

    return {
      totalOrders,
      totalAmount,
      totalQuantity,
      shippingOrders,
      shippingAmount,
      shippingQuantity,
    };
  };

  const {
    totalOrders,
    totalAmount,
    totalQuantity,
    shippingOrders,
    shippingAmount,
    shippingQuantity,
  } = calculateStats();
  return (
    <div>
      {loading && <LoadingPage />}
      <ContentHeader
        title="Quản lý khách vãng lai"
        name="khách hàng vãng lai"
      />
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => setActiveTab("list")}
          className={`px-4 py-2 rounded-lg ${
            activeTab === "list" ? "bg-[#17A34A] text-white" : "bg-gray-200"
          }`}
        >
          Danh sách
        </button>
        <button
          onClick={() => setActiveTab("stats")}
          className={`px-4 py-2 rounded-lg ${
            activeTab === "stats" ? "bg-[#17A34A] text-white" : "bg-gray-200"
          }`}
        >
          Thống kê
        </button>
      </div>
      {activeTab === "list" && (
        <>
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
        </>
      )}
      {activeTab === "stats" && (
        <div>
          <div>
            <div className="flex space-x-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Ngày bắt đầu
                </label>
                <input
                  type="date"
                  value={startDate ? format(startDate, "yyyy-MM-dd") : ""}
                  onChange={(e) => setStartDate(new Date(e.target.value))}
                  className="px-2 py-1 rounded-md border border-gray-300 bg-[#212A36] text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Ngày kết thúc
                </label>
                <input
                  type="date"
                  value={endDate ? format(endDate, "yyyy-MM-dd") : ""}
                  onChange={(e) => setEndDate(new Date(e.target.value))}
                  className="px-2 py-1 rounded-md border border-gray-300 bg-[#212A36] text-white"
                />
              </div>
            </div>
            <div>
              {/* <h3 className="text-lg font-semibold mb-2">Thống kê</h3> */}
              <div className="grid lg:grid-cols-3 grid-cols-1 gap-6 mb-6 text-white">
                <Analysis
                  name="Đơn hàng thành công"
                  parameter={totalOrders}
                  color="#F8A804"
                  percent=""
                />
                <Analysis
                  name="Sản phẩm đã bán"
                  parameter={totalQuantity}
                  color="rgb(0,170,85)"
                  percent=""
                />
                <Analysis
                  name="Doanh thu thực"
                  parameter={totalAmount}
                  color="rgb(0,184,217)"
                  percent=""
                />
                <Analysis
                  name="Đơn hàng đang giao"
                  parameter={shippingOrders}
                  color="#F8A804"
                  percent=""
                />
                <Analysis
                  name="Sản phẩm đang giao"
                  parameter={shippingQuantity}
                  color="rgb(0,170,85)"
                  percent=""
                />
                <Analysis
                  name="Doanh thu tạm tính"
                  parameter={shippingAmount}
                  color="rgb(0,184,217)"
                  percent=""
                />
              </div>
            </div>
          </div>
        </div>
      )}
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

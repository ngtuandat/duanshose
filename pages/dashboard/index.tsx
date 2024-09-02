import React, { useEffect, useState } from "react";
import { ReactElement } from "react";
import { CustomHeader } from "../../components/Header/CustomHeader";
import MainAdmin from "../../components/Layouts/MainAdmin";
import LoadingPage from "../../components/Loading/LoadingPage";
import Analysis from "../../containers/Charts/Analysis";
import Area from "../../containers/Charts/Area";
import MultipleRadialbars from "../../containers/Charts/MultipleRadialbars";
import { getPurchaseAll } from "../../services/product";
import { PurchaseProps } from "../../interfaces/product";

const columnProduct = [
  "Số thứ tự",
  "Tên sản phẩm",
  "Size",
  "Màu sắc",
  "Số lượng bán",
  "Ảnh",
  "Doanh thu",
];

const Dashboard = ({ loading }: { loading: Boolean }) => {
  const currentDate = new Date();
  const currentMonth = currentDate.toISOString().slice(0, 7); // YYYY-MM
  const currentDay = currentDate.toISOString().slice(0, 10); // YYYY-MM-DD

  const [countProd, setCountProd] = useState(0);
  const [temporaryQuantity, setTemporaryQuantity] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalEstimatedPrice, setTotalEstimatedPrice] = useState(0);
  const [selling, setSelling] = useState<any[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(
    currentMonth
  );
  console.log(selectedMonth, "selectedMonth");
  const [selectedDate, setSelectedDate] = useState<string | null>(currentDay);
  const [selectedEndDate, setSelectedEndDate] = useState<string | null>(
    currentDay
  );
  const fetchAllPurchase = async (
    month: string | null,
    date: string | null,
    endDate: string | null
  ) => {
    try {
      const res = await getPurchaseAll(); // Gọi API để lấy tất cả dữ liệu từ backend
      const allProducts = res.data.result;

      // Xác định ngày bắt đầu và kết thúc để lọc dữ liệu
      const startDate = date ? new Date(date) : new Date("1900-01-01"); // Ngày bắt đầu
      const endDateParsed = endDate
        ? new Date(endDate + "T23:59:59")
        : new Date(); // Ngày kết thúc, bao gồm toàn bộ ngày

      // Lọc sản phẩm trong ngày và tháng được chọn
      const filteredProducts = allProducts.filter((product: PurchaseProps) => {
        const productDate = new Date(product.createdAt);

        // Lọc theo tháng, ngày bắt đầu và ngày kết thúc
        const isWithinMonth =
          month === null ||
          productDate.getMonth() === new Date(month).getMonth();
        const isWithinDateRange =
          productDate >= startDate && productDate <= endDateParsed;

        return isWithinMonth && isWithinDateRange;
      });

      // Loại bỏ các đơn hàng ở trạng thái cancelled và returns
      const validProducts = filteredProducts.filter(
        (product: PurchaseProps) =>
          product.status !== "cancelled" && product.status !== "returns"
      );

      const deliveredProducts = validProducts.filter(
        (product: PurchaseProps) => product.status === "delivered"
      );

      const nonDeliveredProducts = validProducts.filter(
        (product: PurchaseProps) => product.status !== "delivered"
      );

      // Tính toán số lượng sản phẩm và doanh thu thực
      setCountProd(
        deliveredProducts.reduce(
          (acc: number, curr: PurchaseProps) => acc + curr.quantityProd,
          0
        )
      );

      setTemporaryQuantity(
        nonDeliveredProducts.reduce(
          (acc: number, curr: PurchaseProps) => acc + curr.quantityProd,
          0
        )
      );

      const totalEstimatedRevenue = nonDeliveredProducts.reduce(
        (acc: number, cur: PurchaseProps) => {
          return acc + cur.priceProd * cur.quantityProd;
        },
        0
      );
      setTotalEstimatedPrice(totalEstimatedRevenue);

      const totalRevenue = deliveredProducts.reduce(
        (acc: number, cur: PurchaseProps) => {
          return acc + cur.priceProd * cur.quantityProd;
        },
        0
      );
      setTotalPrice(totalRevenue);

      // Tạo map để tính tổng doanh thu của từng sản phẩm đã bán
      const productMap = new Map<string, any>();

      deliveredProducts.forEach((item: PurchaseProps) => {
        const key = `${item.nameProd}-${item.sizeProd}-${item.colorProd}`;
        if (productMap.has(key)) {
          const existingProduct = productMap.get(key);
          existingProduct.quantitySold += item.quantityProd;
          existingProduct.totalRevenue += item.priceProd * item.quantityProd;
        } else {
          productMap.set(key, {
            productName: item.nameProd,
            size: item.sizeProd,
            color: item.colorProd,
            quantitySold: item.quantityProd,
            imagesProd: item.imageProd,
            totalRevenue: item.priceProd * item.quantityProd,
          });
        }
      });

      // Sắp xếp sản phẩm theo số lượng bán được giảm dần
      const soldProducts = Array.from(productMap.values()).sort(
        (a, b) => b.quantitySold - a.quantitySold
      );
      setSelling(soldProducts);
    } catch (error) {
      console.log(error);
    }
  };

  // const fetchAllPurchase = async (
  //   month: string | null,
  //   date: string | null,
  //   endDate: string | null
  // ) => {
  //   try {
  //     const res = await getPurchaseAll(); // Gọi API để lấy tất cả dữ liệu từ backend
  //     const allProducts = res.data.result;

  //     // Xác định ngày bắt đầu và kết thúc để lọc dữ liệu
  //     const startDate = date ? new Date(date) : new Date("1900-01-01"); // Ngày bắt đầu
  //     const endDateParsed = endDate
  //       ? new Date(endDate + "T23:59:59")
  //       : new Date(); // Ngày kết thúc, bao gồm toàn bộ ngày

  //     // Lọc sản phẩm trong ngày và tháng được chọn
  //     const filteredProducts = allProducts.filter((product: PurchaseProps) => {
  //       const productDate = new Date(product.createdAt);

  //       // Lọc theo tháng, ngày bắt đầu và ngày kết thúc
  //       const isWithinMonth =
  //         month === null ||
  //         productDate.getMonth() === new Date(month).getMonth();
  //       const isWithinDateRange =
  //         productDate >= startDate && productDate <= endDateParsed;

  //       return isWithinMonth && isWithinDateRange;
  //     });

  //     const deliveredProducts = filteredProducts.filter(
  //       (product: PurchaseProps) => product.status === "delivered"
  //     );

  //     const nonDeliveredProducts = filteredProducts.filter(
  //       (product: PurchaseProps) => product.status !== "delivered"
  //     );

  //     // Tính toán số lượng sản phẩm và doanh thu thực
  //     setCountProd(
  //       deliveredProducts.reduce(
  //         (acc: number, curr: PurchaseProps) => acc + curr.quantityProd,
  //         0
  //       )
  //     );

  //     setTemporaryQuantity(
  //       nonDeliveredProducts.reduce(
  //         (acc: number, curr: PurchaseProps) => acc + curr.quantityProd,
  //         0
  //       )
  //     );

  //     const totalEstimatedRevenue = nonDeliveredProducts.reduce(
  //       (acc: number, cur: PurchaseProps) => {
  //         return acc + cur.priceProd * cur.quantityProd;
  //       },
  //       0
  //     );
  //     setTotalEstimatedPrice(totalEstimatedRevenue);

  //     const totalRevenue = deliveredProducts.reduce(
  //       (acc: number, cur: PurchaseProps) => {
  //         return acc + cur.priceProd * cur.quantityProd;
  //       },
  //       0
  //     );
  //     setTotalPrice(totalRevenue);

  //     // Tạo map để tính tổng doanh thu của từng sản phẩm đã bán
  //     const productMap = new Map<string, any>();

  //     deliveredProducts.forEach((item: PurchaseProps) => {
  //       const key = `${item.nameProd}-${item.sizeProd}-${item.colorProd}`;
  //       if (productMap.has(key)) {
  //         const existingProduct = productMap.get(key);
  //         existingProduct.quantitySold += item.quantityProd;
  //         existingProduct.totalRevenue += item.priceProd * item.quantityProd;
  //       } else {
  //         productMap.set(key, {
  //           productName: item.nameProd,
  //           size: item.sizeProd,
  //           color: item.colorProd,
  //           quantitySold: item.quantityProd,
  //           imagesProd: item.imageProd,
  //           totalRevenue: item.priceProd * item.quantityProd,
  //         });
  //       }
  //     });

  //     // Sắp xếp sản phẩm theo số lượng bán được giảm dần
  //     const soldProducts = Array.from(productMap.values()).sort(
  //       (a, b) => b.quantitySold - a.quantitySold
  //     );
  //     setSelling(soldProducts);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  useEffect(() => {
    fetchAllPurchase(selectedMonth, selectedDate, selectedEndDate); // Gọi hàm fetchAllPurchase khi selectedMonth, selectedDate hoặc selectedEndDate thay đổi
  }, [selectedMonth, selectedDate, selectedEndDate]);

  // Hàm xử lý khi người dùng thay đổi tháng
  const handleMonthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedMonth(event.target.value); // Cập nhật giá trị selectedMonth khi người dùng thay đổi tháng
  };

  // Hàm xử lý khi người dùng thay đổi ngày
  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value); // Cập nhật giá trị selectedDate khi người dùng thay đổi ngày
  };

  // Hàm xử lý khi người dùng thay đổi ngày kết thúc
  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedEndDate(event.target.value); // Cập nhật giá trị selectedEndDate khi người dùng thay đổi ngày kết thúc
  };

  return (
    <div className="text-white">
      {loading && <LoadingPage />}
      <CustomHeader>
        <title>DashBoard</title>
      </CustomHeader>
      <div className="flex space-x-5 items-center justify-between">
        <div className="flex flex-col items-start my-6 ">
          <label className="mr-2">Chọn tháng:</label>
          <input
            type="month"
            className="px-2 py-1 rounded-md border border-gray-300 bg-[#212A36]"
            value={selectedMonth || ""}
            onChange={handleMonthChange}
          />
        </div>
        <div className="flex items-center space-x-5">
          <div className="flex my-6 flex-col items-start">
            <label className="mr-2">Chọn ngày bắt đầu:</label>
            <input
              type="date"
              className="px-2 py-1 rounded-md border border-gray-300 bg-[#212A36]"
              value={selectedDate || ""}
              onChange={handleDateChange}
            />
          </div>
          <div className="flex my-6 flex-col items-start">
            <label className="mr-2">Chọn ngày kết thúc:</label>
            <input
              type="date"
              className="px-2 py-1 rounded-md border border-gray-300 bg-[#212A36]"
              value={selectedEndDate || ""}
              onChange={handleEndDateChange}
            />
          </div>
        </div>
      </div>
      <div className="grid lg:grid-cols-2 grid-cols-1 gap-6 mb-6">
        <Analysis
          name="Sản phẩm được bán"
          parameter={temporaryQuantity}
          color="rgb(0,170,85)"
          percent="+2.6%"
        />
        <Analysis
          name="Doanh Thu Tạm Tính"
          parameter={totalEstimatedPrice}
          color="rgb(0,184,217)"
          percent="-0.1%"
        />
      </div>
      <div className="grid lg:grid-cols-2 grid-cols-1 gap-6 mb-6">
        <Analysis
          name="Sản phẩm đã bán"
          parameter={countProd}
          color="rgb(0,170,85)"
          percent="+2.6%"
        />
        <Analysis
          name="Doanh Thu Thực"
          parameter={totalPrice}
          color="rgb(0,184,217)"
          percent="-0.1%"
        />
        {/* <Analysis
          name="Lợi nhuận bán hàng"
          parameter={totalPrice / 2 - 500}
          color="rgb(248,167,2)"
          percent="+0.6%"
        /> */}
      </div>
      <div className="grid grid-cols-3 gap-6 mt-6">
        <div className="col-span-3 lg:col-span-1">
          <MultipleRadialbars />
        </div>
        <div className="col-span-3 lg:col-span-2">
          <Area />
        </div>
      </div>
      <div className="text-lg flex justify-center py-6 font-bold">
        Sản phẩm bán Chạy
      </div>
      <div>
        <div className={`flex flex-col `}>
          <div className="-my-2 -mx-4 sm:-mx-6 lg:-mx-8">
            <div
              id="table-scroll"
              className="inline-block w-[94%] overflow-x-auto py-2 align-middle md:mx-6 lg:mx-8"
            >
              <div className="shadow ring-1 ring-black ring-opacity-5 md:rounded-lg overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-[rgb(51,61,72)]">
                    <tr>
                      {columnProduct.map((column, index) => (
                        <th
                          key={index}
                          scope="col"
                          className={`py-3.5 pl-4 pr-3 w-fit text-left text-sm font-semibold ${
                            String(column).includes("Tên")
                              ? "text-white"
                              : "text-[rgb(145,158,171)]"
                          }`}
                        >
                          {column}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-[rgb(33,43,54)]">
                    {selling.map((item: any, index) => (
                      <tr key={index}>
                        <td
                          className={
                            "whitespace-nowrap min-w-[105px] w-fit px-3 py-4 text-sm bg-[rgb(33,43,54)] text-white"
                          }
                        >
                          {index + 1}
                        </td>
                        <td
                          className={
                            "whitespace-nowrap min-w-[105px] w-fit px-3 py-4 text-sm bg-[rgb(33,43,54)] text-white"
                          }
                        >
                          <div className="space-x-1 flex">
                            {item.productName}
                          </div>
                        </td>
                        <td
                          className={
                            "whitespace-nowrap min-w-[105px] w-fit px-3 py-4 text-sm bg-[rgb(33,43,54)] text-white"
                          }
                        >
                          {item.size}
                        </td>
                        <td
                          className={
                            "whitespace-nowrap min-w-[105px] w-fit px-3 py-4 text-sm bg-[rgb(33,43,54)] text-white"
                          }
                        >
                          {item.color}
                        </td>
                        <td
                          className={
                            "whitespace-nowrap min-w-[105px] w-fit px-3 py-4 text-sm bg-[rgb(33,43,54)] text-white"
                          }
                        >
                          <div className="ml-8">{item.quantitySold}</div>
                        </td>
                        <td>
                          <img
                            className="w-10 h-10 rounded-md"
                            src={item.imagesProd}
                            alt=""
                          />
                        </td>
                        <td
                          className={
                            "whitespace-nowrap min-w-[105px] w-fit px-3 py-4 text-sm bg-[rgb(33,43,54)] text-white"
                          }
                        >
                          {item.totalRevenue}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Dashboard.getLayout = function getLayout(page: ReactElement) {
  return <MainAdmin>{page}</MainAdmin>;
};

export default Dashboard;

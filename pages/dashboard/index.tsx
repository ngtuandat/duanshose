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
  const [data, setData] = useState([]);
  const [sellWell, setSellWell] = useState<any>([]);
  console.log(sellWell, "sellWell");

  const currentDay = currentDate.toISOString().slice(0, 10); // YYYY-MM-DD

  const [countProd, setCountProd] = useState(0);
  const [temporaryQuantity, setTemporaryQuantity] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalEstimatedPrice, setTotalEstimatedPrice] = useState(0);
  const [selling, setSelling] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(currentDay);
  console.log(sellWell, "sellWell");

  const [selectedEndDate, setSelectedEndDate] = useState<string | null>(
    currentDay
  );
  const fetchAllPurchase = async (
    date: string | null,
    endDate: string | null
  ) => {
    try {
      const res = await getPurchaseAll(); // Gọi API để lấy tất cả dữ liệu từ backend
      const allProducts = res.data.result;
      setData(allProducts);
      setSelling(res.data.result);
      const deliveredProductsSellWell = allProducts.filter(
        (product: PurchaseProps) => product.status === "delivered"
      );

      setSellWell(deliveredProductsSellWell);

      console.log(allProducts, "allProducts");

      // Xác định ngày bắt đầu và kết thúc để lọc dữ liệu
      const startDate = date ? new Date(date) : new Date("1900-01-01"); // Ngày bắt đầu
      const endDateParsed = endDate
        ? new Date(endDate + "T23:59:59")
        : new Date(); // Ngày kết thúc, bao gồm toàn bộ ngày

      // Lọc sản phẩm trong ngày và tháng được chọn
      const filteredProducts = allProducts.filter((product: PurchaseProps) => {
        const productDate = new Date(product.createdAt);

        // Lọc theo ngày bắt đầu và ngày kết thúc
        const isWithinDateRange =
          productDate >= startDate && productDate <= endDateParsed;

        return isWithinDateRange;
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

      deliveredProductsSellWell.forEach((item: PurchaseProps) => {
        const key = `${item.nameProd}-${item.sizeProd}-${item.colorProd}`;
        {
          console.log(productMap, "productMap");
        }
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

      // Sắp xếp sản phẩm theo số lượng bán được giảm dần, nếu số lượng bằng nhau thì sắp xếp theo doanh thu giảm dần
      const soldProducts = Array.from(productMap.values()).sort((a, b) => {
        if (b.quantitySold === a.quantitySold) {
          return b.totalRevenue - a.totalRevenue;
        }
        return b.quantitySold - a.quantitySold;
      });

      setSellWell(soldProducts);
    } catch (error) {
      console.log(error);
    }
  };

  // const fetchAllPurchase = async (
  //   date: string | null,
  //   endDate: string | null
  // ) => {
  //   try {
  //     const res = await getPurchaseAll(); // Gọi API để lấy tất cả dữ liệu từ backend
  //     const allProducts = res.data.result;
  //     setData(allProducts);
  //     setSelling(allProducts);
  //     const deliveredProductsSellWell = allProducts.filter(
  //       (product: PurchaseProps) => product.status === "delivered"
  //     );

  //     setSellWell(deliveredProductsSellWell);

  //     console.log(allProducts, "allProducts");

  //     // Xác định ngày bắt đầu và kết thúc để lọc dữ liệu
  //     const startDate = date ? new Date(date) : new Date("1900-01-01"); // Ngày bắt đầu
  //     const endDateParsed = endDate
  //       ? new Date(endDate + "T23:59:59")
  //       : new Date(); // Ngày kết thúc, bao gồm toàn bộ ngày

  //     // Lọc sản phẩm trong ngày và tháng được chọn
  //     const filteredProducts = allProducts.filter((product: PurchaseProps) => {
  //       const productDate = new Date(product.createdAt);

  //       // Lọc theo ngày bắt đầu và ngày kết thúc
  //       const isWithinDateRange =
  //         productDate >= startDate && productDate <= endDateParsed;

  //       return isWithinDateRange;
  //     });

  //     // Loại bỏ các đơn hàng ở trạng thái cancelled và returns
  //     const validProducts = filteredProducts.filter(
  //       (product: PurchaseProps) =>
  //         product.status !== "cancelled" && product.status !== "returns"
  //     );

  //     const deliveredProducts = validProducts.filter(
  //       (product: PurchaseProps) => product.status === "delivered"
  //     );

  //     const nonDeliveredProducts = validProducts.filter(
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
    fetchAllPurchase(selectedDate, selectedEndDate); // Gọi hàm fetchAllPurchase khi selectedDate hoặc selectedEndDate thay đổi
  }, [selectedDate, selectedEndDate]);

  // Hàm xử lý khi người dùng thay đổi ngày
  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value); // Cập nhật giá trị selectedDate khi người dùng thay đổi ngày
  };

  // Hàm xử lý khi người dùng thay đổi ngày kết thúc
  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedEndDate(event.target.value); // Cập nhật giá trị selectedEndDate khi người dùng thay đổi ngày kết thúc
  };

  const groupedSellWell = sellWell.reduce((acc: any, item: any) => {
    const foundIndex = acc.findIndex(
      (i: any) => i.productName === item.productName
    );
    if (foundIndex >= 0) {
      acc[foundIndex].quantitySold += item.quantitySold;
      acc[foundIndex].totalRevenue += item.totalRevenue;
    } else {
      acc.push({ ...item });
    }
    return acc;
  }, []);

  return (
    <div className="text-white">
      {loading && <LoadingPage />}
      <CustomHeader>
        <title>DashBoard</title>
      </CustomHeader>
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
      </div>
      <div className=" mt-6">
        {/* <div className="col-span-3 lg:col-span-1">
          <MultipleRadialbars />
        </div> */}
        <div className="col-span-3 lg:col-span-2">
          <Area data={data} />
        </div>
      </div>
      <div className="text-lg flex justify-center py-6 font-bold">
        Sản phẩm bán Chạy
      </div>

      <div className="overflow-x-auto">
        <div className="flex flex-col">
          <div className="py-2 -mx-4 sm:-mx-6 lg:-mx-8 ">
            <div className="inline-block min-w-full align-middle">
              <div className="relative overflow-hidden shadow-lg rounded-lg ring-1 ring-black ring-opacity-10 ">
                <table className="table-auto divide-y divide-gray-300 min-w-full">
                  <thead className="bg-gray-800 text-gray-200">
                    <tr>
                      {columnProduct.map((column, index) => (
                        <th
                          key={index}
                          scope="col"
                          className="py-3.5 px-4 text-center text-sm font-semibold whitespace-nowrap min-w-[150px] max-w-[250px] overflow-auto text-ellipsis"
                        >
                          {column}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700 bg-gray-900">
                    {groupedSellWell.map((item: any, index: any) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-800 transition-colors duration-200"
                      >
                        <td className="whitespace-nowrap py-4 px-4 text-sm font-medium text-gray-300 text-center">
                          {index + 1}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-300">
                          {item.productName}
                        </td>
                        <td className="whitespace-nowrap text-center px-4 py-4 text-sm text-gray-300">
                          {item.size}
                        </td>
                        <td className="whitespace-nowrap text-center px-4 py-4 text-sm text-gray-300">
                          {item.color}
                        </td>
                        <td className="whitespace-nowrap text-center px-4 py-4 text-sm text-gray-300">
                          {item.quantitySold}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-300  flex items-center justify-center">
                          <div className="relative h-24 w-24">
                            <img
                              src={item.imagesProd}
                              alt={item.productName}
                              className="absolute inset-0 w-full h-full object-contain rounded-lg border bg-white border-gray-600 shadow-md"
                            />
                          </div>
                        </td>

                        <td className="whitespace-nowrap text-center px-4 py-4 text-sm text-gray-300">
                          {item.totalRevenue?.toLocaleString("vi")} đ
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

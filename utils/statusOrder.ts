import { OrderStatus } from "../lib/enum";

export const getStatusColor = (status: string) => {
  console.log(status, "jdhjksahdjk");
  switch (status) {
    case OrderStatus.Pending:
      return "text-yellow-500";
    case OrderStatus.Processing:
      return "text-blue-500";
    case OrderStatus.Shipped:
      return "text-blue-500";
    case OrderStatus.Transferred:
      return "text-blue-500";
    case OrderStatus.Delivered:
      return "text-green-500";
    case OrderStatus.Cancelled:
      return "text-red-500";
    case OrderStatus.Returns: // Thêm trường hợp cho "Trả hàng"
      return "text-red-500";
    case OrderStatus.RequestReturn: // Yêu cầu trả hàng
      return "text-red-500";
    default:
      return "text-gray-500";
  }
};

// export const getOrderStatusInVietnamese = (status: string) => {
//   switch (status) {
//     case OrderStatus.Pending:
//       return "Đang chờ";
//     case OrderStatus.Processing:
//       return "Đang xử lý";
//     case OrderStatus.Shipped:
//       return "Đang giao hàng";
//     case OrderStatus.Delivered:
//       return "Đã giao thành công";
//     case OrderStatus.Cancelled:
//       return "Đã hủy";
//     default:
//       return status;
//   }
// };

// export const getOrderStatusInVietnamese = (status: string) => {
//   console.log("Status received:", status);

//   switch (status) {
//     case OrderStatus.Pending:
//       return "Đang chờ";
//     case OrderStatus.Processing:
//       return "Đang xử lý";
//     case OrderStatus.Shipped:
//       return "Đang giao hàng";
//     case OrderStatus.Delivered:
//       return "Đã giao thành công";
//     case OrderStatus.Cancelled:
//       return "Đã hủy";
//     default:
//       return status;
//   }
// };

export const getOrderStatusInVietnamese = (status: string) => {
  switch (status) {
    case "pending":
      return "Đang chờ";
    case "processing":
      return "Đang xử lý";
    case "shipped":
      return "Chờ giao hàng";
    case "transferred":
      return "Đã giao";
    case "delivered":
      return "Đã giao thành công";
    case "cancelled":
      return "Đã hủy";
    case "returns":
      return "Trả hàng";
    case "requestreturn":
      return "Yêu cầu trả hàng";
    default:
      return status; // Nếu trạng thái không khớp, trả về giá trị gốc
  }
};

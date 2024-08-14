import { OrderStatus } from "../lib/enum";

export const getStatusColor = (status: string) => {
  console.log({ OrderStatus: OrderStatus.Pending });
  switch (status) {
    case OrderStatus.Pending:
      return "text-yellow-500";
    case OrderStatus.Processing:
      return "text-blue-500";
    case OrderStatus.Shipped:
      return "text-purple-500";
    case OrderStatus.Delivered:
      return "text-green-500";
    case OrderStatus.Cancelled:
      return "text-red-500";
    default:
      return "text-gray-500";
  }
};

export const getOrderStatusInVietnamese = (status: string) => {
  switch (status) {
    case OrderStatus.Pending:
      return "Đang chờ";
    case OrderStatus.Processing:
      return "Đang xử lý";
    case OrderStatus.Shipped:
      return "Đã giao hàng";
    case OrderStatus.Delivered:
      return "Đã giao thành công";
    case OrderStatus.Cancelled:
      return "Đã hủy";
    default:
      return status;
  }
};

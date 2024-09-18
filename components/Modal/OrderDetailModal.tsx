import React from "react";

const OrderDetailModal = ({ open, onClose, orderDetail }: any) => {
  console.log(orderDetail, "orderDetail");
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
      <div className="bg-gray-900 text-white rounded-lg p-6 relative max-w-lg w-full">
        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-200"
        >
          &times;
        </button>

        <div className="p-4">
          <h2 className="text-2xl font-bold mb-6">Chi tiết đơn hàng</h2>

          {/* Thông tin sản phẩm */}
          <div className="mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-gray-700 rounded-lg overflow-hidden">
                <img
                  src={orderDetail.imageProd}
                  alt={orderDetail.nameProd}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <p className="font-semibold text-lg">{orderDetail.nameProd}</p>
                <p>Size: {orderDetail.sizeProd}</p>
                <p>Màu sắc: {orderDetail.colorProd}</p>
                <p>Số lượng: {orderDetail.quantityProd}</p>
                <p>Giá: {orderDetail.priceProd.toLocaleString("vi")} đ</p>
              </div>
            </div>
          </div>

          {/* Thông tin người mua */}
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-2">Thông tin người mua</h3>
            <p>
              Tên:{" "}
              {orderDetail?.user?.firstName + " " + orderDetail?.user?.lastName}
            </p>
            <p>Email: {orderDetail?.user?.email}</p>
            <p>Địa chỉ: {orderDetail?.user?.profile?.address}</p>
            <p>Số điện thoại: {orderDetail?.user?.profile?.phoneNumber}</p>
          </div>

          {/* Thông tin thêm */}
          <div className="mt-4">
            <p>Tổng giá: {orderDetail?.finalPrice?.toLocaleString("vi")} đ</p>
            <p>Trạng thái: {orderDetail?.status}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;

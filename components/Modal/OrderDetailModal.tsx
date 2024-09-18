import React from "react";

const OrderDetailModal = ({ open, onClose, orderDetail }: any) => {
  console.log(orderDetail, "orderDetail");
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 relative max-w-lg w-full">
        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
        >
          &times;
        </button>

        <div className="text-black p-4">
          <h2 className="text-xl font-bold mb-4">Chi tiết đơn hàng</h2>

          <div className="mb-4">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden">
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
                <p>Giá: {orderDetail.priceProd}đ</p>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <p>Tổng giá: {orderDetail?.totalPrice?.toLocaleString("vi")} đ</p>
            <p>Trạng thái: {orderDetail?.status}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;

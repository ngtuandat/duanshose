// components/Modal/ModalDetailVisitor.tsx
import { FC } from "react";
import Modal from "../Modal"; // Đảm bảo đường dẫn đúng

interface ModalDetailVisitorProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  orderDetail: any;
}

const ModalDetailVisitor: FC<ModalDetailVisitorProps> = ({
  open,
  setOpen,
  orderDetail,
}) => {
  const products = JSON.parse(orderDetail.products);

  return (
    <Modal open={open} setOpen={setOpen} title="Chi tiết đơn hàng">
      <div className="p-4 space-y-4">
        <p className="text-lg font-semibold text-gray-300">
          <strong>Người mua :</strong> {orderDetail.buyerName}
        </p>
        <p className="text-lg font-semibold text-gray-300">
          <strong>Địa chỉ :</strong> {orderDetail.buyerAddress}
        </p>
        <p className="text-lg font-semibold text-gray-300">
          <strong>Số điện thoại :0</strong> {orderDetail.buyerPhone}
        </p>
        <p className="text-lg font-semibold text-gray-300">
          <strong>Trạng thái :</strong> {orderDetail.status}
        </p>
        <p className="text-lg font-semibold text-gray-300">
          <strong>Sản phẩm:</strong>
        </p>
        <ul className="space-y-4">
          {products.map((item: any, index: number) => (
            <li
              key={index}
              className="p-4 bg-gray-800 rounded-lg shadow-md space-y-2"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div className="text-gray-300 space-y-1">
                  <div className="text-xl font-bold">{item.name}</div>
                  <div>Size: {item.size}</div>
                  <div>Màu sắc: {item.color}</div>
                  <div>Giá: {item.price.toLocaleString("vi")} đ</div>
                  <div>Số lượng: {item.quantity}</div>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <button
          onClick={() => setOpen(false)}
          className="mt-6 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300"
        >
          Đóng
        </button>
      </div>
    </Modal>
  );
};

export default ModalDetailVisitor;

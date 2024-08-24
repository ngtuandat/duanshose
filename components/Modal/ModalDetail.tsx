import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { IoMdClose } from "react-icons/io";
import dateFormat from "dateformat"; // Import dateFormat

interface ModalDetailProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  product: any; // Có thể thay đổi thành kiểu dữ liệu cụ thể nếu có
}

const ModalDetail = ({ open, setOpen, product }: ModalDetailProps) => {
  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-[99999]"
        onClose={() => setOpen(false)}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 w-full bg-black bg-opacity-25 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-3xl h-auto transform overflow-hidden rounded-2xl bg-gray-900 px-8 py-6 text-left align-middle shadow-2xl transition-all relative">
                <IoMdClose
                  className="absolute top-3 right-6 text-white hover:text-red-500 text-2xl cursor-pointer"
                  onClick={() => setOpen(false)}
                />
                <div className="text-2xl mb-6 font-semibold text-white text-center">
                  Thông tin sản phẩm
                </div>
                <div className="text-white space-y-4">
                  <p>
                    <strong className="text-lg">Tên sản phẩm:</strong>{" "}
                    {product?.nameProd}
                  </p>
                  <p>
                    <strong className="text-lg">Size:</strong>{" "}
                    {product?.sizeProd}
                  </p>
                  <p>
                    <strong className="text-lg">Màu sắc:</strong>{" "}
                    {product?.colorProd}
                  </p>
                  <p>
                    <strong className="text-lg">Giá:</strong>{" "}
                    {product?.priceProd.toLocaleString("vi")} đ
                  </p>
                  <p>
                    <strong className="text-lg">Số lượng:</strong>{" "}
                    {product?.quantityProd}
                  </p>
                  {product?.updatedAt && (
                    <p>
                      <strong className="text-lg">Ngày bán:</strong>{" "}
                      {dateFormat(
                        new Date(product?.updatedAt),
                        "HH:MM dd/mm/yyyy"
                      )}
                    </p>
                  )}
                  <div className="flex items-start space-x-4 mt-4">
                    {product?.imageProd && (
                      <img
                        src={product.imageProd}
                        alt={product.nameProd}
                        className="w-32 h-32 object-contain rounded-lg border-2 border-gray-600"
                      />
                    )}
                    <div>
                      <p>
                        {console.log(product, "jkdfhsjks")}
                        <strong className="text-lg">
                          Địa chỉ người mua:
                        </strong>{" "}
                        {product?.user?.address || "Chưa có địa chỉ"}
                      </p>
                      <p>
                        <strong className="text-lg">Số điện thoại:</strong>{" "}
                        {product?.user?.phone || "Chưa có số điện thoại"}
                      </p>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ModalDetail;

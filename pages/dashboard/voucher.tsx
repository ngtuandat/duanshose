import React, { ReactElement, useEffect, useMemo, useState } from "react";
import MainAdmin from "../../components/Layouts/MainAdmin";
import LoadingPage from "../../components/Loading/LoadingPage";
import ContentHeader from "../../components/Header/ContentHeader";
import Card from "../../components/Card";
import Table from "../../components/Table";
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import AddVoucher from "../../containers/voucher/AddVoucher";
import { DeleteVoucher, GetFullVoucher } from "../../services/voucher";
import { DataVoucherProps } from "../../interfaces/voucher";
import dateFormat from "dateformat";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import toast from "react-hot-toast";

const Voucher = ({ loading }: { loading: Boolean }) => {
  const columnVocher = [
    "Số thứ tự",
    "Tên",
    "Code",
    "Giảm giá",
    "Ngày bắt đầu",
    "Ngày hết hạn",
    "",
  ];

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [dataVoucher, setDataVoucher] = useState<DataVoucherProps[]>([]);
  const [voucherEdit, setVoucherEdit] = useState<DataVoucherProps>();
  const [loadingDelete, setLoadingDelete] = useState(false);

  const [voucherIdToDelete, setVoucherIdToDelete] = useState<string | null>(
    null
  );
  const [activeTab, setActiveTab] = useState("active");
  const [voucherType, setVoucherType] = useState<"vnd" | "percent">("percent");

  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const [totalPages, setTotalPages] = useState(1);

  const handleGetAllVoucher = async () => {
    const res = await GetFullVoucher();
    setDataVoucher(res.data);
  };

  useEffect(() => {
    handleGetAllVoucher();
  }, [openCreate, openEdit]);

  const handleEdit = (voucher: DataVoucherProps) => {
    setVoucherEdit(voucher);
    setOpenEdit(true);
  };

  const handleDelete = (id: string) => {
    setVoucherIdToDelete(id);
    setOpenConfirm(true);
  };

  // const confirmDelete = async () => {
  //   if (voucherIdToDelete) {
  //     const res = await DeleteVoucher(voucherIdToDelete);
  //     if (res?.status === 200) {
  //       toast.success("Xóa thành công voucher!");
  //       handleGetAllVoucher();
  //     }
  //     setOpenConfirm(false);
  //     setVoucherIdToDelete(null);
  //   }
  // };
  const confirmDelete = async () => {
    if (voucherIdToDelete) {
      setLoadingDelete(true); // Bắt đầu loading
      const res = await DeleteVoucher(voucherIdToDelete);
      if (res?.status === 200) {
        toast.success("Xóa thành công voucher!");
        handleGetAllVoucher();
      }
      setOpenConfirm(false);
      setVoucherIdToDelete(null);
      setLoadingDelete(false); // Kết thúc loading
    }
  };

  // Lọc dữ liệu theo tab (active/expired) và loại voucher (vnd/percent)
  // const filteredDataVoucher = useMemo(() => {
  //   if (!dataVoucher) return [];
  //   return dataVoucher
  //     .filter((item) =>
  //       activeTab === "active"
  //         ? new Date(item.expiryDate) > new Date()
  //         : new Date(item.expiryDate) <= new Date()
  //     )
  //     .filter((item) => item.type === voucherType);
  // }, [dataVoucher, activeTab, voucherType]);

  const filteredDataVoucher = useMemo(() => {
    if (!dataVoucher) return [];

    // Lọc theo active/expired và loại voucher (vnd/percent)
    return (
      dataVoucher
        .filter((item) =>
          activeTab === "active"
            ? new Date(item.expiryDate) > new Date()
            : new Date(item.expiryDate) <= new Date()
        )
        .filter((item) => item.type === voucherType)
        // Sắp xếp theo createdAt từ mới nhất đến cũ nhất (không sắp xếp theo discount)
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
    );
  }, [dataVoucher, activeTab, voucherType]);

  // Tính toán lại tổng số trang dựa trên dữ liệu đã lọc
  useEffect(() => {
    setTotalPages(Math.ceil(filteredDataVoucher.length / itemsPerPage));
    setCurrentPage(1); // Reset lại trang về 1 khi thay đổi bộ lọc
  }, [filteredDataVoucher]);

  // Phân trang dữ liệu
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredDataVoucher.slice(startIndex, endIndex).map((item, idx) => [
      <> {startIndex + idx + 1}</>,
      <div>
        Giảm giá {item.discount.toLocaleString("vi")}
        {item.type === "vnd" ? "đ" : "%"}
      </div>,
      <div className="text-primary font-bold">{item.code}</div>,
      <div className="text-red-500 font-medium">
        - {item.discount.toLocaleString("vi")}{" "}
        {item.type === "vnd" ? "VND" : "%"}
      </div>,
      <div>{dateFormat(item.publishDate, "HH:MM dd/mm/yyyy")}</div>,
      <div>{dateFormat(item.expiryDate, "HH:MM dd/mm/yyyy")}</div>,
      <div className="flex items-center gap-3">
        <p className="w-full flex items-center justify-center">
          <span
            onClick={() => handleEdit(item)}
            className="text-xl cursor-pointer hover:text-green-500 rounded-full hover:bg-[rgba(145,158,171,0.08)] p-1"
          >
            <AiOutlineEdit />
          </span>
        </p>
        <p className="w-full flex items-center justify-center">
          <span
            onClick={() => handleDelete(item.id)}
            className="text-xl cursor-pointer hover:text-red-500 rounded-full hover:bg-[rgba(145,158,171,0.08)] p-1"
          >
            <AiOutlineDelete />
          </span>
        </p>
      </div>,
    ]);
  }, [filteredDataVoucher, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div>
      {loading && <LoadingPage />}
      <ContentHeader title="Quản lý voucher" name="Danh sách voucher" />
      <div className="flex space-x-4 mb-5">
        <button
          className={`p-2 px-4 rounded-lg transition-colors duration-300 ${
            activeTab === "active"
              ? "bg-green-500 text-white shadow-lg"
              : "bg-gray-300 text-gray-800 hover:bg-gray-400"
          }`}
          onClick={() => setActiveTab("active")}
        >
          Voucher
        </button>
        <button
          className={`p-2 px-4 rounded-lg transition-colors duration-300 ${
            activeTab === "expired"
              ? "bg-green-500 text-white shadow-lg"
              : "bg-gray-300 text-gray-800 hover:bg-gray-400"
          }`}
          onClick={() => setActiveTab("expired")}
        >
          Hết hạn
        </button>
      </div>

      <Card>
        <Card.Content>
          <div className="flex items-center justify-between">
            <Button
              onClick={() => setOpenCreate(true)}
              className="mb-5"
              label="Tạo voucher"
            />
            {/* <div className="bg-gray-400 flex items-center justify-center rounded-full px-[14px] py-2 mb-5">
              <div className="flex">
                <button
                  className={`p-1 px-4 text-sm transition-all ${
                    voucherType === "percent"
                      ? "bg-green-500 text-white shadow-lg rounded-full transform scale-105"
                      : "text-gray-800"
                  }`}
                  onClick={() => setVoucherType("percent")}
                >
                  %
                </button>
                <button
                  className={`p-1 px-3 text-sm transition-all ${
                    voucherType === "vnd"
                      ? "bg-green-500 text-white shadow-lg rounded-full transform scale-105"
                      : "text-gray-800"
                  }`}
                  onClick={() => setVoucherType("vnd")}
                >
                  VND
                </button>
              </div>
            </div> */}
          </div>
          <Table columns={columnVocher} dataSource={paginatedData} />
          <div className="flex justify-center mt-4">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`p-2 px-4 mx-1 rounded-lg transition-colors duration-300 ${
                  currentPage === index + 1
                    ? "bg-green-500 text-white shadow-lg"
                    : "bg-gray-300 text-gray-800 hover:bg-gray-400"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </Card.Content>
      </Card>
      <Modal title="Thêm voucher mới" open={openCreate} setOpen={setOpenCreate}>
        <AddVoucher handleClose={() => setOpenCreate(false)} />
      </Modal>
      <Modal title="Sửa voucher" open={openEdit} setOpen={setOpenEdit}>
        <AddVoucher
          voucherEdit={voucherEdit}
          handleClose={() => setOpenEdit(false)}
        />
      </Modal>
      {openConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-60">
          <div className="bg-[#151B24] px-6 py-10 rounded-lg shadow-lg w-[400px] relative">
            <button
              onClick={() => setOpenConfirm(false)}
              className="absolute top-2 right-4 text-white text-2xl hover:text-red-600"
            >
              &times;
            </button>
            <p className="mb-9 text-white flex justify-center text-xl font-bold whitespace-nowrap">
              Bạn muốn xóa voucher này?
            </p>
            <div className="flex justify-center space-x-3 items-center px-6">
              <Button
                onClick={() => setOpenConfirm(false)}
                label="Hủy"
                className="bg-[#505A64] text-white"
              />
              <Button
                onClick={confirmDelete}
                label={loadingDelete ? "Xóa..." : "Xoá"}
                className={`bg-[#1EA34A] text-white ${
                  loadingDelete ? "opacity-60 cursor-not-allowed" : ""
                }`}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

Voucher.getLayout = function getLayout(page: ReactElement) {
  return <MainAdmin>{page}</MainAdmin>;
};

export default Voucher;

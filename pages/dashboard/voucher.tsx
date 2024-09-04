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
  const [openConfirm, setOpenConfirm] = useState(false); // State cho modal xác nhận
  const [dataVoucher, setDataVoucher] = useState<DataVoucherProps[]>();
  const [voucherEdit, setVoucherEdit] = useState<DataVoucherProps>();
  const [voucherIdToDelete, setVoucherIdToDelete] = useState<string | null>(
    null
  ); // ID voucher cần xóa

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
    setVoucherIdToDelete(id); // Lưu ID voucher cần xóa
    setOpenConfirm(true); // Mở modal xác nhận
  };

  const confirmDelete = async () => {
    if (voucherIdToDelete) {
      const res = await DeleteVoucher(voucherIdToDelete);
      if (res?.status === 200) {
        toast.success("Xóa thành công voucher!");
        handleGetAllVoucher();
      }
      setOpenConfirm(false); // Đóng modal xác nhận
      setVoucherIdToDelete(null); // Xóa ID voucher đã lưu
    }
  };

  const dataSourceVoucher = useMemo(() => {
    if (!dataVoucher) return [[]];
    return dataVoucher.map((item, idx) => [
      <> {idx + 1}</>,
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
  }, [dataVoucher]);

  return (
    <div>
      {loading && <LoadingPage />}
      <ContentHeader title="Quản lý voucher" name="Danh sách voucher" />
      <Card>
        <Card.Content>
          <div className="flex items-center justify-end">
            <Button
              onClick={() => setOpenCreate(true)}
              className="mb-5"
              label="Tạo voucher"
            />
          </div>
          <Table columns={columnVocher} dataSource={dataSourceVoucher} />
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
            <div className="flex justify-between items-center px-6">
              <Button
                onClick={() => setOpenConfirm(false)}
                label="Hủy"
                className="bg-[#505A64] text-white"
              />
              <Button
                onClick={confirmDelete}
                label="Xóa"
                className="bg-[#1EA34A] text-white"
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

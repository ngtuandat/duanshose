import React, { ReactElement, useEffect, useMemo, useState } from "react";
import MainAdmin from "../../components/Layouts/MainAdmin";
import LoadingPage from "../../components/Loading/LoadingPage";
import { CustomHeader } from "../../components/Header/CustomHeader";
import ContentHeader from "../../components/Header/ContentHeader";
import Card from "../../components/Card";
import Table from "../../components/Table";
import Pagination from "../../components/Pagination";
import Modal from "../../components/Modal";
import Button from "../../components/Button";
import AddVoucher from "../../containers/voucher/AddVoucher";
import { DeleteVoucher, GetFullVoucher } from "../../services/voucher";
import { DataVoucherProps } from "../../interfaces/voucher";
import { useRouter } from "next/router";
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
  const [dataVoucher, setDataVoucher] = useState<DataVoucherProps[]>();
  const router = useRouter();
  const [voucherEdit, setVoucherEdit] = useState<DataVoucherProps>();

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

  const handleDelete = async (id: string) => {
    const res = await DeleteVoucher(id);
    if (res?.status === 200) {
      toast.success("Xoá thành công voucher!");
      handleGetAllVoucher();
    }
  };
  const dataSourceVoucher = useMemo(() => {
    if (!dataVoucher) return [[]];
    return dataVoucher?.map((item, idx) => {
      return [
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
        ,
      ];
    });
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
        {/* <Pagination
          current={Number(router.query.page || 1)}
          pageSize={limitValue}
          total={totalUsers}
          onChange={onChangePage}
          setLimitValue={setLimitValue}
        /> */}
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
    </div>
  );
};
Voucher.getLayout = function getLayout(page: ReactElement) {
  return <MainAdmin>{page}</MainAdmin>;
};

export default Voucher;

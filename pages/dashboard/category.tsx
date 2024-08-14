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
import { deleteCategory, getFullCategory } from "../../services/category";
import AddCategory from "../../containers/AddCategory";

const Category = ({ loading }: { loading: Boolean }) => {
  const columnCategory = ["Số thứ tự", "Tên", ""];
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [dataCategory, setDataCategory] = useState<any[]>();
  const router = useRouter();
  const [categoryEdit, setCategoryEdit] = useState<any>();

  console.log({ dataCategory });
  const handleGetAllCategory = async () => {
    const res = await getFullCategory();
    setDataCategory(res.data);
  };

  useEffect(() => {
    handleGetAllCategory();
  }, [openCreate, openEdit]);

  const handleEdit = (category: any) => {
    setCategoryEdit(category);
    setOpenEdit(true);
  };

  const handleDelete = async (id: string) => {
    const res = await deleteCategory(id);
    if (res?.status === 200) {
      toast.success("Xoá thành công category!");
      handleGetAllCategory();
    }
  };
  const dataSourceCategory = useMemo(() => {
    if (!dataCategory) return [[]];
    return dataCategory?.map((item, idx) => {
      return [
        <> {idx + 1}</>,
        <div className="text-primary font-bold">{item.name}</div>,
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
      ];
    });
  }, [dataCategory]);

  return (
    <div>
      {loading && <LoadingPage />}
      <ContentHeader title="Quản lý voucher" name="Danh sách category" />
      <Card>
        <Card.Content>
          <div className="flex items-center justify-end">
            <Button
              onClick={() => setOpenCreate(true)}
              className="mb-5"
              label="Tạo category"
            />
          </div>
          <Table columns={columnCategory} dataSource={dataSourceCategory} />
        </Card.Content>
      </Card>
      <Modal
        title="Thêm category mới"
        open={openCreate}
        setOpen={setOpenCreate}
      >
        <AddCategory handleClose={() => setOpenCreate(false)} />
      </Modal>
      <Modal title="Sửa category" open={openEdit} setOpen={setOpenEdit}>
        <AddCategory
          categoryEdit={categoryEdit}
          handleClose={() => setOpenEdit(false)}
        />
      </Modal>
    </div>
  );
};
Category.getLayout = function getLayout(page: ReactElement) {
  return <MainAdmin>{page}</MainAdmin>;
};

export default Category;

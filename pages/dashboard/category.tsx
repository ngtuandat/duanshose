import React, { ReactElement, useEffect, useMemo, useState } from "react";
import MainAdmin from "../../components/Layouts/MainAdmin";
import LoadingPage from "../../components/Loading/LoadingPage";
import ContentHeader from "../../components/Header/ContentHeader";
import Card from "../../components/Card";
import Table from "../../components/Table";
import Modal from "../../components/Modal";
import Button from "../../components/Button";
import AddCategory from "../../containers/AddCategory";
import { deleteCategory, getFullCategory } from "../../services/category";
import toast from "react-hot-toast";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";

const Category = ({ loading }: { loading: Boolean }) => {
  const columnCategory = ["Số thứ tự", "Tên", ""];
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [dataCategory, setDataCategory] = useState<any[]>([]);
  const [openConfirm, setOpenConfirm] = useState(false); // State cho modal xác nhận
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null); // State cho ID danh mục cần xóa
  const [isLoading, setIsLoading] = useState(false); // State cho trạng thái loading
  const [categoryEdit, setCategoryEdit] = useState<any>();

  const handleGetAllCategory = async () => {
    const res = await getFullCategory();
    setDataCategory(res.data);
  };

  useEffect(() => {
    handleGetAllCategory();
  }, []);

  const handleEdit = (category: any) => {
    setCategoryEdit(category);
    setOpenEdit(true);
  };

  const handleDelete = (id: string) => {
    setCategoryToDelete(id);
    setOpenConfirm(true); // Mở modal xác nhận
  };

  const confirmDelete = async () => {
    if (categoryToDelete) {
      setIsLoading(true); // Bắt đầu loading
      try {
        const res = await deleteCategory(categoryToDelete);
        if (res?.status === 200) {
          toast.success("Xoá thành công danh mục!");
          setDataCategory((prev) =>
            prev.filter((item) => item.id !== categoryToDelete)
          );
          setOpenConfirm(false); // Đóng modal xác nhận
        } else {
          toast.error("Xoá danh mục thất bại!");
        }
      } catch (error) {
        toast.error("Có lỗi xảy ra!");
      } finally {
        setIsLoading(false); // Kết thúc loading
      }
    }
  };

  // Cập nhật danh sách category khi thêm hoặc sửa
  const handleUpdateCategory = (category: any, isNew: boolean) => {
    setDataCategory((prev) => {
      if (isNew) {
        return [...prev, category]; // Thêm danh mục mới
      } else {
        return prev.map(
          (item) => (item.id === category.id ? category : item) // Cập nhật danh mục đã chỉnh sửa
        );
      }
    });
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
      <ContentHeader title="Quản lý category" name="Danh sách category" />
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
        <AddCategory
          handleClose={() => setOpenCreate(false)}
          handleUpdateCategory={handleUpdateCategory} // Truyền hàm cập nhật xuống AddCategory
        />
      </Modal>
      <Modal title="Sửa category" open={openEdit} setOpen={setOpenEdit}>
        <AddCategory
          categoryEdit={categoryEdit}
          handleClose={() => setOpenEdit(false)}
          handleUpdateCategory={handleUpdateCategory} // Truyền hàm cập nhật xuống AddCategory
        />
      </Modal>
      {openConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-10">
          <div className="bg-[#151B24] px-6 py-10 rounded-lg shadow-lg w-[400px] relative">
            <button
              onClick={() => setOpenConfirm(false)}
              className="absolute top-2 right-4 text-white text-2xl hover:text-red-600"
            >
              &times;
            </button>
            <p className="mb-9 text-white flex justify-center text-xl font-bold whitespace-nowrap">
              Bạn có muốn xóa danh mục này?
            </p>
            <div className="flex justify-center space-x-3 items-center px-6">
              <Button
                onClick={() => setOpenConfirm(false)}
                label="Hủy"
                className="bg-[#505A64] text-white"
              />
              <Button
                onClick={confirmDelete}
                label={isLoading ? "xóa..." : "Xóa"}
                className={`bg-[#1EA34A] text-white ${
                  isLoading ? "opacity-60 cursor-not-allowed" : ""
                }`}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

Category.getLayout = function getLayout(page: ReactElement) {
  return <MainAdmin>{page}</MainAdmin>;
};

export default Category;

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CategoryValidator } from "../interfaces/voucher";
import Button from "../components/Button";
import { createCategory, editCategory } from "../services/category";

const AddCategory = ({
  handleClose,
  categoryEdit,
  handleUpdateCategory,
}: {
  handleClose: () => void;
  categoryEdit?: any;
  handleUpdateCategory?: (category: any, isNew?: any) => void;
}) => {
  const [name, setName] = useState("");
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [validatorMess, setValidatorMess] = useState<CategoryValidator>();

  // Hàm kiểm tra form
  const validatorForm = () => {
    const mess: any = {};
    if (!name) {
      mess.name = "Hãy nhập tên phân loại";
    }
    setValidatorMess(mess);
    if (Object.keys(mess).length > 0) return true;
    return false;
  };

  // Hàm xử lý tạo hoặc chỉnh sửa danh mục
  const handleCreateCategory = async () => {
    setLoadingCreate(true);
    try {
      // Kiểm tra form
      if (validatorForm()) {
        setLoadingCreate(false); // Dừng loading nếu form không hợp lệ
        return;
      }

      if (categoryEdit) {
        // Nếu là chỉnh sửa danh mục
        const categoryNew = { id: categoryEdit.id, name };
        const res = await editCategory(categoryNew);
        if (res.status === 200) {
          toast.success("Sửa category thành công!");
          handleUpdateCategory?.(categoryNew, false); // Cập nhật danh mục đã chỉnh sửa
          handleClose(); // Đóng modal sau khi hoàn thành
        }
      } else {
        // Nếu là tạo mới danh mục
        const categoryCreate = { name };
        const res = await createCategory(categoryCreate);
        if (res.status === 200) {
          toast.success("Tạo mới category thành công!");
          handleUpdateCategory?.(res.data, true); // Cập nhật danh mục mới
          handleClose(); // Đóng modal sau khi hoàn thành
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Có lỗi xảy ra!");
    } finally {
      setLoadingCreate(false); // Tắt trạng thái loading
    }
  };

  // Gán tên danh mục khi chỉnh sửa
  useEffect(() => {
    if (categoryEdit) {
      setName(categoryEdit.name);
    }
  }, [categoryEdit]);

  return (
    <div className="w-80">
      <div className="relative mb-4">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          id="name"
          type="string"
          className={`peer text-white bg-transparent border w-full px-2.5 py-3 rounded-lg focus:border-white hover:border-white border-color-primary ${
            validatorMess?.name && "border-red-500"
          }`}
        />
        <label
          className={`absolute text-base px-1 rounded-lg text-[rgb(99,115,129)] peer-focus:-top-3 peer-focus:left-3 peer-focus:text-sm peer-focus:text-white transition-all duration-300 bg-[#161C24] ${
            name.length
              ? "bg-[#161C24] text-white left-3 text-sm -top-3"
              : "top-3 left-3"
          } ${validatorMess?.name && "text-red-500"} cursor-text `}
          htmlFor="name"
        >
          Tên phân loại
        </label>
        {validatorMess?.name && (
          <i className="text-red-500 text-xs pl-1">{validatorMess?.name}</i>
        )}
      </div>

      <div className="flex items-center justify-center">
        <Button
          loading={loadingCreate}
          onClick={handleCreateCategory}
          label={categoryEdit ? "Lưu" : "Tạo"}
        />
      </div>
    </div>
  );
};

export default AddCategory;

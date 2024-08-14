import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CategoryValidator, VoucherValidator } from "../interfaces/voucher";
import Button from "../components/Button";
import { CreateVoucher } from "../services/voucher";
import { createCategory, editCategory } from "../services/category";

const AddCategory = ({
  handleClose,
  categoryEdit,
}: {
  handleClose: () => void;
  categoryEdit?: any;
}) => {
  const [name, setName] = useState("");

  const [loadingCreate, setLoadingCreate] = useState(false);

  const [validatorMess, setValidatorMess] = useState<CategoryValidator>();

  const validatorForm = () => {
    const mess: any = {};

    if (!name) {
      mess.name = "Hãy nhập tên phân loại";
    }

    setValidatorMess(mess);
    if (Object.keys(mess).length > 0) return true;
    return false;
  };

  const handleCreateVoucher = async () => {
    setLoadingCreate(true);
    try {
      validatorForm();
      if (categoryEdit) {
        const categoryNew = {
          id: categoryEdit.id,
          name: name,
        };

        const res = await editCategory(categoryNew);
        if (res.status === 200) {
          toast.success("Sửa category thành công!");
          handleClose();
        }
      } else {
        const categoryCreate = {
          name,
        };

        const res = await createCategory(categoryCreate);
        if (res.status === 200) {
          toast.success("Tạo mới category thành công!");
          handleClose();
        }
      }
    } catch (error) {
      console.log(error);
    }
    setLoadingCreate(false);
  };

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
          onClick={handleCreateVoucher}
          label={categoryEdit ? "Lưu" : "Tạo"}
        />
      </div>
    </div>
  );
};

export default AddCategory;

import { Menu, Transition } from "@headlessui/react";
import React, { Fragment, useEffect, useState } from "react";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { toast } from "react-toastify";
import { updateAdmin } from "../services/user";

interface IProps {
  role: boolean;
  id: string;
  count: number;
  onRoleChange: () => void; // Thêm callback để làm mới count
}

const Role: React.FC<IProps> = (props) => {
  const { role, id, count, onRoleChange } = props;
  const listMenu = ["Admin", "User"];

  const [selected, setSelected] = useState<boolean>(role);
  const [selectValue, setSelectValue] = useState<string>();

  const handleUpdate = async (option: string) => {
    try {
      if (option === "Admin") {
        setSelected(true);
      } else if (option === "User" && count > 1) {
        setSelected(false);
      } else if (option === "User" && count <= 1) {
        toast.error("Phải có ít nhất một admin.");
        return;
      }

      setSelectValue(option);

      const user = {
        id: id,
        role: selected,
      };

      const res = await updateAdmin(user);
      if (res.status === 200) {
        toast.success("Cập nhật quyền thành công!");
        onRoleChange(); // Gọi callback để làm mới số lượng admin
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setSelectValue(role ? "Admin" : "User");
  }, [role]);

  return (
    <div>
      <Menu
        as="div"
        className="relative border border-[rgba(145,158,171,0.32)] hover:border-white rounded-lg"
      >
        <Menu.Button className="flex items-center justify-between font-bold px-0.5 py-2 space-x-8">
          <p className="text-white ml-1 text-sm font-semibold">{selectValue}</p>
          <MdOutlineKeyboardArrowDown className="text-lg text-icon" />
        </Menu.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute left-0 p-2 z-[2900] mt-2 w-20 origin-top-left rounded-md bg-[rgb(26,34,43)] shadow-2xl focus:outline-none">
            <div className="py-1">
              {listMenu.map((option, idx) => (
                <Menu.Item key={idx}>
                  {({ active }) => (
                    <p
                      onClick={() => handleUpdate(option)}
                      className={`cursor-pointer rounded-md block py-1.5 px-2 text-sm font-medium text-white ${
                        active ? "bg-[rgba(145,158,171,0.10)]" : ""
                      } ${
                        selectValue === option
                          ? "bg-[rgba(145,158,171,0.16)]"
                          : ""
                      }`}
                    >
                      {option}
                    </p>
                  )}
                </Menu.Item>
              ))}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
};

export default Role;

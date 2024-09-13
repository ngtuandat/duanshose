import React, { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { IoMdNotifications } from "react-icons/io";
import MenuDropIcon from "../DropMenu/MenuDropIcon";
import { HiOutlineHome } from "react-icons/hi";
import { CgProfile } from "react-icons/cg";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";

const menuAccout = [
  {
    title: "Home",
    icon: <HiOutlineHome />,
    href: "/",
  },
  {
    title: "Profile",
    icon: <CgProfile />,
    href: "/",
  },
];

const HeaderAdmin = () => {
  const [name, setName] = useState<string>();
  const [email, setEmail] = useState<string>();

  const token = Cookies.get("token");

  useEffect(() => {
    if (token) {
      const decoded: any = jwt_decode(token);
      setName(decoded.firstName + "" + decoded.lastName);
      setEmail(decoded.email);
    }
  }, [token]);
  return (
    <div className="flex items-center h-full text-[rgb(145,158,171)] select-none">
      {/* <div className="rounded-full hover:bg-[rgba(145,158,171,0.08)] hover:scale-105 p-2 flex items-center justify-center cursor-pointer">
        <FiSearch className="text-lg" />
      </div> */}
      <div className="flex-1 flex items-center space-x-3 justify-end">
        {/* <div className="cursor-pointer rounded-full hover:bg-[rgba(145,158,171,0.08)] hover:scale-105">
          <div className="p-2">
            <img src="/images/svg/flag_vn.svg" alt="" />
          </div>
        </div>
        <div className="p-2 cursor-pointer rounded-full hover:bg-[rgba(145,158,171,0.08)] hover:scale-105">
          <IoMdNotifications className="text-xl" />
        </div> */}
        <MenuDropIcon
          logout
          menu={menuAccout}
          information={{ name: name, email: email }}
          className="-right-8 w-44"
        >
          <div className="p-2 cursor-pointer hover:scale-105">
            <img
              src="/images/avatar_admin.jpg"
              className="h-10 w-10 rounded-full object-cover"
              alt=""
            />
          </div>
        </MenuDropIcon>
      </div>
    </div>
  );
};

export default HeaderAdmin;

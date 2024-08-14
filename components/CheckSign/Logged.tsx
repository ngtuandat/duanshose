import { Menu } from "@headlessui/react";
import React from "react";
import { BsFilePerson } from "react-icons/bs";
import { RxExit } from "react-icons/rx";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import Link from "next/link";
import { BiPurchaseTagAlt } from "react-icons/bi";

interface LoggedProps {
  name: string;
  avatar: string | undefined;
}

const menuUser = [
  {
    icon: <BsFilePerson />,
    title: "Trang cá nhân",
    href: "/user/profile",
  },
  {
    icon: <BiPurchaseTagAlt />,
    title: "Đơn mua",
    href: "/user/purchase",
  },
];

const Logged = ({ name, avatar }: LoggedProps) => {
  const router = useRouter();

  const handleLogout = () => {
    router.push("/sign-in");
    Cookies.remove("token");
    sessionStorage.removeItem("count");
  };

  return (
    <div>
      <Menu as="div" className="relative">
        <Menu.Button className="flex items-center space-x-2 hover:opacity-90">
          <img
            src={avatar ? avatar : "/images/avt.jpg"}
            className="w-9 h-9 rounded-full"
            alt=""
          />
          <div className="text-white font-semibold">{name}</div>
        </Menu.Button>
        <Menu.Items className="absolute bg-dark shadow-md top-[130%] rounded-lg w-40 p-1">
          {menuUser.map((item, index) => (
            <Menu.Item key={index}>
              {({ active }) => (
                <Link href={item?.href}>
                  <button
                    className={`${
                      active
                        ? "bg-[rgba(0,171,85,0.16)] text-[rgb(91,229,132)] "
                        : ""
                    } group flex w-full items-center text-white rounded-md px-2 py-2 space-x-2 text-sm `}
                  >
                    {item?.icon}
                    <p className="w-full min-w-fit flex justify-start">
                      {item?.title}
                    </p>
                  </button>
                </Link>
              )}
            </Menu.Item>
          ))}
          <Menu.Item as="div" className="w-full">
            {({ active }) => (
              <button
                onClick={handleLogout}
                className={`${
                  active ? " text-red-400" : ""
                } group flex w-full items-center text-white rounded-md px-2 py-2 space-x-2 text-sm `}
              >
                <RxExit />
                <p className="w-full min-w-fit flex justify-start">Đăng xuất</p>
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Menu>
    </div>
  );
};

export default Logged;

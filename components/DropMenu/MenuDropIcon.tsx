import React, { ReactNode } from "react";
import { Menu } from "@headlessui/react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { RxExit } from "react-icons/rx";
import Link from "next/link";
import { MenuDropIconProps } from "../../interfaces/main";

const MenuDropIcon = ({
  menu,
  children,
  logout,
  information,
  className,
}: MenuDropIconProps) => {
  const router = useRouter();

  const handleLogout = () => {
    router.push("/sign-in");
    Cookies.remove("token");
  };
  return (
    <Menu as="div" className="relative">
      <Menu.Button className="flex items-center space-x-2 hover:opacity-90">
        {children}
      </Menu.Button>
      <Menu.Items
        className={`absolute bg-dark shadow-md top-[100%] rounded-lg py-1 px-2 ${className}`}
      >
        {information ? (
          <Menu.Item
            as="div"
            className=" z-[5000] w-full px-2 py-3 border-b border-dashed border-[rgba(145,158,171,0.24)]"
          >
            <p className="text-sm font-semibold text-white">
              {information.name}
            </p>
            <p className="text-xs font-normal text-[rgb(145,158,171)]">
              {information.email}
            </p>
          </Menu.Item>
        ) : (
          <></>
        )}
        <div className="my-1 space-y-1">
          {menu.map((item, index) => (
            <Link key={index} href={item?.href}>
              <Menu.Item as="div" className="w-full">
                {({ active }) => (
                  <button
                    className={`${
                      active
                        ? "bg-[rgba(0,171,85,0.16)] text-[rgb(91,229,132)] "
                        : ""
                    } group flex w-full items-center text-white rounded-md px-2 py-2 space-x-2 text-sm `}
                  >
                    <p className="text-sm">{item?.icon}</p>
                    <p className="w-full min-w-fit flex justify-start">
                      {item?.title}
                    </p>
                  </button>
                )}
              </Menu.Item>
            </Link>
          ))}
        </div>
        {logout ? (
          <Menu.Item
            as="div"
            className="w-full border-t border-dashed border-[rgba(145,158,171,0.24)]"
          >
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
        ) : (
          <></>
        )}
      </Menu.Items>
    </Menu>
  );
};

export default MenuDropIcon;

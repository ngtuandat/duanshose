import Cookies from "js-cookie";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import { SiGoogleanalytics } from "react-icons/si";
import { FaUserCog } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/router";
import { GiConverseShoe } from "react-icons/gi";
import {
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";
import { RxDotFilled } from "react-icons/rx";
import { motion } from "framer-motion";
import { ListMenuHover } from "../../interfaces/main";
import { BiPurchaseTagAlt } from "react-icons/bi";
import { HiOutlineTicket } from "react-icons/hi2";
import { FaPenAlt } from "react-icons/fa";
import { FaUserTag } from "react-icons/fa";
import { MdCategory } from "react-icons/md";

const menuAdmin = [
  {
    label: "Thống kê",
    href: "/dashboard",
    icon: <SiGoogleanalytics />,
  },

  {
    label: "Sản phẩm",
    icon: <GiConverseShoe />,
    menuChildren: [
      {
        title: "Danh sách sản phẩm",
        href: "/dashboard/product/manage-product",
      },
      {
        title: "Tạo sản phẩm",
        href: "/dashboard/product/create",
      },
    ],
  },
  {
    label: "Quản lý tài khoản",
    href: "/dashboard/manage-account",
    icon: <FaUserCog />,
  },
  {
    label: "Sản phẩm đã bán",
    href: "/dashboard/purchase",
    icon: <BiPurchaseTagAlt />,
  },
  {
    label: "Quản lý khách vãng lai",
    href: "/dashboard/guest",
    icon: <FaUserTag />,
  },
  {
    label: "Quản lý voucher",
    href: "/dashboard/voucher",
    icon: <HiOutlineTicket />,
  },
  {
    label: "Quản lý phân loại",
    href: "/dashboard/category",
    icon: <MdCategory />,
  },
  {
    label: "Quản lý bình luận",
    href: "/dashboard/review",
    icon: <FaPenAlt />,
  },
];

const menuChildrenVariant = {
  open: {
    height: "100%",
    opacity: 1,
    transition: {
      duration: 0.1,
    },
  },
  closed: {
    height: "0px",
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
};

const NavAdmin = ({
  zoomOutMenu,
  setOpen,
}: {
  zoomOutMenu?: boolean;
  setOpen?: Dispatch<SetStateAction<boolean>>;
}) => {
  const [name, setName] = useState<string>();
  const [pathSelected, setPathSelected] = useState("dashboard");
  const [openMenu, setOpenMenu] = useState<string[]>([]);
  const [listMenuHover, setListMenuHover] = useState<
    ListMenuHover[] | undefined
  >();
  const [heightMenu, setHeightMenu] = useState<string>();
  const [displayMenu, setDisplayMenu] = useState("hidden");

  const router = useRouter();
  const path = router.pathname;
  const token = Cookies.get("token");

  useEffect(() => {
    if (token) {
      const decoded: any = jwt_decode(token);
      setName(decoded.firstName + "" + decoded.lastName);
    }
  }, [token]);

  useEffect(() => {
    setPathSelected(path);
  }, [path]);

  const handleSelectMenu = (label: string) => {
    if (!openMenu?.includes(label)) {
      setOpenMenu([...openMenu, label]);
    } else {
      const res = openMenu?.filter((item) => item !== label);
      setOpenMenu(res);
    }
  };

  const handleShowMenu = (e: any, menu: any) => {
    setHeightMenu(String(Number(e.target.parentElement.offsetTop) + 70) + "px");
    if (menu) {
      setListMenuHover(menu);
    }
    setDisplayMenu("block");
  };
  const handleNavigation = () => {
    setOpenMenu([]);
    setOpen && setOpen(false);
  };

  const handleNavigationChild = (label: string) => {
    setOpenMenu([label]);
    setOpen && setOpen(false);
  };

  return (
    <div className="relative">
      <div
        className={`h-full  overflow-y-auto fixed top-0 transition-all duration-300 left-0 ${
          zoomOutMenu ? "w-[90px]" : "w-64 min-[1200px]:w-[280px]"
        }`}
      >
        <div className={`${zoomOutMenu ? "px-1.5" : "px-5"}`}>
          {zoomOutMenu ? (
            <div className="w-full flex items-center justify-center my-4">
              <img src="/images/logo1.svg" className="w-14 h-14" alt="" />
            </div>
          ) : (
            <div className="pt-6 pb-4">
              <img src="/images/logo1.svg" className="w-14 h-14" alt="" />
              <div className="flex w-full items-center space-x-4 px-5 py-4 bg-[rgba(145,158,171,0.12)] rounded-lg mt-[22px]">
                <img
                  src="/images/avatar_admin.jpg"
                  className="w-10 h-10 rounded-full"
                  alt=""
                />
                <div className="text-sm">
                  <p className="font-semibold text-white">{name}</p>
                  <p className="text-[rgb(145,158,171)]">admin</p>
                </div>
              </div>
            </div>
          )}
          <div className="space-y-1 relative">
            {menuAdmin.map((menu, idx) => (
              <div key={idx}>
                {menu?.href ? (
                  <Link
                    onClick={handleNavigation}
                    className={`block ${
                      zoomOutMenu ? "text-[10px]" : "text-sm"
                    }`}
                    href={menu?.href}
                  >
                    <div
                      className={`cursor-pointer flex items-center ${
                        zoomOutMenu ? "flex-col space-y-1" : "space-x-3"
                      }  py-3 pl-4 pr-3 rounded-md 
                    ${
                      pathSelected === menu?.href
                        ? "text-[rgb(91,229,132)] bg-[rgba(0,171,85,0.16)] font-semibold"
                        : "font-medium text-[rgb(145,158,171)] hover:bg-[rgba(145,158,171,0.08)]"
                    }`}
                    >
                      <div className={`${zoomOutMenu ? "text-lg" : "text-lg"}`}>
                        {menu?.icon}
                      </div>
                      <p>{menu?.label}</p>
                    </div>
                  </Link>
                ) : (
                  <div
                    onMouseEnter={(e) => handleShowMenu(e, menu?.menuChildren)}
                    onMouseLeave={() => setDisplayMenu("hidden")}
                    onClick={() => handleSelectMenu(menu?.label)}
                    className={`block  ${
                      zoomOutMenu
                        ? "text-[10px] relative hover:after:cursor-pointer hover:after:absolute hover:after:w-10 hover:after:h-full hover:after:-right-10 hover:after:top-0"
                        : "text-sm"
                    } ${menu?.label}`}
                  >
                    <div
                      className={`cursor-pointer relative flex items-center py-3 pl-4 pr-3 rounded-md 
                    ${
                      menu?.menuChildren?.find(
                        (ele) => ele.href === pathSelected
                      )
                        ? "text-[rgb(91,229,132)] bg-[rgba(0,171,85,0.16)] font-semibold"
                        : "font-medium text-[rgb(145,158,171)] hover:bg-[rgba(145,158,171,0.08)]"
                    }`}
                    >
                      <div
                        className={`flex-1 flex items-center ${
                          zoomOutMenu ? "flex-col space-y-1" : "space-x-3"
                        }`}
                      >
                        <div
                          className={`${zoomOutMenu ? "text-lg" : "text-lg"}`}
                        >
                          {menu?.icon}
                        </div>
                        <p>{menu?.label}</p>
                      </div>
                      <div
                        className={`absolute text-base select-none pointer-events-none ${
                          zoomOutMenu ? "right-0 top-3" : "right-4"
                        } transition-all duration-300`}
                      >
                        {openMenu?.includes(menu?.label) ? (
                          <MdOutlineKeyboardArrowDown />
                        ) : (
                          <MdOutlineKeyboardArrowRight />
                        )}
                      </div>
                    </div>
                  </div>
                )}
                {!zoomOutMenu && (
                  <motion.div
                    initial="closed"
                    animate={
                      openMenu?.includes(menu?.label) ? "open" : "closed"
                    }
                    variants={menuChildrenVariant}
                    className="mt-1 overflow-hidden"
                  >
                    {menu?.menuChildren?.map((item, idex) => (
                      <Link
                        key={idex}
                        href={item?.href}
                        onClick={() => handleNavigationChild(menu?.label)}
                      >
                        <div className="flex items-center py-2 pl-4 pr-3 rounded-md text-[rgb(145,158,171)] hover:bg-[rgba(145,158,171,0.08)]">
                          <RxDotFilled
                            className={`${
                              pathSelected === item?.href
                                ? "text-green-500 scale-105"
                                : ""
                            }`}
                          />
                          <p
                            className={`text-sm ml-3.5 ${
                              pathSelected === item?.href
                                ? " font-semibold text-white"
                                : "font-normal"
                            }`}
                          >
                            {item?.title}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      {zoomOutMenu && (
        <div
          onMouseEnter={() => setDisplayMenu("block")}
          onMouseLeave={() => setDisplayMenu("hidden")}
          className={`w-40 p-2 backdrop-blur-sm absolute left-[90px] bg-[rgba(22,28,36,0.8)]  shadow-menu-hover rounded-lg ${displayMenu}`}
          style={{ top: heightMenu }}
        >
          {listMenuHover &&
            listMenuHover.map((item, idx) => (
              <Link key={idx} href={item?.href}>
                <div className="flex items-center py-2 pl-4 pr-3 rounded-md text-[rgb(145,158,171)] hover:bg-[rgba(145,158,171,0.08)]">
                  <p
                    className={`text-sm ml-3.5 ${
                      pathSelected === item?.href
                        ? " font-semibold text-white"
                        : "font-normal"
                    }`}
                  >
                    {item?.title}
                  </p>
                </div>
              </Link>
            ))}
        </div>
      )}
    </div>
  );
};

export default NavAdmin;

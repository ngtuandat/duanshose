import Link from "next/link";
import { useRouter } from "next/router";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import Image from "next/image";
import { AiFillHome } from "react-icons/ai";
import { GiRunningShoe } from "react-icons/gi";
import { CgProfile } from "react-icons/cg";
import { BiPurchaseTagAlt } from "react-icons/bi";
import { FiUserPlus } from "react-icons/fi";
import { FaSignInAlt } from "react-icons/fa";
import { VscSignIn } from "react-icons/vsc";
import Cookies from "js-cookie";

const NavClientMb = ({
  name,
  avatar,
  setOpen,
}: {
  name: string | undefined;
  avatar: string | undefined;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const router = useRouter();
  const path = router.pathname;
  const [pathSelected, setPathSelected] = useState("/");

  const handleLogout = () => {
    router.push("/sign-in");
    Cookies.remove("token");
    sessionStorage.removeItem("count");
    setOpen(false);
  };

  useEffect(() => {
    setPathSelected(path);
  }, [path]);

  const customerNav = [
    {
      url: "/",
      label: "Trang Chủ",
      icon: <AiFillHome />,
    },
    {
      url: "/product",
      label: "Sản Phẩm",
      icon: <GiRunningShoe />,
    },
    // {
    //   url: "/category",
    //   label: "Danh mục",
    // },
    {
      url: "/news",
      label: "Tin tức - Sự kiện",
    },
    {
      url: "/contact",
      label: "Liên Hệ",
    },
  ];

  const userNav = [
    {
      url: "/user/profile",
      label: "Trang Cá Nhân",
      icon: <CgProfile />,
    },
    {
      url: "/user/purchase",
      label: "Đơn Mua",
      icon: <BiPurchaseTagAlt />,
    },
  ];
  const noSign = [
    {
      url: "/sign-in",
      label: "Đăng Nhập",
      icon: <FaSignInAlt />,
    },
    {
      url: "/sign-up",
      label: "Đăng ký",
      icon: <FiUserPlus />,
    },
  ];
  return (
    <div>
      <div className="block ">
        <div className="my-6 mx-5">
          <Image src="/images/logo.svg" alt="logo" width={40} height={40} />
        </div>

        <nav className="flex flex-col">
          {customerNav.map((item, index) => (
            <Link href={item?.url} key={index}>
              <div
                onClick={() => setOpen(false)}
                key={index}
                className={`h-12 px-4 py-1.5 flex space-x-3 items-center text-sm font-semibold relative ${
                  pathSelected === item?.url
                    ? " text-primary bg-[rgba(0,171,85,0.16)]"
                    : "text-[rgb(145,158,171)]"
                }`}
              >
                {item?.icon}
                <p>{item?.label}</p>
              </div>
            </Link>
          ))}
        </nav>
        <hr className="border-[rgb(145,158,171,0.5)] w-full my-0.5 border-t border-dashed" />
        {name ? (
          <div>
            <div className="px-4 py-1.5 flex items-center space-x-3">
              <img
                src={avatar ? avatar : "/images/avt.jpg"}
                className="w-9 h-9 rounded-full"
                alt=""
              />
              <div className="text-white font-semibold">{name}</div>
            </div>
            <nav className="flex flex-col">
              {userNav.map((item, index) => (
                <Link href={item?.url} key={index}>
                  <div
                    onClick={() => setOpen(false)}
                    key={index}
                    className={`h-12 px-4 py-1.5 flex space-x-3 items-center text-sm font-semibold relative ${
                      pathSelected === item?.url
                        ? " text-primary bg-[rgba(0,171,85,0.16)]"
                        : "text-[rgb(145,158,171)]"
                    }`}
                  >
                    {item?.icon}
                    <p>{item?.label}</p>
                  </div>
                </Link>
              ))}
            </nav>
            <div
              onClick={handleLogout}
              className={`cursor-pointer h-12 px-4 py-1.5 flex space-x-3 items-center text-sm font-semibold relative text-red-500 opacity-60
                `}
            >
              <VscSignIn />
              <p>Đăng xuất</p>
            </div>
          </div>
        ) : (
          <nav className="flex flex-col">
            {noSign.map((item, index) => (
              <Link href={item?.url} key={index}>
                <div
                  onClick={() => setOpen(false)}
                  key={index}
                  className={`h-12 px-4 py-1.5 flex space-x-3 items-center text-sm font-semibold relative ${
                    pathSelected === item?.url
                      ? " text-primary bg-[rgba(0,171,85,0.16)]"
                      : "text-[rgb(145,158,171)]"
                  }`}
                >
                  {item?.icon}
                  <p>{item?.label}</p>
                </div>
              </Link>
            ))}
          </nav>
        )}
      </div>
    </div>
  );
};

export default NavClientMb;

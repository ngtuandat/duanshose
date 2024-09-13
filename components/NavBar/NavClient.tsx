import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import Cookies from "js-cookie";

const NavClient = () => {
  const token = Cookies.get("token");
  const router = useRouter();
  console.log(router, "routerxxx");
  const path = router.pathname;
  console.log(path, "pathxxx");
  const [pathSelected, setPathSelected] = useState("/");

  useEffect(() => {
    setPathSelected(path);
  }, [path]);

  const customerNav = [
    {
      url: "/",
      label: "Trang chủ",
    },
    {
      url: "/product",
      label: "Sản phẩm",
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
    {
      url: token ? "/checkout" : "/user/purchase",
      label: token ? <FaShoppingCart /> : "Đơn Mua",
    },
    // {
    //   url: "/user/profile",
    //   label: "Quản lý thông tin cá nhân",
    // },
    // {
    //   url: "/user/purchase",
    //   label: "Quản lý đơn hàng",
    // },
  ];
  return (
    <div>
      <div className="block">
        <nav className="px-2 space-x-4 flex items-center">
          {customerNav.map((item, index) => (
            <Link href={item?.url} key={index}>
              <div
                key={index}
                className={` px-2 py-1 flex space-x-1 items-center text-sm font-semibold hover:opacity-75 relative ${
                  pathSelected === item?.url ? " text-primary" : "text-white"
                }`}
              >
                {pathSelected === item?.url ? (
                  <p className="h-[5px] w-[5px] rounded-full bg-primary "></p>
                ) : (
                  <></>
                )}
                <p>{item?.label}</p>
              </div>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default NavClient;

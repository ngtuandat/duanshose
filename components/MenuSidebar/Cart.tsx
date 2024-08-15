import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import Cookies from "js-cookie";
import { useCountCart } from "../../hooks/useCountCart";
import jwt_decode from "jwt-decode";
import { getProductCart } from "../../services/product";

const Cart = () => {
  const [count, setCount] = useState(0);
  const updateCart = Cookies.get("updateCart");
  const token = Cookies.get("token");

  console.log({ count });
  const fetchCart = async (id: string) => {
    try {
      const res = await getProductCart(id);
      setCount(res.data.count);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (token) {
      const decoded: any = jwt_decode(token);
      fetchCart(decoded.id);
    }
  }, [token, updateCart, fetchCart]);
  console.log({ count });
  return (
    <Link href="/checkout">
      <div className="bg-[rgb(33,43,54)] z-[2100] cursor-pointer text-white pl-4 pr-6 pt-4 pb-2 fixed top-40 right-0 rounded-l-md shadow-sm">
        <FaShoppingCart />
        <span className="bg-red-500 absolute top-1 right-3 text-xs rounded-full px-1.5">
          {count}
        </span>
      </div>
    </Link>
  );
};

export default Cart;

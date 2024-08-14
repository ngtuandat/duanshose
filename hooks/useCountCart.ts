import { useEffect, useState } from "react";
import { getProductCart } from "../services/product";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";

export const useCountCart = () => {
  const [count, setCount] = useState(0);
  const [decodeToken, setDecodeToken] = useState<any>();
  const token = Cookies.get("token");

  useEffect(() => {
    if (token) {
      const decoded: any = jwt_decode(token);
      setDecodeToken(decoded);
    }
  }, [token]);

  const fetchCart = async (id: string) => {
    console.log({ id });
    try {
      const res = await getProductCart(id);
      console.log({ qweqwe: res.data.count });
      setCount(res.data.count);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (decodeToken?.id) {
      fetchCart(decodeToken.id);
    }
  }, [decodeToken?.id]);

  return { count, fetchCart, setCount };
};

// context/CartContext.tsx
import Cookies from "js-cookie";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import useSWR from "swr";
import jwt_decode from "jwt-decode";
import { getProductCart } from "../../services/product";

interface CartContextProps {
  count: number;
  fetchCart: any;
}
const fetcher = (url: string) => fetch(url).then((res) => res.json());

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
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
    try {
      const res = await getProductCart(id);
      console.log("resqwdqweqw", res);
      setCount(res.data.count);
    } catch (error) {
      console.log(error);
    }
  };
  console.log("resqwdqweqw2", count);

  return (
    <CartContext.Provider value={{ count, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

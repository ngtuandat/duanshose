import React, { useEffect, useState } from "react";
import { GetUsersQuery } from "../interfaces/user";
import { getAllProducts, getProductCart } from "../services/product";
import { useRouter } from "next/dist/client/router";
import { ListProduct } from "../interfaces/product";
import Link from "next/link";
import PaginationClient from "./../components/Pagination/PaginationClient";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import LoadingPage from "../components/Loading/LoadingPage";
import Footer from "../components/Footer";

const DEFAULT_PRODUCTS_LIMIT = 16;

const ProductContent = () => {
  const [limitValue, setLimitValue] = useState(DEFAULT_PRODUCTS_LIMIT);
  const [products, setProducts] = useState<ListProduct[]>();
  const [totalProduct, setTotalProduct] = useState(0);

  const token = Cookies.get("token");

  const router = useRouter();

  const fetchProducts = async (query?: GetUsersQuery): Promise<void> => {
    try {
      const { data } = await getAllProducts({
        ...query,
        limit: limitValue,
        page: query?.page ? query?.page : 1,
      });

      setProducts(data.product);
      setTotalProduct(data.total);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCart = async (id: string) => {
    try {
      const res = await getProductCart(id);
      if (res.data.count) {
        sessionStorage.setItem("count", res.data.count);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onChangePage = (page: number) => {
    router.push(
      {
        query: {
          page: page,
        },
      },
      undefined,
      { shallow: true }
    );
  };

  useEffect(() => {
    fetchProducts(router.query);
  }, [router.isReady, router.query]);

  useEffect(() => {
    if (token) {
      const decoded: any = jwt_decode(token);
      fetchCart(decoded.id);
    }
  }, [token]);

  return (
    <>
      {products && products?.length > 0 ? (
        <div className="grid grid-cols-4 gap-6 mb-10">
          {products.map((product, idx) => (
            <Link
              href={`/product/${product?.id}`}
              className="bg-product col-span-4 lg:col-span-1 rounded-lg cursor-pointer hover:-translate-y-1 transition-all duration-200"
              key={idx}
            >
              <div className="p-2">
                <img
                  className="rounded-lg w-[262px] h-[262px] object-cover"
                  src={product?.listImage[0]}
                  alt={product?.name}
                />
              </div>
              <div className="py-6 px-2">
                <h1 className="text-base font-semibold">{product?.name}</h1>
                <div className="flex items-center justify-between mt-5 px-3">
                  <div className="flex items-center">
                    {product?.color.map((col, idx) => (
                      <div
                        className="h-3 w-3 rounded-full"
                        key={idx}
                        style={{ backgroundColor: col }}
                      />
                    ))}
                  </div>
                  <p className="text-base font-semibold">
                    {product?.price.toLocaleString("vi")} đ
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="flex w-full justify-center items-center text-xl sm:text-2xl font-bold py-40 opacity-20">
          Không có sản phẩm bạn đang tìm!!
        </p>
      )}
      <PaginationClient
        current={Number(router.query.page || 1)}
        pageSize={limitValue}
        total={totalProduct}
        onChange={onChangePage}
      />
      <Footer />
    </>
  );
};

export default ProductContent;

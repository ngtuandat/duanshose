import React, { useEffect, useState } from "react";
import { RiLuggageCartFill } from "react-icons/ri";
import Link from "next/link";
import { CiSearch } from "react-icons/ci";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { ListProduct } from "../interfaces/product";
import { GetUsersQuery } from "../interfaces/user";
import { getAllProducts } from "../services/product";
import PaginationClient from "../components/Pagination/PaginationClient";

const inputVariant = {
  open: {
    width: "800px",
    transition: {
      duration: 0.4,
    },
  },
  closed: {},
};
const DEFAULT_PRODUCTS_LIMIT = 5;

const BackHome = () => {
  const [focused, setFocused] = useState(false);
  const [limitValue, setLimitValue] = useState(DEFAULT_PRODUCTS_LIMIT);

  const [products, setProducts] = useState<ListProduct[]>();
  const [totalProduct, setTotalProduct] = useState(0);
  const images = [
    // "./images/logo.png",
    // "./images/logo1.jpg",
    // "./images/bannerhotel.jpeg",
    "./images/anh1.jpg",
    "./images/anh2.jpg",
    // "./images/anh3.jpg",
    // "./images/anh4.jpg",
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  console.log(currentImageIndex, "currentImageIndex");

  const goToPreviousImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex - 1 >= 0 ? prevIndex - 1 : images.length - 1
    );
  };

  const goToNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex + 1 < images.length ? prevIndex + 1 : 0
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex + 1 < images.length ? prevIndex + 1 : 0
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

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

  const handleQuerySearch = (value: string) => {
    const query = { ...router.query, query: value };

    router.push({ pathname: "/product", query }, undefined, {
      shallow: true,
    });
  };

  return (
    <div className="bg-home-dark w-full h-screen fixed top-0 left-0">
      {/* <div className="grid lg:grid-cols-12 h-screen lg:gap-24 relative max-w-sm lg:max-w-[1200px] mx-auto"> */}
      {/* <div className="-mt-[18%] lg:col-span-6 row-start-1 text-center flex flex-col justify-center items-center space-y-1 lg:space-y-5">
          <div>
            <h2 className="font-extrabold text-4xl lg:text-5xl leading-[1.33333] text-white">
              Start <br />
              shopping at
            </h2>
          </div>
          <div>
            <h1 className="text-6xl lg:text-8xl bg-text lg:-mt-1">Cuc Shoes</h1>
          </div>
          <div>
            <p className="text-white text-sm my-1 mb-4 lg:mb-2 lg:my-2 leading-6 font-normal">
              Ở đây các bạn sẽ có được những sản phẩm đang nổi lên và yên tâm về
              giá thành và chất lượng sản phẩm!
            </p>
          </div>
          <div className="flex justify-start">
            <Link href="/product">
              <button className="flex items-center space-x-1 border border-white text-base font-bold px-5 py-3 text-white rounded-lg hover:bg-white hover:bg-opacity-5">
                <RiLuggageCartFill className="text-xl" />
                <p>Mua Hàng Ngay</p>
              </button>
            </Link>
          </div>
        </div> */}
      <div className="mt-[100px] max-w-sm lg:max-w-[1200px] mx-auto">
        <form className="flex items-center text-xl mb-12">
          <label htmlFor="simple-search" className="sr-only">
            Search
          </label>
          <div className="relative  lg:w-full left-[200px]">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <CiSearch className="text-[rgb(99,115,129)]" />
            </div>
            <motion.input
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              variants={inputVariant}
              initial="close"
              // animate={focused ? "open" : "closed"}
              animate="open"
              onChange={(e) => handleQuerySearch(e.target.value)}
              type="text"
              id="simple-search"
              className="bg-transparent text-white border text-base placeholder:text-[rgb(99,115,129)] border-[rgba(145,158,171,0.32)] outline-none rounded-lg block lg:w-full pl-10 p-2 "
              placeholder="Search..."
            />
          </div>
          <div />
        </form>
        <div className="grid grid-cols-10">
          <div className="col-span-7">
            <img
              className="w-full"
              src={images[currentImageIndex]}
              alt="Slideshow"
            />
            <div className="slideshow-controls mt-4">
              <button
                className="hover:cursor-pointer mr-2"
                onClick={goToPreviousImage}
              >
                Previous
              </button>
              <button onClick={goToNextImage}>Next</button>
            </div>
          </div>
          <div className="col-span-3">
            <img src="./images/anh2.jpg" alt="" />
            <img src="./images/anh2.jpg" alt="" />
          </div>
        </div>
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
                  <h1 className="text-base font-semibold text-white">
                    {product?.name}
                  </h1>
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
                    <p className="text-base font-semibold text-white">
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
      </div>
      {/* <div className="lg:col-span-6 hidden lg:block mt-[88px] absolute -right-[40%] overflow-hidden h-full ">
          <div className="flex">
            <div className="w-[344px] relative flex flex-col">
              <img
                className="absolute img-hero-top"
                src="./images/home/hero_dark_1.png"
                alt=""
              />
              <img
                className="absolute img-hero-bot"
                src="./images/home/hero_dark_1.png"
                alt=""
              />
            </div>
            <div className="w-[720px] relative flex flex-col">
              <img
                className="absolute img-hero-top-r"
                src="./images/home/hero_dark_2.png"
                alt=""
              />
              <img
                className="absolute img-hero-bot-r"
                src="./images/home/hero_dark_2.png"
                alt=""
              />
            </div>
          </div>
        </div> */}
      {/* </div> */}
    </div>
  );
};

export default BackHome;

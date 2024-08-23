import React, {
  Fragment,
  ReactElement,
  SyntheticEvent,
  useEffect,
  useState,
} from "react";
import { CustomHeader } from "../../components/Header/CustomHeader";
import MainClient from "../../components/Layouts/MainClient";
import { BsCheck } from "react-icons/bs";
import { Menu, Transition } from "@headlessui/react";
import {
  MdOutlineAddShoppingCart,
  MdOutlineKeyboardArrowDown,
} from "react-icons/md";
import { BiMinus, BiPlus } from "react-icons/bi";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper";
import { useRouter } from "next/dist/client/router";
import {
  getDetailProduct,
  getProductCart,
  getRatingStarProd,
} from "../../services/product";
import { ListProduct, RatingStarProps } from "./../../interfaces/product.d";
import RatingStar from "../../components/Rating/RatingStar";
import RatingBar from "../../components/Rating/RatingBar";
import { TiStarFullOutline } from "react-icons/ti";
import { FaPencilAlt } from "react-icons/fa";
import Modal from "../../components/Modal";
import LetterAvatar from "../../components/LetterAvatar";
import { addToCart } from "./../../services/product/index";
import Review from "../../containers/Review";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import LoadingPage from "../../components/Loading/LoadingPage";
import toast from "react-hot-toast";
import LoadingBtn from "../../components/Loading/LoadingBtn";
import { useCountCart } from "../../hooks/useCountCart";
import { useCart } from "../../contexts/cart/CartContext";
import PaginationClient from "../../components/Pagination/PaginationClient";
const tabs = ["description", "review"];

const ProductDetail = ({ loading }: { loading: Boolean }) => {
  const [colorCheck, setColorCheck] = useState<string>("");
  const [sizeValue, setSizeValue] = useState<number>();
  const [quantity, setQuantity] = useState<number>(1);
  const [dataProduct, setDataProduct] = useState<ListProduct>();
  {
    console.log(dataProduct, "logkkaka");
  }

  const [selectTab, setSelectTab] = useState("description");
  const [offsetLeftLine, setOffsetLeftLine] = useState<string>("-9px");
  const [offsetWidthLine, setOffsetWidthLine] = useState<string>("76px");
  const [openWriteReview, setOpenWriteReview] = useState(false);
  const [ratingStar, setRatingStar] = useState<RatingStarProps[]>([]);
  const [averageStar, setAverageStar] = useState<number>();
  const [loadAddProd, setLoadAddProd] = useState(false);

  const router = useRouter();
  const token = Cookies.get("token");
  const { count, fetchCart } = useCart();

  console.log({ dataProduct });
  const fetchDetailProduct = async (id: string | string[]) => {
    try {
      const res = await getDetailProduct(String(id));
      setDataProduct(res.data.detail);
      setSizeValue(res.data.detail.size[0]);
      setColorCheck(res.data.detail.color[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchRating = async (id: string) => {
    try {
      const res = await getRatingStarProd(id);
      setRatingStar(res.data.rating);
      setAverageStar(res.data.average);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (token) {
      const decoded: any = jwt_decode(token);
      fetchCart(decoded.id);
    }
    if (router.query.product) {
      fetchDetailProduct(router.query.product);
    }
  }, []);

  const handleMinus = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    } else {
      setQuantity(1);
    }
  };

  const handleSelectTab = (e: any, tab: string) => {
    setOffsetLeftLine(String(Number(e.target.offsetLeft) - 33) + "px");
    setOffsetWidthLine(String(e.target.offsetWidth) + "px");
    setSelectTab(tab);
    fetchRating(String(router.query.product));
  };

  const handleAddToCart = async () => {
    setLoadAddProd(true);
    try {
      if (!token) {
        router.push("/sign-in");
      }
      if (token) {
        const decoded: any = jwt_decode(token);
        const productBuy = {
          idUser: String(decoded.id),
          id: dataProduct?.id,
          name: dataProduct?.name,
          size: sizeValue,
          price: dataProduct?.price,
          color: colorCheck,
          quantity: quantity,

          image: dataProduct?.listImage[0],
          warehouse: dataProduct?.quantity ?? 0,
        };
        console.log(productBuy, "productBuy");

        await addToCart(productBuy);
        await fetchCart(decoded.id);
        await Cookies.set("updateCart", Math.random().toString());
        toast.success("Đã thêm sản phẩm");
      }
    } catch (error) {
      console.log(error);
    }
    setLoadAddProd(false);
  };

  const onChangePage = (page: number) => {};

  const handleBuyNow = async () => {
    try {
      if (token) {
        const decoded: any = jwt_decode(token);
        const productBuy = {
          idUser: String(decoded.id),
          id: dataProduct?.id,
          name: dataProduct?.name,
          size: sizeValue,
          price: dataProduct?.price,
          color: colorCheck,
          quantity: quantity,
          image: dataProduct?.listImage[0],
          warehouse: dataProduct?.quantity ?? 0,
        };
        await addToCart(productBuy);
        fetchCart(decoded.id);
        router.push("/checkout");
      } else {
        const productBuy = {
          id: dataProduct?.id,
          name: dataProduct?.name,
          size: sizeValue,
          price: dataProduct?.price,
          color: colorCheck,
          quantity: quantity,
          image: dataProduct?.listImage[0],
        };
        sessionStorage.setItem("guest-prod", JSON.stringify([productBuy]));
        router.push("/checkout");
      }
    } catch (error) {
      console.log(error);
    }
  };

  console.log({
    wqeqw:
      loadAddProd &&
      dataProduct &&
      dataProduct?.quantity < 0 &&
      dataProduct?.quantity === 0 &&
      quantity > dataProduct?.quantity,
  });

  return (
    <>
      {loading && <LoadingPage />}
      <CustomHeader title="Chi tiết sản phẩm">
        <title>{dataProduct?.name} | Cuc Shoes</title>
      </CustomHeader>
      <section className="text-white pb-10">
        <div className="grid grid-cols-12">
          <div className="col-span-12 lg:col-span-7">
            <div className="h-full">
              <Swiper
                loop
                navigation
                modules={[Navigation, Thumbs]}
                grabCursor
                className="select-none product-images-slide rounded-xl"
              >
                {dataProduct &&
                  dataProduct.listImage.map((image, idx) => (
                    <SwiperSlide key={idx}>
                      <img src={image} alt="" />
                    </SwiperSlide>
                  ))}
              </Swiper>

              {/* <Swiper
                loop
                spaceBetween={10}
                slidesPerView={dataProduct?.listImage.length}
                modules={[Navigation, Thumbs]}
                className="select-none product-images-slide-thumbs max-w-sm mx-auto mt-6"
              >
                <div>
                  {dataProduct?.listImage.map((image, idx) => (
                    <SwiperSlide key={idx}>
                      <img
                        className="cursor-pointer rounded-xl object-cover"
                        src={image}
                        alt=""
                      />
                    </SwiperSlide>
                  ))}
                </div>
              </Swiper> */}
            </div>
          </div>
          <div className="px-0 lg:px-10 pt-8 col-span-12 lg:col-span-5 space-y-5">
            <div className="space-y-3">
              <h2 className="text-2xl font-bold">{dataProduct?.name}</h2>
              <p className="text-xl font-semibold">
                {dataProduct?.price.toLocaleString("vi")} đồng
              </p>
            </div>
            <div className="border-y border-dashed border-[rgba(145,158,171,0.24)]">
              <div className="my-6 space-y-6">
                <div className="flex items-center justify-between h-10">
                  <p className="text-base font-semibold">Color</p>
                  <div className="flex items-center space-x-2">
                    {dataProduct?.color.map((color, idx) => (
                      <div key={idx}>
                        <div
                          onClick={() => setColorCheck(color)}
                          className={`flex justify-center items-center rounded-full transition-all cursor-pointer ${
                            colorCheck.includes(color) ? "w-6 h-6" : "w-5 h-5"
                          }`}
                          style={
                            colorCheck.includes(color)
                              ? {
                                  boxShadow: `1px 2px 10px 0px ${color}`,
                                  backgroundColor: color,
                                }
                              : { backgroundColor: color }
                          }
                        >
                          {colorCheck.includes(color) ? (
                            <BsCheck
                              className={`${
                                color === "white" ? "text-black" : "text-white"
                              }`}
                            />
                          ) : (
                            <></>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between h-10">
                  <p className="text-base font-semibold">Size</p>
                  <Menu
                    as="div"
                    className="relative border border-[rgba(145,158,171,0.32)] hover:border-white rounded-lg"
                  >
                    <Menu.Button className="flex items-center justify-between font-bold px-0.5 py-2 space-x-8">
                      <p className="text-white ml-1 text-sm font-semibold">
                        {sizeValue}
                      </p>
                      <MdOutlineKeyboardArrowDown className="text-lg text-icon" />
                    </Menu.Button>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute left-0 p-2 z-10 mt-2 w-20 origin-top-left rounded-md bg-[rgb(33,43,54)] shadow-2xl focus:outline-none">
                        <div className="py-1">
                          {dataProduct?.size.map((option, idx) => (
                            <Menu.Item key={idx}>
                              {({ active }) => (
                                <p
                                  onClick={() => setSizeValue(option)}
                                  className={`cursor-pointer rounded-md block py-1.5 px-2 text-sm font-medium text-white ${
                                    active ? "bg-[rgba(145,158,171,0.10)]" : ""
                                  } ${
                                    sizeValue === option
                                      ? "bg-[rgba(145,158,171,0.16)]"
                                      : ""
                                  }`}
                                >
                                  {option}
                                </p>
                              )}
                            </Menu.Item>
                          ))}
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
                <div className="flex items-center justify-between h-10">
                  <p className="text-base font-semibold">Số lượng</p>
                  <div className="relative hover:border-white select-none flex items-center rounded-lg w-[78px] py-1 justify-around border border-[rgba(145,158,171,0.32)]">
                    <button>
                      <BiMinus onClick={handleMinus} />
                    </button>
                    {quantity}
                    <button>
                      {" "}
                      <BiPlus onClick={() => setQuantity(quantity + 1)} />
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between h-10">
                  <p className="text-base font-semibold">Số lượng trong kho</p>
                  <div className="relative hover:border-white select-none flex items-center rounded-lg w-[78px] py-1 justify-around">
                    {dataProduct?.quantity}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => {
                  !loadAddProd &&
                    dataProduct &&
                    dataProduct?.quantity > 0 &&
                    quantity <= dataProduct?.quantity &&
                    handleAddToCart();
                }}
                className={`
               ${
                 !loadAddProd &&
                 dataProduct &&
                 dataProduct?.quantity > 0 &&
                 quantity <= dataProduct?.quantity
                   ? " bg-[rgb(255,171,0)] hover:shadow-[0_15px_20px_-15px_rgb(255,171,0)] text-[rgb(33,43,54)]"
                   : "bg-slate-500 cursor-default"
               }
               
                  flex items-center space-x-1 px-5 py-3 text-base font-bold rounded-lg `}
              >
                {loadAddProd ? <LoadingBtn /> : <MdOutlineAddShoppingCart />}
                <p>Thêm vào giỏ hàng</p>
              </button>
              <button
                onClick={() => {
                  dataProduct &&
                    dataProduct?.quantity > 0 &&
                    quantity <= dataProduct?.quantity &&
                    handleBuyNow();
                }}
                className={`${
                  dataProduct &&
                  dataProduct?.quantity > 0 &&
                  quantity <= dataProduct?.quantity
                    ? " bg-green-500  hover:shadow-[0_15px_20px_-15px] hover:shadow-green-500 cursor-pointer"
                    : "bg-slate-500 cursor-default"
                } flex-1 px-5 py-3 text-base font-bold rounded-lg`}
              >
                <p>Mua ngay</p>
              </button>
            </div>
          </div>
        </div>
        <div className="bg-[rgb(33,43,54)] mt-20 rounded-xl overflow-hidden mb-5">
          <div className="bg-[rgba(145,158,171,0.16)] relative min-h-[48px] flex items-center space-x-8 px-6 text-sm font-semibold">
            {tabs.map((item, idx) => (
              <button
                key={idx}
                onClick={(e) => handleSelectTab(e, item)}
                className={`first-letter:uppercase ${
                  selectTab === item ? "" : "text-[rgb(145,158,171)]"
                }`}
              >
                {item}
              </button>
            ))}
            <hr
              className="absolute h-0.5 rounded-md bg-green-500 top-11 transition-all duration-300 border-none outline-none"
              style={{ left: offsetLeftLine, width: offsetWidthLine }}
            />
          </div>
          <div>
            {dataProduct && selectTab === "description" && (
              <div
                className="p-6"
                dangerouslySetInnerHTML={{ __html: dataProduct?.description }}
              />
            )}
            {dataProduct && selectTab === "review" && (
              <div>
                <div className="grid grid-cols-3 border-b border-[rgba(145,158,171,0.24)]">
                  <div className="col-span-3 lg:col-span-1 flex flex-col justify-center items-center space-y-2">
                    <p className="text-[rgb(145,158,171)] text-base font-semibold mt-5 lg:mt-0">
                      Đánh giá trung bình
                    </p>
                    <span className="text-3xl lg:text-[44px] font-extrabold">
                      {averageStar ? averageStar.toFixed(1) : 5}/5
                    </span>
                    <div className="text-2xl">
                      <RatingStar
                        star={averageStar ? Number(averageStar.toFixed(1)) : 5}
                      />
                    </div>
                    <span className="text-[rgb(145,158,171)] text-xs">
                      {dataProduct.review.length} đánh giá
                    </span>
                  </div>
                  <div className="col-span-3 lg:col-span-1 px-6 py-10 border-x border-[rgba(145,158,171,0.24)]">
                    {ratingStar.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center space-x-4 mt-3"
                      >
                        <p className="flex items-center font-semibold min-w-[30px]">
                          <span className="text-sm">{item?.star}</span>
                          <TiStarFullOutline className="text-yellow-500 ml-1" />
                        </p>
                        <RatingBar
                          percent={
                            (item?.total / dataProduct.review.length) * 100
                          }
                        />
                        <p className="text-sm text-[rgb(145,158,171)] min-w-[80px]">
                          {item?.total} đánh giá
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="col-span-3 lg:col-span-1 flex items-center justify-center">
                    <button
                      onClick={() => setOpenWriteReview(true)}
                      className="mb-8 flex items-center space-x-2 font-bold cursor-pointer border px-4 py-3 rounded-md border-[rgba(145,158,171,0.32)] hover:bg-[rgba(145,158,171,0.08)] hover:border-white"
                    >
                      <FaPencilAlt />
                      <p>Đánh giá của bạn</p>
                    </button>
                    <Modal
                      title="Thêm đánh giá"
                      open={openWriteReview}
                      setOpen={setOpenWriteReview}
                    >
                      <Review
                        fetchDetail={fetchDetailProduct}
                        fetchRating={fetchRating}
                        setOpen={setOpenWriteReview}
                      />
                    </Modal>
                  </div>
                </div>
                <div className="p-10">
                  {dataProduct.review.map((item, idx) => (
                    <div
                      className="flex flex-col lg:flex-row first:mt-0 mt-10 lg:space-x-5"
                      key={idx}
                    >
                      <div className="flex lg:flex-col items-center mb-4 lg:mb-0 space-x-4 lg:space-x-0 text-center">
                        <LetterAvatar
                          className="w-14 h-14"
                          name={item?.nameUser}
                        />
                        <p className="flex flex-col items-start lg:items-center lg:mt-4">
                          <span className="text-sm font-semibold">
                            {item?.nameUser}
                          </span>
                          <span className="text-xs text-[rgb(145,158,171)] font-normal mt-1">
                            {new Date(item?.createdAt).toDateString()}
                          </span>
                        </p>
                      </div>
                      <div>
                        <RatingStar className="text-lg" star={item?.rating} />
                        <span className="block text-base font-medium mt-2">
                          {item?.content}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <PaginationClient
          current={Number(router.query.page || 1)}
          pageSize={1}
          total={1}
          onChange={onChangePage}
        />
      </section>
    </>
  );
};

ProductDetail.getLayout = function getLayout(page: ReactElement) {
  return <MainClient>{page}</MainClient>;
};

export default ProductDetail;

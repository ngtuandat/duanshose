import React, {
    Dispatch,
    SetStateAction,
    useCallback,
    useEffect,
    useMemo,
    useState,
  } from "react";
  import { BsCheck } from "react-icons/bs";
  import { MdClose } from "react-icons/md";
  import { ImBin } from "react-icons/im";
  import { motion } from "framer-motion";
  import { useRouter } from "next/router";
  import { getFullCategory } from "../../services/category";
  
  const filterCheck = [
    {
      id: "gender",
      name: "Gender",
      options: [
        { value: "men", label: "Men" },
        { value: "women", label: "Women" },
        { value: "kids", label: "Kids" },
      ],
    },
  ];
  
  const filterColor = [
    "green",
    "black",
    "white",
    "pink",
    "red",
    "blue",
    "yellow",
    "lime",
  ];
  
  const menuFilter = {
    open: {
      x: 0,
      opacity: 1,
      transition: {
        deplay: 1,
        duration: 0.3,
      },
    },
    closed: {
      x: 300,
      opacity: 0,
      transition: {
        duration: 0.2,
      },
    },
  };
  
  const backFilter = {
    open: {},
    closed: {
      scale: 0,
    },
  };
  
  interface MenuFilterProp {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
  }
  
  const MenuFilter = ({ open, setOpen }: MenuFilterProp) => {
    const [valueCheck, setValueCheck] = useState<string[]>([]);
    const [dfCheck, setDfCheck] = useState("all");
    const [colorCheck, setColorCheck] = useState<string[]>([]);
    const [minPrice, setMinPrice] = useState<number>();
    const [maxPrice, setMaxPrice] = useState<number>();
    const [listCategory, setListCategory] = useState<any[]>();
  
    const router = useRouter();
    const handleCheckBox = (value: string) => {
      if (!valueCheck.includes(value)) {
        setValueCheck([...valueCheck, value]);
        const query = {
          ...router.query,
          gender: [...valueCheck, value].join("-"),
        };
        router.push({ pathname: "/product", query }, undefined, {
          shallow: true,
        });
      } else {
        const res = valueCheck.filter((item) => item !== value);
        setValueCheck(res);
        const query = { ...router.query, gender: res.join("-") };
        router.push({ pathname: "/product", query }, undefined, {
          shallow: true,
        });
      }
    };
  
    const handleColorCheck = (color: string) => {
      if (!colorCheck.includes(color)) {
        setColorCheck([...colorCheck, color]);
        const query = {
          ...router.query,
          color: [...colorCheck, color].join("-"),
        };
        router.push({ pathname: "/product", query }, undefined, {
          shallow: true,
        });
      } else {
        const res = colorCheck.filter((item) => item !== color);
        setColorCheck(res);
        const query = { ...router.query, color: res.join("-") };
        router.push({ pathname: "/product", query }, undefined, {
          shallow: true,
        });
      }
    };
    const handleClose = () => {
      setOpen(false);
    };
  
    const handleCheckCategory = (value: string) => {
      setDfCheck(value);
      const query = { ...router.query, category: value };
  
      router.push({ pathname: "/product", query }, undefined, {
        shallow: true,
      });
    };
  
    const handleMinPrice = (value: number) => {
      setMinPrice(value);
      const query = { ...router.query, min: value };
  
      router.push({ pathname: "/product", query }, undefined, {
        shallow: true,
      });
    };
  
    const handleMaxPrice = (value: number) => {
      setMaxPrice(value);
      const query = { ...router.query, max: value };
  
      router.push({ pathname: "/product", query }, undefined, {
        shallow: true,
      });
    };
  
    const handleClearFilter = () => {
      setValueCheck([]);
      setColorCheck([]);
      setDfCheck("all");
      setMinPrice(Number(""));
      setMaxPrice(Number(""));
      const query = {
        page: router.query.page,
        sort: router.query.sort,
        query: router.query.query,
      };
      router.push({ pathname: "/product", query }, undefined, {
        shallow: true,
      });
    };
    const filterRadio = useMemo(() => {
      if (!listCategory) return [];
      const options = [
        { value: "all", label: "All" },
        ...listCategory.map((item) => ({
          value: String(item.name).toLowerCase(),
          label: item.name,
        })),
      ];
  
      return [
        {
          id: "category",
          name: "Category",
          options,
        },
      ];
    }, [listCategory]);
    const handleGetCategory = async () => {
      const res = await getFullCategory();
      setListCategory(res.data);
    };
  
    useEffect(() => {
      handleGetCategory();
    }, []);
    // const filterRadio = [
    //   {
    //     id: "category",
    //     name: "Category",
    //     options: [
    //       { value: "all", label: "All" },
    //       { value: "shoes", label: "Shoes" },
    //       { value: "accessories", label: "Accessories" },
    //     ],
    //   },
    // ];
    console.log({ filterRadio });
    return (
      <div>
        <motion.div
          onClick={handleClose}
          initial="open"
          animate={open ? "open" : "closed"}
          // animate="open"
          variants={backFilter}
          // className={`fixed inset-0 `}
        />
        <motion.div
          initial="open"
          animate={open ? "open" : "closed"}
          // animate="open"
          variants={menuFilter}
          className="fixed z-[2500] bg-product shadow-xl w-64 top-0 bottom-0 right-0"
        >
          <div className="flex items-center justify-between p-4 pr-2 border-b border-b-[rgba(145,158,171,0.24)] ">
            <h1 className="text-base font-semibold">Filters</h1>
  
            <div
              onClick={() => setOpen(false)}
              className="hover:bg-[rgba(145,158,171,0.1)] cursor-pointer p-2 rounded-full flex justify-center items-center"
            >
              <MdClose className="opacity-75" />
            </div>
          </div>
          <div className="p-5 space-y-6">
            {filterCheck.map((section) => (
              <div key={section?.id}>
                <span className="text-base font-semibold block mb-3">
                  {section?.name}
                </span>
                <div className="space-y-3">
                  {section?.options?.map((option, optionIdx) => (
                    <label
                      key={option?.value}
                      htmlFor={`filter-mobile-${section?.id}-${optionIdx}`}
                      className="select-none flex relative group items-center space-x-2 text-white text-sm font-normal cursor-pointer"
                    >
                      <input
                        id={`filter-mobile-${section?.id}-${optionIdx}`}
                        name={`${section?.id}[]`}
                        onChange={() => handleCheckBox(option?.value)}
                        defaultValue={option?.value}
                        type="checkbox"
                        className={`w-5 h-5 appearance-none transition-all border-2 group-hover:border-green-400 border-gray-500 rounded-md cursor-pointer ${
                          valueCheck.includes(option?.value)
                            ? "bg-green-500 border-none"
                            : ""
                        }`}
                      />
                      <BsCheck
                        className={`absolute text-[rgb(33,43,54)] transition-all -left-1.5 text-base  ${
                          valueCheck.includes(option?.value)
                            ? "text-opacity-100"
                            : "text-opacity-0"
                        }`}
                      />
  
                      <span> {option?.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
  
            {filterRadio.map((section) => (
              <div key={section?.id}>
                <span className="text-base font-semibold block mb-3">
                  {section?.name}
                </span>
                <div className="space-y-3">
                  {section?.options.map((option, optionIdx) => (
                    <label
                      key={option?.value}
                      htmlFor={`filter-mobile-${section?.id}-${optionIdx}`}
                      className="select-none flex relative group items-center space-x-2 text-white text-sm font-normal cursor-pointer"
                    >
                      <input
                        id={`filter-mobile-${section?.id}-${optionIdx}`}
                        name={`${section?.id}[]`}
                        defaultValue={option?.value}
                        onChange={() => handleCheckCategory(option?.value)}
                        type="radio"
                        className={`w-5 h-5 transition-all appearance-none border-2 group-hover:border-green-400 border-gray-500 rounded-full cursor-pointer ${
                          dfCheck === option?.value ? "border-green-500" : ""
                        }`}
                      />
                      <div
                        className={`absolute w-3 h-3 transition-all rounded-full -left-1 ${
                          dfCheck === option?.value ? "bg-green-500" : ""
                        }`}
                      ></div>
  
                      <span> {option?.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
  
            <div>
              <span className="text-base font-semibold block mb-3">Color</span>
              <div className="grid grid-cols-4 gap-y-3 w-4/6">
                {filterColor.map((color, idx) => (
                  <div key={idx}>
                    <div
                      onClick={() => handleColorCheck(color)}
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
  
            <div>
              <span className="text-base font-semibold block mb-3">Price</span>
              <div className="space-y-4">
                <div className="flex space-x-3 items-center">
                  <span className="text-[rgb(99,115,129)] text-base font-bold">
                    Min (đ)
                  </span>
                  <input
                    type="number"
                    className="bg-[rgba(145,158,171,0.12)] p-0.5 pl-1 text-opacity-80 rounded-md outline-none border-none w-1/2"
                    placeholder="0"
                    value={minPrice}
                    onChange={(e) => handleMinPrice(e.target.valueAsNumber)}
                  />
                </div>
                <div className="flex space-x-2 items-center">
                  <span className="text-[rgb(99,115,129)] text-base font-bold">
                    Max (đ)
                  </span>
                  <input
                    type="number"
                    className="bg-[rgba(145,158,171,0.12)] p-0.5 pl-1 text-opacity-80 rounded-md outline-none border-none w-1/2"
                    placeholder="9999..."
                    value={maxPrice}
                    onChange={(e) => handleMaxPrice(e.target.valueAsNumber)}
                  />
                </div>
              </div>
            </div>
          </div>
  
          <div className="absolute bottom-0 right-0 left-0 w-full p-5">
            <div
              onClick={handleClearFilter}
              className="flex justify-center py-3 px-5 border border-[rgba(145,158,171,0.24)] space-x-1 cursor-pointer select-none rounded-lg items-center"
            >
              <ImBin />
              <p>Clear</p>
            </div>
          </div>
        </motion.div>
      </div>
    );
  };
  
  export default MenuFilter;
  
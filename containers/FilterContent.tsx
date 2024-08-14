import React, { Fragment, useState } from "react";
import { BiFilter } from "react-icons/bi";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import { motion } from "framer-motion";
import { Menu, Transition } from "@headlessui/react";
import MenuFilter from "../components/MenuSidebar/MenuFilter";
import { SortOption } from "../interfaces/product";
import { useRouter } from "next/router";

const inputVariant = {
  open: {
    width: "270px",
    transition: {
      duration: 0.4,
    },
  },
  closed: {},
};

const sortOptions = [
  { name: "Mới nhất", value: "desc-date" },
  { name: "Giá: Cao-Thấp", value: "desc-price" },
  { name: "Giá: Thấp-Cao", value: "asc-price" },
];

const FilterContent = () => {
  const router = useRouter();
  const [focused, setFocused] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [sortValue, setSortValue] = useState("desc-date");
  const [sortOption, setSortOption] = useState("Mới nhất");
  const [searchValue, setSearchValue] = useState(router.query.query ?? "");

  const handleSort = (option: SortOption) => {
    setSortOption(option?.name);
    setSortValue(option?.value);
    const query = { ...router.query, sort: option?.value };

    router.push({ pathname: "/product", query }, undefined, {
      shallow: true,
    });
  };

  const handleQuerySearch = (value: string) => {
    setSearchValue(value);
    const query = { ...router.query, query: value };

    router.push({ pathname: "/product", query }, undefined, {
      shallow: true,
    });
  };

  return (
    <div className="mb-4 lg:mb-10 flex flex-col lg:flex-row lg:items-center lg:justify-between lg:space-y-0 space-y-3 lg:mt-10">
      <div className="flex justify-between">
        <form className="flex items-center text-xl">
          <label htmlFor="simple-search" className="sr-only">
            Search
          </label>
          <div className="relative lg:w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <CiSearch className="text-[rgb(99,115,129)]" />
            </div>
            <motion.input
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              variants={inputVariant}
              initial="close"
              value={searchValue}
              animate={focused ? "open" : "closed"}
              onChange={(e) => handleQuerySearch(e.target.value)}
              type="text"
              id="simple-search"
              className="bg-transparent border text-base placeholder:text-[rgb(99,115,129)] border-[rgba(145,158,171,0.32)] outline-none rounded-lg block lg:w-full pl-10 p-2 "
              placeholder="Search..."
            />
          </div>
          <div />
        </form>
      </div>
      <div className="flex items-center space-x-1 lg:mr-64 xl:mr-40 2xl:mr-24">
        <button
          onClick={() => setOpenFilter(true)}
          className="flex items-center font-bold space-x-1 px-2 py-1.5 rounded-md hover:bg-[rgba(145,158,171,0.08)]"
        >
          <p className="text-sm">Filter</p>
          <BiFilter className="text-xl" />
        </button>
        <MenuFilter open={openFilter} setOpen={setOpenFilter} />
        <div>
          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center font-bold space-x-1 px-2 py-1.5 rounded-md hover:bg-[rgba(145,158,171,0.08)]">
              <span className="text-sm flex items-center">
                Sort By:
                <p className="text-[rgb(145,158,171)] ml-1 text-sm font-semibold">
                  {sortOption}
                </p>
              </span>
              <MdOutlineKeyboardArrowDown className="text-xl" />
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
              <Menu.Items className="absolute left-0 p-2 z-10 mt-2 w-36 origin-top-left rounded-md bg-[rgb(33,43,54)] shadow-2xl focus:outline-none">
                <div className="py-1">
                  {sortOptions.map((option, idx) => (
                    <Menu.Item key={idx}>
                      {({ active }) => (
                        <p
                          onClick={() => handleSort(option)}
                          className={`cursor-pointer rounded-md block py-1.5 px-2 text-sm font-medium text-white ${
                            active ? "bg-[rgba(145,158,171,0.10)]" : ""
                          } ${
                            sortValue === option?.value
                              ? "bg-[rgba(145,158,171,0.16)]"
                              : ""
                          }`}
                        >
                          {option?.name}
                        </p>
                      )}
                    </Menu.Item>
                  ))}
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </div>
  );
};

export default FilterContent;

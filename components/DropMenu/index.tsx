import React, { Dispatch, Fragment, SetStateAction } from "react";
import { Menu, Transition } from "@headlessui/react";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";

interface DropValueProps {
  listMenu: string[] | number[];
  selectValue: any;
  setSelectValue: any;
  classNameMenu?: string;
  classNameTitle?: string;
  title?: string;
  classDrop?:string
}
const DropMenu = ({
  listMenu,
  selectValue,
  setSelectValue,
  classNameMenu,
  classNameTitle,
  classDrop,
  title,
}: DropValueProps) => {
  return (
    <Menu
      as="div"
      className="relative border border-[rgba(145,158,171,0.32)] hover:border-white rounded-lg"
    >
      {title && (
        <p
          className={`absolute px-1 text-[rgb(99,115,129)] -top-2 left-3 bg-[rgb(33,43,54)] cursor-text ${classNameTitle}`}
        >
          {title}
        </p>
      )}
      <Menu.Button
        className={`flex items-center font-bold p-0.5 justify-between px-1 w-full ${classNameMenu}`}
      >
        <p className="text-white ml-1 text-sm font-semibold">{selectValue}</p>
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
        <Menu.Items
          id="drop-scroll"
          className={`absolute overflow-y-hidden transition-all duration-200 hover:overflow-y-auto left-0 p-2 z-[2900] mt-2 w-full origin-top-left rounded-md bg-[rgb(26,34,43)] shadow-2xl focus:outline-none ${classDrop}`}
        >
          <div className="py-1">
            {listMenu.map((option, idx) => (
              <Menu.Item key={idx}>
                {({ active }) => (
                  <p
                    onClick={() => setSelectValue(option)}
                    className={`cursor-pointer rounded-md block px-1.5 py-0.5 text-sm font-medium text-white ${
                      active ? "bg-[rgba(145,158,171,0.10)]" : ""
                    } ${
                      selectValue === option
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
  );
};

export default DropMenu;

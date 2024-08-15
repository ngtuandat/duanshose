import React from "react";
import { motion } from "framer-motion";
import { BsFillSunFill } from "react-icons/bs";
import { FaCloudMoon } from "react-icons/fa";
import { IoContrastSharp, IoContrastOutline } from "react-icons/io5";
import {
  BsLayoutTextSidebarReverse,
  BsLayoutTextSidebar,
} from "react-icons/bs";
import { CgSidebar, CgSidebarRight } from "react-icons/cg";

const menuList = [
  {
    title: "Mode",
    icons: [<BsFillSunFill />, <FaCloudMoon />],
  },
  {
    title: "Contrast",
    icons: [<IoContrastOutline />, <IoContrastSharp />],
  },
  {
    title: "Direction",
    icons: [<CgSidebarRight />, <CgSidebar />],
  },
  {
    title: "Layout",
    icons: [<BsLayoutTextSidebar />, <BsLayoutTextSidebarReverse />],
  },
];

const ulVariant = {
  open: {
    transition: { staggerChildren: 0.07, delayChildren: 0.1 },
  },
  closed: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
};

const liVariant = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      y: { stiffness: 1000, velocity: -100 },
    },
  },
  closed: {
    y: 50,
    opacity: 0,
    transition: {
      y: { stiffness: 1000 },
    },
  },
};
const MenuList = () => {
  return (
    <motion.ul variants={ulVariant} className="p-5 list-none space-y-5">
      {menuList.map((item, index) => (
        <motion.li variants={liVariant} key={index} className="space-y-3">
          <h2 className="text-xs font-semibold text-[rgb(145,158,171)]">
            {item?.title}
          </h2>
          <motion.div className=" grid grid-cols-2 gap-2">
            {item.icons.map((icon, index) => (
              <div key={index} className="text-3xl">
                <button className="text-2xl w-full col-span-1 border hover:bg-[rgb(99,115,129)] hover:bg-opacity-5 border-[rgba(145,158,171,0.12)] outline-none text-[rgb(99,115,129)] rounded-lg flex items-center justify-center h-20">
                  {icon}
                </button>
              </div>
            ))}
          </motion.div>
        </motion.li>
      ))}
    </motion.ul>
  );
};

export default MenuList;

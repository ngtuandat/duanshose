import React from "react";
import { motion } from "framer-motion";
import { IoReload } from "react-icons/io5";
import { MdClose } from "react-icons/md";
import MenuList from "./MenuList";
import { BsFullscreen } from "react-icons/bs";

const sidebar = {
  open: (height = 800) => ({
    clipPath: `circle(${height * 2 + 200}px at 83% 93%)`,
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.2,
      type: "spring",
      stiffness: 20,
      restDelta: 2,
    },
  }),
  closed: {
    clipPath: "circle(30px at 83% 93%)",
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
      delay: 0.2,
      type: "spring",
      stiffness: 400,
      damping: 40,
    },
  },
};

const buttonIcon = {
  open: {
    x: 60,
    opacity: 0,
    transition: {
      duration: 0.5,
    },
  },
  closed: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.001,
    },
  },
};

const buttonFullScreen = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      delay: 0.3,
    },
  },
  closed: {
    y: 60,
    opacity: 0,
    transition: {
      delay: 0.2,
      duration: 0.4,
    },
  },
};

const navMenu = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      deplay: 1,
      duration: 0.5,
    },
  },
  closed: {
    y: -60,
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

const MenuFixed = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  
  return (
      <>
        <motion.div
          onClick={() => setIsOpen(false)}
          initial="close"
          animate={isOpen ? "open" : "closed"}
          variants={backFilter}
          className={`fixed inset-0`}
        />
      <motion.nav initial={false} animate={isOpen ? "open" : "closed"}>
        <motion.div
          variants={sidebar}
          className="fixed h-screen w-72 bottom-0 right-0 z-[8000] bg-[rgba(22,28,36,0.8)] backdrop-blur-sm  rounded-lg shadow-2xl flex"
        >
          <div className="w-full flex flex-col justify-between">
            <motion.div
              initial="close"
              animate={isOpen ? "open" : "closed"}
              variants={navMenu}
              className="flex justify-between items-center py-4 pl-5 pr-2 border-b border-dashed border-[rgba(255,255,255,0.3)]"
            >
              <p className="text-white font-semibold">Settings</p>
              <div className="flex space-x-1 items-center text-[rgb(145,158,171)]">
                <div className="flex items-center justify-center p-2 cursor-pointer hover:bg-[rgba(145,158,171,0.08)] rounded-full">
                  <IoReload className="w-4 h-4" />
                </div>
                <div
                  onClick={() => setIsOpen(!isOpen)}
                  className="flex items-center justify-center p-2 cursor-pointer hover:bg-[rgba(145,158,171,0.08)] rounded-full"
                >
                  <MdClose className="w-[18px] h-[18px]" />
                </div>
              </div>
            </motion.div>
            <div className="flex-1">
              <MenuList />
            </div>
            <motion.button
              initial="close"
              animate={isOpen ? "open" : "closed"}
              variants={buttonFullScreen}
              className="w-full px-5 pb-5"
            >
              <div className="text-sm font-semibold w-full col-span-1 border hover:bg-[rgb(99,115,129)] hover:bg-opacity-5 border-[rgba(145,158,171,0.12)] outline-none text-[rgb(99,115,129)] rounded-lg flex items-center justify-center space-x-3 h-12">
                <p>Fullscrren</p>
                <BsFullscreen className="-mb-[1px]" />
              </div>
            </motion.button>
          </div>
          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            initial="close"
            animate={isOpen ? "open" : "closed"}
            variants={buttonIcon}
            className={`absolute select-none outline-none bottom-[22px] right-[21px] flex justify-center items-center rounded-full w-14 h-14 cursor-pointer  ${
              isOpen ? "" : "shadow-sm shadow-black transition-all delay-700"
            }`}
          >
            <img src="/images/home/ic_setting.svg" className="p-30" />
          </motion.button>
        </motion.div>
      </motion.nav>
      </>
  );
};

export default MenuFixed;

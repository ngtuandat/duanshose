import React, { useEffect, useState } from "react";
import { ChildrenProps } from "../../interfaces/main";
import HeaderAdmin from "../Header/HeaderAdmin";
import NavAdmin from "../NavBar/NavAdmin";
import { motion } from "framer-motion";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import MenuFixed from "./../MenuSidebar/MenuFixed";
import { IoMenuOutline } from "react-icons/io5";

const menuNav = {
  open: {
    width: "90px",
    transition: {
      duration: 0.3,
    },
  },
  closed: {
    width: "280px",
    transition: {
      duration: 0.3,
    },
  },
};
const menuHeader = {
  open: {
    x: 0,
    opacity: 1,
    transition: {
      deplay: 1,
      duration: 0.3,
    },
  },
  closed: {
    x: -260,
    opacity: 1,
    transition: {
      duration: 0.2,
    },
  },
};

const backHeader = {
  open: {},
  closed: {
    scale: 0,
  },
};

const MainAdmin = ({ children }: ChildrenProps) => {
  const [zoomOutMenu, setZoomOutMenu] = useState(false);
  const [headerChange, setHeaderChange] = useState("h-[88px]");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 10) {
        setHeaderChange(
          "h-[60px] bg-[rgba(22,28,36,0.8)] backdrop-blur-[5px] shadow-xl"
        );
      } else {
        setHeaderChange("h-[88px]");
      }
    });
  });

  useEffect(() => {
    if (!open) {
      document.body.style.overflow = "unset";
    } else {
      document.body.style.overflow = "hidden";
    }
  }, [open]);

  return (
    <div className="bg-[rgb(22,28,36)]">
      <div>
        <div className="block min-[1200px]:hidden">
          <header
            className={`z-[9999] max-w-[1200px] mx-auto px-2 min-[1200px]:hidden fixed left-auto right-0 top-0 transition-all duration-300 w-full flex items-center justify-between ${headerChange}`}
          >
            <div onClick={() => setOpen(true)} className="cursor-pointer">
              <IoMenuOutline className="text-[rgb(145,158,171)] text-xl " />
            </div>
            <HeaderAdmin />
          </header>
          <div>
            <motion.div
              onClick={() => setOpen(false)}
              initial="close"
              animate={open ? "open" : "closed"}
              variants={backHeader}
              className={`fixed inset-0 h-screen w-screen`}
            />
            <motion.div
              initial="closed"
              animate={open ? "open" : "closed"}
              variants={menuHeader}
              className="h-screen fixed z-[10000] bg-product shadow-xl w-64 top-0 bottom-0 left-0"
            >
              <NavAdmin setOpen={setOpen} />
            </motion.div>
          </div>
        </div>
        <header
          className={`hidden min-[1200px]:block px-10 fixed left-auto right-0 top-0 transition-all duration-300 ${
            zoomOutMenu ? "widthZoomOut" : "widthZoomOutOff"
          } top-0 w-full z-[1400] ${headerChange}`}
        >
          <HeaderAdmin />
        </header>
        <div className="flex overflow-y-auto">
          <motion.nav
            initial="closed"
            animate={zoomOutMenu ? "open" : "closed"}
            variants={menuNav}
            className="hidden min-[1200px]:block relative border-r shrink-0 border-dashed border-[rgba(145,158,171,0.24)]"
          >
            <button
              onClick={() => setZoomOutMenu(!zoomOutMenu)}
              className={`fixed top-7 ${
                zoomOutMenu ? "left-[76px]" : "left-[266px]"
              } border border-dashed rounded-full border-[rgba(145,158,171,0.24)] transition-all duration-300 hover:border-[rgba(145,158,171,0.5)] text-[rgb(145,158,171)] p-1 z-[2400] bg-[rgb(22,28,36)] hover:text-white`}
            >
              {zoomOutMenu ? <MdKeyboardArrowRight /> : <MdKeyboardArrowLeft />}
            </button>
            <NavAdmin zoomOutMenu={zoomOutMenu} />
          </motion.nav>
          <main
            className={`min-[1200px]:px-6 px-2 pt-24 flex-1 min-h-screen overflow-x-hidden ${
              zoomOutMenu ? "max-w-[1356px]" : "max-w-[1200px]"
            } mx-auto pb-10 transition-all`}
          >
            {children}
          </main>
        </div>
      </div>

      <MenuFixed />
    </div>
  );
};

export default MainAdmin;

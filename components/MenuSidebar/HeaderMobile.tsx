import React, { Dispatch, SetStateAction } from "react";
import { motion } from "framer-motion";
import NavClientMb from "./../NavBar/NavClientMb";

interface HeaderMobileProps {
  open: Boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  name: string | undefined;
  avatar: string | undefined;
}
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
    x: 300,
    opacity: 0,
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

const HeaderMobile = ({ open, setOpen, name, avatar }: HeaderMobileProps) => {
  return (
    <>
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
        className="h-screen fixed bg-product shadow-xl w-64 top-0 bottom-0 right-0"
      >
        <NavClientMb setOpen={setOpen} name={name} avatar={avatar} />
      </motion.div>
    </>
  );
};

export default HeaderMobile;

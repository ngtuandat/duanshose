import React from "react";
import { ChildrenProps } from "../../interfaces/main";
import MenuFixed from "../MenuSidebar/MenuFixed";
import Link from "next/link";

const Sign = ({ children }: ChildrenProps) => {
  return (
    <>
      <div className="bg-[rgb(22,28,36)] h-screen">
        <header className="fixed flex justify-start items-center px-10 h-20 top-0 right-0 left-0">
          <Link href="/">
            <img src="/images/logo.svg" className="h-10 w-10" alt="" />
          </Link>
        </header>
        <div className="h-full bg-sign-dark flex justify-center items-center">
          {children}
        </div>
      </div>
      <MenuFixed />
    </>
  );
};

export default Sign;

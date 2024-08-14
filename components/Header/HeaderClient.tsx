import Image from "next/image";
import React, { useEffect, useState } from "react";
import { motion, useScroll } from "framer-motion";
import NoSign from "../CheckSign/NoSign";
import NavClient from "./../NavBar/NavClient";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import Logged from "../CheckSign/Logged";
import Link from "next/link";
import { getProfile } from "../../services/user";
import { IoMenuOutline } from "react-icons/io5";
import HeaderMobile from "../MenuSidebar/HeaderMobile";
import { useProfile } from "../../hooks/useProfile";

const HeaderClient = () => {
  const { scrollYProgress } = useScroll();
  const [headerChange, setHeaderChange] = useState("h-[88px]");
  const [openHeader, setOpenHeader] = useState(false);

  const token = Cookies.get("token");
  const isUpdate = Cookies.get("updateProfile");

  const { avatar, fetchProfile, name } = useProfile();

  useEffect(() => {
    if (!openHeader) {
      document.body.style.overflow = "unset";
    } else {
      document.body.style.overflow = "hidden";
    }
  }, [openHeader]);

  useEffect(() => {
    if (token) {
      const decoded: any = jwt_decode(token);
      fetchProfile(decoded.email);
    }
  }, [token, isUpdate]);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 10) {
        setHeaderChange(
          "h-[56px] lg:h-[72px] bg-[rgba(22,28,36,0.8)] backdrop-blur-[5px] shadow-xl"
        );
      } else {
        setHeaderChange("h-[72px] lg:h-[88px]");
      }
    });
  });

  return (
    <div
      className={`fixed top-0 right-0 left-0 ${
        openHeader ? "z-[3000]" : "z-[1400]"
      } transition-all duration-500 ${headerChange}`}
    >
      <div
        className={`h-full flex items-center justify-between max-w-lg sm:max-w-2xl md:max-w-3xl lg:max-w-[1200px] mx-auto px-2`}
      >
        <Link href="/">
          <Image src="/images/logo.svg" alt="logo" width={40} height={40} />
        </Link>
        <div className="hidden lg:flex items-center space-x-5">
          <NavClient />
          {name ? <Logged name={name} avatar={avatar} /> : <NoSign />}
        </div>
        <div
          className="lg:hidden cursor-pointer"
          onClick={() => setOpenHeader(true)}
        >
          <IoMenuOutline className="text-[rgb(145,158,171)] text-xl " />
        </div>
      </div>
      <HeaderMobile
        name={name}
        avatar={avatar}
        open={openHeader}
        setOpen={setOpenHeader}
      />
      <motion.div
        className="progress-bar rounded-r-lg"
        style={{ scaleX: scrollYProgress }}
      />
    </div>
  );
};

export default HeaderClient;

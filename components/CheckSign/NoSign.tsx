import Link from "next/link";
import { useRouter } from "next/router";
import React, { ReactElement } from "react";

const NoSign = () => {
  const router = useRouter();
  return (
    <div className="flex space-x-2 items-center">
      <Link href="/sign-in">
        <button className="text-white text-sm font-semibold bg-[rgb(0,171,85)] hover:bg-[rgb(0,123,85)] px-3 py-[10px] rounded-lg">
          Đăng nhập
        </button>
      </Link>
      <Link href="sign-up">
        <button className="text-white text-sm font-semibold border-2 hover:bg-[rgb(0,171,85)] hover:bg-opacity-10 border-[rgb(0,171,85)] px-3 py-2 rounded-lg">
          Đăng ký
        </button>
      </Link>
    </div>
  );
};

export default NoSign;

import Head from "next/head";
import React, { ReactNode } from "react";

export const CustomHeader = ({
  children,
  title,
}: {
  children?: ReactNode;
  title?: string;
}): JSX.Element => {
  return (
    <div>
      {title ? (
        <div className="text-lg lg:text-2xl font-bold mb-4 lg:mb-10 text-white">
          {title}
        </div>
      ) : null}
      <Head>{children}</Head>
    </div>
  );
};

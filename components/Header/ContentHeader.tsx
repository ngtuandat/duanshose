import React from "react";
import { CustomHeader } from "./CustomHeader";

interface ContentHeaderProps {
  title: string;
  name: string;
}
const ContentHeader = ({ title, name }: ContentHeaderProps) => {
  return (
    <>
      <CustomHeader>
        <title>{title} | FitFusionZone</title>
      </CustomHeader>
      <div>
        <h1 className="text-xl mb-6 font-bold text-white mt-1">{name}</h1>
      </div>
    </>
  );
};

export default ContentHeader;

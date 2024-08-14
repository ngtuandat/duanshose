import React from "react";
import LoadingBtn from "../Loading/LoadingBtn";

export interface ButtonProps {
  /**
   * Button contents
   */
  label?: string;
  /**
   * Optional click handler
   */
  onClick?: () => void;
  /**
   * Custom class name
   */
  className?: string;
  /**
   * Set the loading status of button
   */
  loading?: boolean;
  /**
   * html submit form
   */
  submit?: boolean;
  variant?: "primary" | "outline";
}

const Button = ({
  label,
  loading = false,
  className,
  submit,
  onClick,
  variant = "primary",
}: ButtonProps): JSX.Element => {
  return (
    <button
      type={submit ? "submit" : "button"}
      onClick={onClick}
      className={`flex items-center justify-center space-x-2 ${
        loading && "pointer-events-none"
      } ${className}
      ${
        variant === "primary"
          ? "bg-green-600 hover:bg-green-700 text-white"
          : "text-white  bg-[rgba(145,158,171,0.44)] hover:bg-[rgba(145,158,171,0.6)]"
      }
      px-4 py-2 rounded-md font-semibold 
      `}
    >
      {loading && <LoadingBtn />}
      <p>{label}</p>
    </button>
  );
};

export default Button;

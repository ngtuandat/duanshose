import React from "react";

interface RadioProps {
  listRadio: {
    id: string;
    name?: string;
    options: {
      value: string;
      label: string;
    }[];
  }[];
  dfCheck: string;
  setDfCheck: React.Dispatch<React.SetStateAction<string>>;
  classNameList: string;
}
const Radio = ({
  listRadio,
  dfCheck,
  setDfCheck,
  classNameList,
}: RadioProps) => {
  return (
    <>
      {listRadio.map((section) => (
        <div key={section?.id}>
          {section?.name && (
            <span className="text-sm font-semibold text-[rgb(145,158,171)] block mb-3">
              {section?.name}
            </span>
          )}
          <div className={`${classNameList}`}>
            {section?.options.map((option, optionIdx) => (
              <label
                key={option?.value}
                htmlFor={`filter-mobile-${section?.id}-${optionIdx}`}
                className="select-none flex relative group items-center space-x-2 text-white text-sm font-normal cursor-pointer"
              >
                <input
                  id={`filter-mobile-${section?.id}-${optionIdx}`}
                  name={`${section?.id}[]`}
                  defaultValue={dfCheck}
                  onChange={() => setDfCheck(option?.value)}
                  type="radio"
                  className={`w-5 h-5 transition-all appearance-none border-2 group-hover:border-green-400 border-gray-500 rounded-full cursor-pointer ${
                    dfCheck === option?.value ? "border-green-500" : ""
                  }`}
                />
                <div
                  className={`absolute w-3 h-3 transition-all rounded-full -left-1 ${
                    dfCheck === option?.value ? "bg-green-500" : ""
                  }`}
                ></div>

                <span> {option?.label}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
    </>
  );
};

export default Radio;

import { Fragment, useEffect, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { IoIosArrowDown } from "react-icons/io";
import { IoCheckmark } from "react-icons/io5";

interface DropDownProps {
  listData: { title: string; value: string }[];
  defaultValue: string;
  onChange?: (item: { title: string; value: string }, id: string) => void;
  itemId: string;
}

export default function DropDown({
  listData,
  defaultValue,
  itemId,
  onChange,
}: DropDownProps) {
  const [selected, setSelected] = useState<
    { title: string; value: string } | undefined
  >();

  useEffect(() => {
    const defaultItem = listData.find((item) => item.value === defaultValue);
    setSelected(defaultItem || listData[0]);
  }, [listData, defaultValue]);

  const handleChange = (value: { title: string; value: string }) => {
    setSelected(value);
    if (onChange && itemId) {
      onChange(value, itemId);
    }
  };

  return (
    <div className="w-30">
      <Listbox value={selected} onChange={handleChange}>
        <div className="relative mt-1">
          <Listbox.Button className="relative w-full cursor-default rounded-xl py-2 pl-3 pr-10 text-left border border-white/20 focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
            <span className="block truncate">{selected?.title}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <IoIosArrowDown />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="z-50 w-fit p-0 absolute mt-1 max-h-60 overflow-auto rounded-xl bg-[#2A3943] py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
              {listData.map((person, personIdx) => (
                <Listbox.Option
                  key={personIdx}
                  className={({ active }) =>
                    `relative cursor-default select-none list-none py-2 px-4 text-white rounded-lg ${
                      active ? "bg-white/10" : ""
                    }`
                  }
                  value={person}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "font-medium text-primary" : "font-normal"
                        }`}
                      >
                        {person.title}
                      </span>
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}

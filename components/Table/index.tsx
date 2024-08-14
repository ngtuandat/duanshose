import React, { ReactNode } from "react";

interface TableProps {
  /**
   * Data record array to be displayed
   */
  dataSource: (ReactNode | string)[][];
  /**
   * Columns of table
   */
  columns: (ReactNode | string)[];
  /**
   * The loading state of the table
   */
  loading?: boolean;
  className?: string;
}

const Table = ({ dataSource, columns, loading, className }: TableProps) => {
  console.log({ dataSource });
  return (
    <div>
      <div className={`flex flex-col ${className}`}>
        <div className="-my-2 -mx-4 sm:-mx-6 lg:-mx-8">
          <div
            id="table-scroll"
            className="inline-block w-[94%] overflow-x-auto py-2 align-middle md:mx-6 lg:mx-8"
          >
            <div className="shadow ring-1 ring-black ring-opacity-5 md:rounded-lg overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-[rgb(51,61,72)]">
                  <tr>
                    {columns.map((column, index) => (
                      <th
                        key={index}
                        scope="col"
                        className={`py-3.5 pl-4 pr-3 w-fit text-left text-sm font-semibold ${
                          String(column).includes("Tên")
                            ? "text-white"
                            : "text-[rgb(145,158,171)]"
                        }`}
                      >
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className=" bg-[rgb(33,43,54)]">
                  {dataSource.map((row, index) => (
                    <tr key={index}>
                      {row.map((item, idx) => (
                        <td
                          className={`whitespace-nowrap min-w-[105px] w-fit px-3 py-4 text-sm bg-[rgb(33,43,54)] text-white ${
                            idx === 1 ? "font-semibold" : ""
                          }`}
                          key={idx}
                        >
                          <div className="flex space-x-1">{item}</div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Table;

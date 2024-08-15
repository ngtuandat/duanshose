import { Fragment, ReactNode } from "react";
interface TableProps {
  /**
   * Data record array to be displayed
   */
  dataSource: any;
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
const locations = [
  {
    name: "Edinburgh",
    people: [
      {
        name: "Lindsay Walton",
        title: "Front-end Developer",
        email: "lindsay.walton@example.com",
        role: "Member",
      },
      {
        name: "Courtney Henry",
        title: "Designer",
        email: "courtney.henry@example.com",
        role: "Admin",
      },
    ],
  },
];

export default function TableGroup({
  dataSource,
  columns,
  loading,
  className,
}: TableProps) {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
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
              <tbody className="bg-[rgb(51,61,72)]">
                {dataSource.map((data: any, t: number) => (
                  <Fragment key={t}>
                    <tr className="">
                      <th
                        colSpan={columns.length}
                        scope="colgroup"
                        className="bg-[rgb(76,91,108)] py-2 pl-4 pr-3 text-left text-sm font-normal text-white sm:pl-3"
                      >
                        {data.item}
                      </th>
                    </tr>
                    {data.children.map((row: any, index: number) => (
                      <tr key={index}>
                        {row.map((item: any, idx: number) => (
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
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

import {
  Dispatch,
  Fragment,
  ReactElement,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import DropMenu from "./../DropMenu/index";

interface PaginationProps {
  /**
   * Current page number
   */
  current: number;
  /**
   * Number of data items per page
   */
  pageSize: number;
  /**
   * Total number of data items
   */
  total: number;
  /**
   * On change page handler
   */
  onChange: (page: number) => void;
  /**
   * The class name of the container of the pagination
   */
  className?: string;
  setLimitValue: Dispatch<SetStateAction<number>>;
}

const Pagination = ({
  total,
  current = 1,
  pageSize,
  onChange,
  className,
  setLimitValue,
}: PaginationProps) => {
  const [currentPage, setCurrentPage] = useState(current);
  const [selectValue, setSelectValue] = useState<number>(pageSize);
  const totalPage = Math.ceil(total / pageSize);

  const listLimit = [5, 10, 15, 20];
  const onChangePage = (page: number) => {
    setCurrentPage(page);
    onChange && onChange(page);
  };

  const prevPage = () => {
    currentPage !== 1 && onChangePage(currentPage - 1);
  };

  const nextPage = () => {
    currentPage !== totalPage && onChangePage(currentPage + 1);
  };

  let startPage = currentPage - 2;
  let endPage = currentPage + 2;

  if (startPage <= 0) {
    endPage -= startPage - 1;
    startPage = 1;
  }

  if (endPage > totalPage) {
    endPage = totalPage;
  }

  useEffect(() => {
    setCurrentPage(current);
  }, [current]);

  useEffect(() => {
    setLimitValue(selectValue);
  }, [selectValue]);

  return (
    <div className="flex items-center justify-between border-t border-[rgba(145,158,171,0.24)] pl-6">
      <div className="flex items-center text-white text-sm space-x-1">
        <p>Số hàng mỗi trang:</p>
        <DropMenu
          listMenu={listLimit}
          selectValue={selectValue}
          setSelectValue={setSelectValue}
        />
      </div>
      <div
        className={`bg-transparent px-4 py-3 flex items-center justify-between sm:px-6 ${
          className ? className : ""
        }`}
      >
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={prevPage}
            className="pg-paginate-prev-btn relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-transparent hover:bg-gray-50"
          >
            Previous
          </button>
          <button
            onClick={nextPage}
            className="pg-paginate-next-btn ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-transparent hover:bg-gray-50"
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center space-x-2">
          <div>
            <p className="text-sm text-white">
              Hiển thị{" "}
              <span className="pg-paginate-current-page font-medium">
                {(currentPage - 1) * pageSize + 1}
              </span>{" "}
              -{" "}
              <span className="pg-paginate-total-page font-medium">
                {Math.min(currentPage * pageSize, total)}
              </span>{" "}
              trong{" "}
              <span className="pg-paginate-total-records font-medium">
                {total}
              </span>{" "}
              kết quả
            </p>
          </div>
          <div>
            <nav
              className="pg-paginate-pc relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
              aria-label="Pagination"
            >
              <button>
                <div
                  onClick={prevPage}
                  className={`${
                    current === startPage
                      ? "text-[rgba(145,158,171,0.8)] cursor-default"
                      : "hover:bg-[rgba(145,158,171,0.08)] text-white"
                  } p-2 rounded-full flex justify-center items-center`}
                >
                  <IoIosArrowBack className=" mr-0.5" />
                </div>
              </button>

              {startPage > 1 && (
                <Fragment>
                  <Page
                    current={currentPage}
                    page={1}
                    onChangePage={onChangePage}
                  />
                  {startPage > 2 && <PageBreak />}
                </Fragment>
              )}
              {Array.from({ length: endPage - startPage + 1 }).map(
                (item, idx) => (
                  <Page
                    key={idx}
                    page={idx + startPage}
                    current={currentPage}
                    onChangePage={onChangePage}
                  />
                )
              )}
              {endPage < totalPage && (
                <Fragment>
                  {endPage < totalPage - 1 && <PageBreak />}
                  <Page
                    current={currentPage}
                    page={totalPage}
                    onChangePage={onChangePage}
                  />
                </Fragment>
              )}
              {/* Current: "z-10 bg-indigo-50 border-indigo-500 text-indigo-600", Default: "bg-transparent border-gray-300 text-gray-500 hover:bg-gray-50" */}
              <button>
                <div
                  onClick={nextPage}
                  className={`${
                    current === endPage
                      ? "text-[rgba(145,158,171,0.8)] cursor-default"
                      : "hover:bg-[rgba(145,158,171,0.08)] text-white"
                  } p-2 rounded-full flex justify-center items-center`}
                >
                  <IoIosArrowForward className="ml-0.5" />
                </div>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

const Page = ({
  current,
  page,
  onChangePage,
}: {
  current: number;
  page: number;
  onChangePage: (page: number) => void;
}) => {
  console.log({ current, page });
  return current === page ? (
    <button
      aria-current="page"
      className={`pg-page-item pg-page-item-${page} z-10 relative inline-flex items-center px-4 py-2 text-green-500 text-sm font-medium`}
    >
      {page}
    </button>
  ) : (
    <button
      onClick={() => onChangePage(page)}
      className={`pg-page-item pg-page-item-${page} bg-transparent text-white relative inline-flex items-center px-4 py-2  text-sm font-medium`}
    >
      {page}
    </button>
  );
};

const PageBreak = () => (
  <span className="pg-paginate-page-break relative inline-flex items-center px-4 py-2  bg-transparent text-sm font-medium text-gray-700">
    ...
  </span>
);

export default Pagination;

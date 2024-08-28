import { useSearchParams } from "react-router-dom";
import CustomPaginationNumbers from "./CustomPaginationNumbers";
import { PAGE_SIZE } from "../utils/constants";
import { useSelector } from "react-redux";

export default function CustomPagination({
  pageSize,
  className,
  count,
  param = "page"
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const lastPage = Math.ceil(count / (pageSize || PAGE_SIZE));
  const currentPage = searchParams.get(param) || 1;
  const lang = useSelector((state) => state.language.lang);

  const atStart = currentPage <= 1;
  const atEnd = currentPage >= lastPage;

  function handlePrev(event) {
    event.preventDefault();
    !atStart &&
      setSearchParams((prev) => ({ ...prev, [param]: currentPage - 1 }));
  }

  function handleNext(event) {
    event.preventDefault();
    !atEnd &&
      setSearchParams((prev) => ({ ...prev, [param]: +currentPage + 1 }));
  }

  function handleFirstPage(event) {
    event.preventDefault();
    setSearchParams((prev) => ({ ...prev, [param]: 1 }));
  }

  function handleLastPage(event) {
    event.preventDefault();
    setSearchParams((prev) => ({ ...prev, [param]: lastPage }));
  }

  return (
    <div className={`pagination_component mt-4 ${className} `}>
      <div
        className={`paginator_btns d-flex align-items-center gap-1 ${
          lang === "en" ? "rotate" : ""
        }`}
      >
        <button onClick={handleFirstPage} className={atStart ? "disabled" : ""}>
          <i className="fa-regular fa-angles-right"></i>
        </button>
        <button onClick={handlePrev} className={atStart ? "disabled" : ""}>
          <i className="fa-regular fa-angle-right"></i>
        </button>
      </div>
      <CustomPaginationNumbers
        currentPage={currentPage}
        lastPage={lastPage}
        param={param}
        setSearchParams={setSearchParams}
      />

      <div
        className={`paginator_btns d-flex align-items-center gap-1 ${
          lang === "en" ? "rotate" : ""
        }`}
      >
        <button onClick={handleNext} className={atEnd ? "disabled" : ""}>
          <i className="fa-regular fa-angle-left"></i>
        </button>
        <button onClick={handleLastPage} className={atEnd ? "disabled" : ""}>
          <i className="fa-regular fa-angles-left"></i>
        </button>
      </div>
    </div>
  );
}

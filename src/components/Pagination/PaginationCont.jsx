import React from "react";
import ReactPaginate from "react-paginate";

const PaginationCont = ({ pagination, goBack, buttonPagination, goNext }) => {
  const handlePageChange = ({ selected }) => {
    buttonPagination(selected + 1);
  };
  const totalPages = 500;
  const showNextButton = pagination < totalPages;
  const showPrevButton = pagination > 1;

  return (
    <ReactPaginate
      onPageChange={handlePageChange}
      breakLabel={<span className="px-1">...</span>}
      nextLabel={
        showNextButton ? (
          <i
            onClick={goNext}
            className="flex items-center justify-center w-10 h-10 rounded-lg 420:w-8 420:h-8 bg-verde-principal-700 ri-arrow-right-s-line"
          />
        ) : null
      }
      pageRangeDisplayed={4}
      pageLinkClassName="768:text-sm "
      pageCount={totalPages}
      previousLabel={
        showPrevButton ? (
          <i
            onClick={goBack}
            className="flex items-center justify-center w-10 h-10 rounded-lg 420:w-8 420:h-8 bg-verde-principal-700 ri-arrow-left-s-line"
          />
        ) : null
      }
      renderOnZeroPageCount={null}
      containerClassName="flex items-center justify-center gap-2 768:gap-0  pt-10"
      pageClassName="block border border-solid border-gray-500 hover:bg-gray-200 hover:border-gray-200 768:hover:bg-verde-principal-300 w-10 h-10 768:w-8 768:h-8 flex items-center 768:border-none justify-center rounded-lg 768:rounded-none "
      activeClassName="bg-verde-principal-300"
    />
  );
};

export default PaginationCont;

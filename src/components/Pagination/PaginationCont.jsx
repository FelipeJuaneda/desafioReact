import React from "react";
import ReactPaginate from "react-paginate";

const PaginationCont = ({ pagination, goBack, buttonPagination, goNext }) => {
  const handlePageChange = ({ selected }) => {
    buttonPagination(selected + 1);
  };
  const totalPages = 500;
  const showNextButton = pagination < totalPages - 1;
  const showPrevButton = pagination > 1;

  return (
    <ReactPaginate
      onPageChange={handlePageChange}
      breakLabel={<span>...</span>}
      nextLabel={
        showNextButton ? (
          <i
            onClick={goNext}
            className="flex items-center justify-center w-10 h-10 rounded-lg bg-verde-principal-400 ri-arrow-right-s-line"
          />
        ) : null
      }
      pageRangeDisplayed={5}
      pageCount={totalPages}
      previousLabel={
        showPrevButton ? (
          <i
            onClick={goBack}
            className="flex items-center justify-center w-10 h-10 mr-4 rounded-lg bg-verde-principal-400 ri-arrow-left-s-line"
          />
        ) : null
      }
      renderOnZeroPageCount={null}
      containerClassName="flex items-center justify-center gap-2 pt-10"
      pageClassName="block border border-solid border-gray-500 hover:bg-gray-200 hover:border-gray-200 w-10 h-10 flex items-center justify-center rounded-lg "
      activeClassName="bg-verde-principal-200"
    />
  );
};

export default PaginationCont;

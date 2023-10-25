import { useState } from "react";

export const usePagination = () => {
  const [currentPage, setCurrenPage] = useState(1);
  const goBack = () => {
    setCurrenPage(currentPage - 1);
  };
  const buttonPagination = (element) => {
    setCurrenPage(element);
  };
  const goNext = () => {
    setCurrenPage(currentPage + 1);
  };

  return { currentPage, goBack, buttonPagination, goNext };
};

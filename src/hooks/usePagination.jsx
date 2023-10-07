import { useState } from "react";

export const usePagination = () => {
  const [pagination, setPagination] = useState(1);
  const goBack = () => {
    setPagination(pagination - 1);
  };
  const buttonPagination = (element) => {
    setPagination(element);
  };
  const goNext = () => {
    setPagination(pagination + 1);
  };

  return { pagination, goBack, buttonPagination, goNext };
};

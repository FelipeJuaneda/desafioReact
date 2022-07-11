import React from "react";
import { useAppContext } from "../contexts/AppContext";

const PaginationCont = () => {
  const { setPagination, pagination, setMoviesStarts } = useAppContext();

  const scroToTop = () => {
    window.scrollTo({
      top: 630,
      behavior: "smooth",
    });
  };

  return (
    <div className="mt-5">
      <nav aria-label="Page navigation example">
        <ul className="pagination justify-content-center">
          <li className={pagination === 1 ? "page-item disabled" : "page-item"}>
            <button
              className="page-link"
              onClick={() => setPagination(pagination - 1)}
            >
              Anterior
            </button>
          </li>
          <li className="page-item">
            <button
              className="page-link"
              onClick={() => {
                setPagination(1);
                scroToTop();
                setMoviesStarts(undefined);
              }}
            >
              1
            </button>
          </li>
          <li className="page-item">
            <button
              className="page-link"
              onClick={() => {
                setPagination(2);
                scroToTop();
                setMoviesStarts(undefined);
              }}
            >
              2
            </button>
          </li>
          <li className="page-item">
            <button
              className="page-link"
              onClick={() => {
                setPagination(3);
                scroToTop();
                setMoviesStarts(undefined);
              }}
            >
              3
            </button>
          </li>
          <li className="page-item">
            <button
              className="page-link"
              onClick={() => {
                setPagination(pagination + 1);
                scroToTop();
                setMoviesStarts(undefined);
              }}
            >
              Siguiente
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default PaginationCont;

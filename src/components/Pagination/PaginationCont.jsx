import React from "react";
import { useAppContext } from "../contexts/AppContext";
import { scroller } from "react-scroll";

const PaginationCont = () => {
  const { setPagination, pagination, setStartsList } = useAppContext();

  const valueElement = "popularElement";

  return (
    <div>
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
                scroller.scrollTo(valueElement);
                setStartsList(undefined);
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
                scroller.scrollTo(valueElement);
                setStartsList(undefined);
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
                scroller.scrollTo(valueElement);
                setStartsList(undefined);
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
                scroller.scrollTo(valueElement);
                setStartsList(undefined);
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

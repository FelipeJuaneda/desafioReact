import React from "react";
import { useAppContext } from "../../contexts/AppContext";
import { scroller } from "react-scroll";

const PaginationCont = () => {
  const { setPagination, pagination, setStartsList } = useAppContext();

  const valueElement = "popularElement";
  const buttonsPagination = [{ number: 1 }, { number: 2 }, { number: 3 }];
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
          {buttonsPagination.map((element) => {
            return (
              <li key={element.number} className="page-item">
                <button
                  className="page-link"
                  onClick={() => {
                    setPagination(element.number);
                    scroller.scrollTo(valueElement);
                    setStartsList(undefined);
                  }}
                >
                  {element.number}
                </button>
              </li>
            );
          })}
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

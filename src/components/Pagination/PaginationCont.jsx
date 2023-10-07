import React from "react";

const PaginationCont = ({ pagination, goBack, buttonPagination, goNext }) => {
  const buttonsPagination = [{ number: 1 }, { number: 2 }, { number: 3 }];
  return (
    <div>
      <nav aria-label="Page navigation example">
        <ul className="pagination justify-content-center">
          <li className={pagination === 1 ? "page-item disabled" : "page-item"}>
            <button className="page-link" onClick={goBack}>
              Anterior
            </button>
          </li>
          {buttonsPagination.map((element) => {
            return (
              <li key={element.number} className="page-item">
                <button
                  className="page-link"
                  onClick={() => {
                    buttonPagination(element.number);
                  }}
                >
                  {element.number}
                </button>
              </li>
            );
          })}
          <li className="page-item">
            <button className="page-link" onClick={goNext}>
              Siguiente
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default PaginationCont;

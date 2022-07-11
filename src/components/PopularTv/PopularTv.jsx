import React from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import StartCalification from "../StartCalification/StartCalification";
import StartItems from "../StartCalification/StartItems";
import "./PopularTv.css";
const PopularTv = () => {
  const { tvPopularList } = useAppContext();
  return (
    <div className="text-center">
      <div>
        <div className="navbar navbar-light bg-light">
          <div className="container-fluid justify-content-evenly pt-5 pb-5">
            {/* componente de estrellas */}
            <StartCalification />
            <form onSubmit={""} className="d-flex">
              <input
                onChange={(e) => {}}
                className="form-control me-2"
                type="search"
                placeholder="Buscar"
                aria-label="Search"
              />
              <button className="btn btn-outline-success" type="submit">
                Buscar
              </button>
            </form>
          </div>
        </div>
        {/* aca se imprimen las peliculas filtradas por estrellas */}
        <StartItems />
      </div>
      <span className="text-uppercase fs-2 font-monospace text-center">Popular Tv Shows</span>
      <div className="popularTvCont">
        {tvPopularList ? (
          tvPopularList.map((el) => {
            return (
              <div key={el.id} className="card " style={{ width: "18rem" }}>
                <img
                  src={
                    el.poster_path === null
                      ? "https://www.orbis.com.ar/wp-content/themes/barberry/images/placeholder.jpg"
                      : "https://image.tmdb.org/t/p/w500/" + el.poster_path
                  }
                  className="card-img-top"
                  alt="poster de peliculas populares"
                />
                <div className="card-body">
                  <h4 className="card-title fs-5">{el.name}</h4>

                  <Link to={`/film/${el.id}`} className="btn btn-success">
                    + Info
                  </Link>
                </div>
              </div>
            );
          })
        ) : (
          <p>Cargando...</p>
        )}
      </div>
    </div>
  );
};

export default PopularTv;

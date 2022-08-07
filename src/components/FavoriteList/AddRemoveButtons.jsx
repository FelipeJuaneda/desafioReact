import React from "react";
import { useFavoriteContext } from "../contexts/FavoriteContext";
import toast, { Toaster } from "react-hot-toast";

const AddRemoveButtons = ({ film }) => {
  const { favoritemovie, addMovieToFavorite, removeMovieToFavorite } =
    useFavoriteContext();

  //Si la pelicula se encuentra agregada
  const ifMovieIsIn = favoritemovie.find((e) => e.id === film.id);
  //devuevle true o false depende si esta la pelicula agregada o no
  const favoritemovieDisabled = ifMovieIsIn ? true : false;
  //si la peli esta agregada devuelve text-red sino nada
  const changeColorFav = ifMovieIsIn ? "text-red-600" : "";
  
  return (
    <div className="flex gap-3 pt-3 pb-3">
      <button
        className="text-xl text-black rounded-full bg-slate-400 btn"
        disabled={favoritemovieDisabled}
        onClick={() => {
          addMovieToFavorite(film);
          toast(
            (t) => (
              <span className="text-xs text-center text-white ">
                Pelicula agregada!
              </span>
            ),
            {
              duration: 2100,
              position: "top-center",

              // Styling
              style: {
                background: "#198754",
                letterSpacing: "2px",
              },
              // Custom Icon
              icon: "❤️",

              // Aria
              ariaProps: {
                role: "status",
                "aria-live": "polite",
              },
            }
          );
        }}
      >
        <i className={`ri-heart-fill ${changeColorFav}`} />
      </button>
      <Toaster />
      <button
        className="text-xl text-black rounded-full bg-slate-400 btn"
        onClick={() => removeMovieToFavorite(film.id)}
      >
        <i className="ri-dislike-fill" />
      </button>
    </div>
  );
};

export default AddRemoveButtons;

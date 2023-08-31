import React from "react";
import { useFavoriteContext } from "../../contexts/FavoriteContext";
import toast, { Toaster } from "react-hot-toast";

const AddRemoveButtonsTv = ({ tvShowState }) => {
  const { favoritetv, addTvToTvList, removeTvToTvList } = useFavoriteContext();

  //Si la serie se encuentra agregada
  const ifMovieIsIn = favoritetv.find((e) => e.id === tvShowState.id);
  //devuevle true o false depende si esta la serie agregada o no
  const favoriteTvDisabled = ifMovieIsIn ? true : false;
  //si la serie esta agregada devuelve text-red sino nada
  const changeColorFav = ifMovieIsIn ? "text-red-600" : "";
  return (
    <div className="flex gap-3 pt-3 pb-3">
      <button
        className="text-xl text-black rounded-full bg-slate-400 btn"
        disabled={favoriteTvDisabled}
        onClick={() => {
          addTvToTvList(tvShowState);
          toast(
            (t) => (
              <span className="text-xs text-center text-white ">
                Serie agregada!
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
        onClick={() => removeTvToTvList(tvShowState.id)}
      >
        <i className="ri-dislike-fill" />
      </button>
    </div>
  );
};

export default AddRemoveButtonsTv;

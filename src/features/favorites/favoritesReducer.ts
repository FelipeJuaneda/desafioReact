import type { MovieDetail, TvDetail } from "@/types/tmdb";

export interface FavoriteState {
  favoritemovie: MovieDetail[];
  favoritetv: TvDetail[];
}

export type FavoriteAction =
  | { type: "ADD_MOVIE_TO_FAVORITEMOVIE"; payload: MovieDetail }
  | { type: "REMOVE_MOVIE_TO_FAVORITEMOVIE"; payload: number }
  | { type: "REMOVE_ALL_MOVIES_IN_FAVORITEMOVIE" }
  | { type: "ADD_TV_TO_TVLIST"; payload: TvDetail }
  | { type: "REMOVE_TV_TO_TVLIST"; payload: number }
  | { type: "REMOVE_ALL_TV_IN_TVLIST" };

const favReducer = (state: FavoriteState, action: FavoriteAction): FavoriteState => {
  switch (action.type) {
    case "ADD_MOVIE_TO_FAVORITEMOVIE":
      return {
        ...state,
        favoritemovie: [action.payload, ...state.favoritemovie],
      };

    case "REMOVE_MOVIE_TO_FAVORITEMOVIE":
      return {
        ...state,
        favoritemovie: state.favoritemovie.filter((movie) => movie.id !== action.payload),
      };
    case "REMOVE_ALL_MOVIES_IN_FAVORITEMOVIE":
      return {
        ...state,
        favoritemovie: [],
      };

    case "ADD_TV_TO_TVLIST":
      return {
        ...state,
        favoritetv: [action.payload, ...state.favoritetv],
      };
    case "REMOVE_TV_TO_TVLIST":
      return {
        ...state,
        favoritetv: state.favoritetv.filter((tv) => tv.id !== action.payload),
      };
    case "REMOVE_ALL_TV_IN_TVLIST":
      return {
        ...state,
        favoritetv: [],
      };
    default:
      return state;
  }
};

export default favReducer;

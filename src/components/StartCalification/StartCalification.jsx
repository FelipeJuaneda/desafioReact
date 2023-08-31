import { useState } from "react";
import { FaStar } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { useAppContext } from "../../contexts/AppContext";

const colors = {
  green: "#198754",
  grey: "#a9a9a9",
};

function StartCalification() {
  const { moviesList, setStartsList, tvPopularList } = useAppContext();
  //currentValue es el numero de estrellas seleccionadas
  const [currentValue, setCurrentValue] = useState(0);
  const [hoverValue, setHoverValue] = useState(undefined);
  //creo un array de sinco elementos, rellenados con 0
  const stars = Array(5).fill(0);

  //aca se guarda la ruta donde estas parado
  const location = useLocation();

  //funcion filtrador por estrella
  const startClick = (value) => {
    setCurrentValue(value);
    let updateList =
      location.pathname === "/popularFilms" ? moviesList : tvPopularList;
    const minRating = (value - 1) * 2;
    const maxRating = minRating + 2;
    const filteredList = updateList.filter(
      (item) => item.vote_average > minRating && item.vote_average <= maxRating
    );
    setStartsList(filteredList);
  };

  const handleMouseOver = (newHoverValue) => {
    setHoverValue(newHoverValue);
  };

  const handleMouseLeave = () => {
    setHoverValue(undefined);
  };

  return (
    <div style={styles.container}>
      <div style={styles.stars}>
        {stars.map((_, index) => {
          return (
            <FaStar
              key={index}
              size={24}
              onClick={() => startClick(index + 1)}
              onMouseOver={() => handleMouseOver(index + 1)}
              onMouseLeave={handleMouseLeave}
              color={
                (hoverValue || currentValue) > index
                  ? colors.green
                  : colors.grey
              }
              style={{
                marginRight: 10,
                cursor: "pointer",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingBottom: "10px",
  },
  stars: {
    display: "flex",
    flexDirection: "row",
  },
};

export default StartCalification;

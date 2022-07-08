import { useState } from "react";
import { FaStar } from "react-icons/fa";
import { useAppContext } from "../contexts/AppContext";

const colors = {
  green: "#198754",
  grey: "#a9a9a9",
};

function StartCalification() {
  //currentValue es el numero de estrellas seleccionadas
  const [currentValue, setCurrentValue] = useState(0);
  const [hoverValue, setHoverValue] = useState(undefined);
  //creo un array de sinco elementos, rellenados con 0
  const stars = Array(5).fill(0);
  const { moviesList, setMoviesStarts } = useAppContext();

  //funcion filtrador por estrella
  const startClick = (value) => {
    setCurrentValue(value);
    let updateList = moviesList;
    if (value === 1) {
      updateList = updateList.filter((item) => item.vote_average <= 2);
    } else if (value === 2) {
      updateList = updateList.filter(
        (item) => item.vote_average > 2 && item.vote_average < 4
      );
    } else if (value === 3) {
      updateList = updateList.filter(
        (item) => item.vote_average > 4 && item.vote_average < 6
      );
    } else if (value === 4) {
      updateList = updateList.filter(
        (item) => item.vote_average > 6 && item.vote_average < 8
      );
    } else if (value === 5) {
      updateList = updateList.filter(
        (item) => item.vote_average > 8 && item.vote_average < 10
      );
    }
    setMoviesStarts(updateList);
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
  },
  stars: {
    display: "flex",
    flexDirection: "row",
  },
};

export default StartCalification;

import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { useAppContext } from "../contexts/AppContext";

const colors = {
  orange: "#FFBA5A",
  grey: "#a9a9a9",
};

function StartCalification() {
  //currentValue es el numero de estrellas seleccionadas
  const [currentValue, setCurrentValue] = useState(0);
  const [hoverValue, setHoverValue] = useState(undefined);
  const stars = Array(5).fill(0);
  const { moviesList, setMoviesList, getFilms } = useAppContext();

  const handleClick = (value) => {
    setCurrentValue(value);
    if (value === 1) {
      setMoviesList(moviesList.filter((e) => e.vote_average <= 2));
      console.log(moviesList.filter((e) => e.vote_average <= 2));
    } else if (value === 2) {
      setMoviesList(moviesList.filter((e) => e.vote_average <= 4 > 2));
      console.log(moviesList.filter((e) => e.vote_average <= 4 > 2));
    }
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
              onClick={() => handleClick(index + 1)}
              onMouseOver={() => handleMouseOver(index + 1)}
              onMouseLeave={handleMouseLeave}
              color={
                (hoverValue || currentValue) > index
                  ? colors.orange
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

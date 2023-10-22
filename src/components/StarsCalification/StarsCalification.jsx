import React, { useState } from "react";

const StartCalification = ({ data, setFilteredData, setHasFilter }) => {
  const [currentValue, setCurrentValue] = useState(0);
  const [hoverValue, setHoverValue] = useState(undefined);

  const handleStarClick = (value) => {
    if (value === currentValue) {
      setCurrentValue(0);
      setFilteredData([]);
      setHasFilter(false);
      return;
    }
    setCurrentValue(value);
    const minRating = (value - 1) * 2;
    const maxRating = minRating + 2;
    const filteredList = data.filter(
      (item) => item.vote_average > minRating && item.vote_average <= maxRating
    );
    setFilteredData(filteredList);
  };

  const handleStarHover = (newHoverValue) => {
    setHoverValue(newHoverValue);
  };

  const handleStarLeave = () => {
    setHoverValue(undefined);
  };

  return (
    <div style={styles.container}>
      <div style={styles.stars}>
        {[1, 2, 3, 4, 5].map((value) => (
          <i
            className={`text-2xl ri-star-fill mr-2 cursor-pointer ${
              (hoverValue || currentValue) >= value
                ? "text-verde-principal-700"
                : "text-gray-500"
            }`}
            key={value}
            onClick={() => handleStarClick(value)}
            onMouseOver={() => handleStarHover(value)}
            onMouseLeave={handleStarLeave}
          />
        ))}
      </div>
    </div>
  );
};

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

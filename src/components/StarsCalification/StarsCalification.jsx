import React, { useEffect, useState } from "react";

const StarsCalification = ({ data, setFilteredData, setHasFilter }) => {
  const [currentValue, setCurrentValue] = useState(0);
  const [hoverValue, setHoverValue] = useState(undefined);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const isMobileDevice = window.matchMedia("(max-width: 768px)").matches;
    setIsMobile(isMobileDevice);
  }, []);

  const handleStarClick = (value) => {
    if (value === currentValue) {
      clearFilters();
      return;
    }
    setCurrentValue(value);
    const [minRating, maxRating] = calculateRatingRange(value);
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

  const clearFilters = () => {
    setCurrentValue(0);
    setFilteredData([]);
    setHasFilter(false);
  };

  const calculateRatingRange = (value) => {
    const minRating = (value - 1) * 2;
    const maxRating = minRating + 2;
    return [minRating, maxRating];
  };

  return (
    <div style={styles.container}>
      <div style={styles.stars}>
        {[1, 2, 3, 4, 5].map((value) => (
          <i
            className={`text-2xl ri-star-fill mr-2 cursor-pointer 768:text-xl ${
              (hoverValue || currentValue) >= value
                ? "text-verde-principal-700"
                : "text-gray-500"
            }`}
            key={value}
            onClick={() => handleStarClick(value)}
            onMouseOver={() => (isMobile ? null : handleStarHover(value))}
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
  },
  stars: {
    display: "flex",
    flexDirection: "row",
  },
};

export default StarsCalification;

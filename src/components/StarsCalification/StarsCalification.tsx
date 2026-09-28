import { useEffect, useState, type CSSProperties } from "react";

interface Rated {
  vote_average: number;
}

interface StarsCalificationProps<T extends Rated> {
  data: T[];
  setFilteredData: (list: T[]) => void;
  setHasFilter: (hasFilter: boolean) => void;
}

const StarsCalification = <T extends Rated>({
  data,
  setFilteredData,
  setHasFilter,
}: StarsCalificationProps<T>) => {
  const [currentValue, setCurrentValue] = useState(0);
  const [hoverValue, setHoverValue] = useState<number | undefined>(undefined);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const isMobileDevice = window.matchMedia("(max-width: 768px)").matches;
    setIsMobile(isMobileDevice);
  }, []);

  const handleStarClick = (value: number) => {
    if (value === currentValue) {
      clearFilters();
      return;
    }
    setCurrentValue(value);
    const [minRating, maxRating] = calculateRatingRange(value);
    const filteredList = data.filter(
      (item) => item.vote_average > minRating && item.vote_average <= maxRating,
    );
    setFilteredData(filteredList);
  };

  const handleStarHover = (newHoverValue: number) => {
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

  const calculateRatingRange = (value: number): [number, number] => {
    const minRating = (value - 1) * 2;
    const maxRating = minRating + 2;
    return [minRating, maxRating];
  };

  return (
    <div style={styles.container}>
      <div style={styles.stars}>
        {[1, 2, 3, 4, 5].map((value) => (
          <i
            className={`ri-star-fill mr-2 cursor-pointer text-2xl 768:text-xl ${
              (hoverValue || currentValue) >= value ? "text-verde-principal-700" : "text-gray-500"
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

const styles: Record<"container" | "stars", CSSProperties> = {
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

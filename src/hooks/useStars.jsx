import { useState } from "react";

const useStarts = () => {
  const [starsList, setStarsList] = useState([]);
  return {
    setStarsList,
    starsList,
  };
};

export default useStarts;

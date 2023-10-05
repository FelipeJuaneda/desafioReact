import { useState } from "react";

const useStarts = () => {
  //estado donde se guarda las peliculas filtradas por estrellas (se seteo en StartCalification.jsx)
  const [startsList, setStartsList] = useState([]);

  return {
    setStartsList,
    startsList,
  };
};

export default useStarts;

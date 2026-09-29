import { useEffect, useState } from "react";

/** Returns `value` once it has stopped changing for `delay` ms. */
export const useDebouncedValue = <T>(value: T, delay = 300) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(timer);
  }, [value, delay]);
  return debounced;
};

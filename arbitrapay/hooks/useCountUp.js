import { useEffect, useState } from "react";

export default function useCountUp(target = 0, duration = 1200) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = target / (duration / 16);

    const timer = setInterval(() => {
      start += increment;

      if (start >= target) {
        start = target;
        clearInterval(timer);
      }

      setValue(start);
    }, 16);

    return () => clearInterval(timer);
  }, [target, duration]);

  return value.toFixed(2);
}

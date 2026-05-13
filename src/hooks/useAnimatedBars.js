import { useRef, useEffect, useState } from 'react';

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function easeOut(t) {
  return 1 - Math.pow(1 - t, 3);
}

export default function useAnimatedBars(targetValues) {
  const [currentValues, setCurrentValues] = useState(targetValues);
  const currentRef = useRef(targetValues);
  const animRef    = useRef(null);
  const startRef   = useRef(null);

  useEffect(() => {
    // Köhnə animasiyanı dayandır
    if (animRef.current) cancelAnimationFrame(animRef.current);

    const from = { ...currentRef.current };
    const to   = targetValues;
    const duration = 400; // ms

    function step(timestamp) {
      if (!startRef.current) startRef.current = timestamp;

      const elapsed = timestamp - startRef.current;
      const t = Math.min(elapsed / duration, 1);
      const eased = easeOut(t);

      // Hər bar üçün interpolasiya et
      const next = {};
      Object.keys(to).forEach(key => {
        next[key] = lerp(from[key] || 0, to[key], eased);
      });

      currentRef.current = next;
      setCurrentValues({ ...next });

      if (t < 1) {
        animRef.current = requestAnimationFrame(step);
      } else {
        startRef.current = null;
      }
    }

    animRef.current = requestAnimationFrame(step);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [targetValues]);

  return currentValues;
}
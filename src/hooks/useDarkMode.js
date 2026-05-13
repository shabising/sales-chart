import { useEffect } from 'react';

export default function useDarkMode(darkMode) {
  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);
}
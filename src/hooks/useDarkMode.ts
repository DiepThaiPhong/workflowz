import { useState, useEffect } from 'react';

// Always dark mode – light mode removed per Phase 5 design spec
function useDarkMode(): [boolean, () => void] {
  const [darkMode] = useState(true);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.add('dark');
    // Lock dark mode in localStorage so it never changes
    localStorage.setItem('skillbridge-darkmode', 'true');
  }, []);

  // noop toggle (dark mode is permanent)
  const toggleDarkMode = () => {};

  return [darkMode, toggleDarkMode];
}

export default useDarkMode;

import { h } from 'preact';
import habitat from 'preact-habitat';
import { useLayoutEffect, useState } from 'preact/hooks';
// Adapted from https://github.com/CodyHouse/dark-light-mode-switch

export default function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  // Initialize theme before window draws
	// This ensures the theme is set before any content is rendered
  useLayoutEffect(() => {

    let darkThemeSelected = false;
    const lsItem = localStorage.getItem('themeSwitch');
    if (lsItem !== null) {
      darkThemeSelected = lsItem === 'dark';
    } else {
      darkThemeSelected = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    setDarkMode(darkThemeSelected);
    applyTheme(darkThemeSelected);
  }, []);

  // Apply theme based on current state
  function applyTheme(isDark) {
    if (isDark) {
      document.body.setAttribute('data-theme', 'dark');
      localStorage.setItem('themeSwitch', 'dark');
    } else {
      document.body.removeAttribute('data-theme');
      localStorage.setItem('themeSwitch', 'light');
    }

    // Reset Disqus to match new color scheme
    if (typeof DISQUS !== "undefined") {
      DISQUS.reset({ reload: true });
    }
  }

  function toggleTheme() {
    const newMode = !darkMode;
    setDarkMode(newMode);
    applyTheme(newMode);
  }

  return (
    <div
      aria-label="Toggle theme"
      onClick={toggleTheme}
      class="theme-toggle-button"
    >
      {darkMode ? '☾' : '☼'}
    </div>
  );
}

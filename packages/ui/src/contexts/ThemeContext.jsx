import { useEffect, useState, useMemo } from "react";
import { ThemeContext } from "./Contexts.jsx";
import PropTypes from "prop-types";

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme") || "light";
    const isDark =
      saved === "dark" ||
      (saved === "device" &&
        window.matchMedia?.("(prefers-color-scheme: dark)").matches);

    if (isDark) {
      document.documentElement.dataset.theme = "dark";
      document.documentElement.style.colorScheme = "dark";
    } else {
      delete document.documentElement.dataset.theme;
      document.documentElement.style.colorScheme = "light";
    }

    return saved;
  });

  const applyTheme = (isDark) => {
    if (isDark) {
      document.documentElement.dataset.theme = "dark";
      document.documentElement.style.colorScheme = "dark";
    } else {
      delete document.documentElement.dataset.theme;
      document.documentElement.style.colorScheme = "light";
    }
  };

  useEffect(() => {
    if (theme === "light") applyTheme(false);

    if (theme === "dark") applyTheme(true);

    if (theme === "device") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      const update = () => applyTheme(mq.matches);
      update();
      mq.addEventListener("change", update);
      return () => mq.removeEventListener("change", update);
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const contextValue = useMemo(
    () => ({ theme, setTheme, toggleTheme }),
    [theme]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

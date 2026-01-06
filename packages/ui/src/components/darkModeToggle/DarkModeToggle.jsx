import { useTheme } from "../../hooks/useTheme.js";
import { Moon, Sun } from "lucide-react";
import styles from "./DarkModeToggle.module.css";

export function DarkModeToggle() {
  const { isDarkMode, toggleTheme } = useTheme();
  return (
    <button className={styles.darkModeToggle} onClick={toggleTheme}>
      {isDarkMode ? <Sun size={22} /> : <Moon size={22} />}
    </button>
  );
}

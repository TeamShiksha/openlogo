import { useTheme } from "../../hooks/useTheme.js";
import { Sun, Moon, Monitor } from "lucide-react";
import styles from "./DarkModeToggle.module.css";
import { nextTheme } from "../../utils/Constants.js";

export function DarkModeToggle() {
  const { theme, setTheme } = useTheme();

  const icon = {
    light: <Sun size={22} />,
    dark: <Moon size={22} />,
    device: <Monitor size={22} />,
  };

  return (
    <button
      className={styles.darkModeToggle}
      onClick={() => setTheme(nextTheme[theme])}
    >
      {icon[theme]}
    </button>
  );
}

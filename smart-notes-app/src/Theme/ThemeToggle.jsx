import { useTheme } from "../context/ThemeContext";
import { FaSun, FaMoon } from "react-icons/fa";

function ThemeToggle() {
  const { dark, setDark } = useTheme();

  return (
    <button
      className="p-2 rounded-full text-yellow-500 dark:text-yellow-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition cursor-pointer"
      onClick={() => setDark(!dark)}
      aria-label="Toggle Dark Mode"
    >
      {dark ? <FaSun /> : <FaMoon />}
    </button>
  );
}

export default ThemeToggle;

/* eslint-disable react/prop-types */
import { motion } from "framer-motion";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
const Button = ({ type, onClick, text, extraStyle }) => {
  const isDarkMode = useContext(ThemeContext);
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      initial={{ scale: 1 }}
      transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
      type={type}
      onClick={onClick}
      className={`${
        isDarkMode ? "text-gray-200 " : ""
      } flex  px-4 py-1 rounded-full ${extraStyle} bg-black`}
    >
      {text}
    </motion.button>
  );
};

export default Button;

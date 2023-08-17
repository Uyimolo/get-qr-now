/* eslint-disable react/prop-types */
import { motion } from "framer-motion";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
const Button = ({ type, onClick, text, extraStyle, loading }) => {
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
      {loading && (
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className=" border rounded-full border-blue-400 bg-transparent h-6 w-6 mr-4 relative"
        >
          <div className="h-2 w-2 bg-blue-400 rounded-full absolute left-0"></div>
          <div className="h-2 w-2 bg-yellow-400 rounded-full absolute right-0 "></div>
          <div className="h-2 w-2 bg-red-400 rounded-full absolute bottom-0 left-0"></div>
          <div className="h-2 w-2 bg-purple-400 rounded-full absolute bottom-0 right-0"></div>
        </motion.div>
      )}
      {text}
    </motion.button>
  );
};

export default Button;

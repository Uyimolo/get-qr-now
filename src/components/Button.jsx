import { motion } from "framer-motion";
import { PropTypes } from "prop-types";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
const Button = ({ type, onClick, text, extraStyle }) => {
  const isDarkMode = useContext(ThemeContext)
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      initial={{ scale: 1 }}
      transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
      type={type}
      onClick={onClick}
      className={`${ isDarkMode ? "text-gray-200 bg-blue-400" : ""}  px-6 py-1 rounded-full ${extraStyle}`}
    >
      {text}
    </motion.button>
  );
};

Button.propTypes = {
  type: PropTypes.string,
  onClick: PropTypes.func,
  text: PropTypes.string.isRequired,
  extraStyle: PropTypes.string,
};

export default Button;

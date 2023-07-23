import { motion } from "framer-motion";
import { PropTypes } from "prop-types";
const Button = ({ type, onClick, text, extraStyle }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.2 }}
      initial={{ scale: 1 }}
      transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
      type={type}
      onClick={onClick}
      className={`text-gray-200 px-6 py-1 bg-blue-800 rounded-full ${extraStyle}`}
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

import { motion } from "framer-motion";

const LoadingIndicator = () => {
  return (
    <motion.div
      initial={{ rotate: 0 }}
      animate={{ rotate: 360 }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      className="  rounded-full  bg-transparent h-6 w-6 mt-4 relative mx-auto"
    >
      <div className="h-2 w-2 bg-blue-400 rounded-full absolute left-0"></div>
      <div className="h-2 w-2 bg-yellow-400 rounded-full absolute right-0 "></div>
      <div className="h-2 w-2 bg-red-400 rounded-full absolute bottom-0 left-0"></div>
      <div className="h-2 w-2 bg-purple-400 rounded-full absolute bottom-0 right-0"></div>
    </motion.div>
  );
};

export default LoadingIndicator;

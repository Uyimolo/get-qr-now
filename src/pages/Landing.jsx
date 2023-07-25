import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { useContext } from "react";
import { motion } from "framer-motion";
const Landing = () => {
  const { user } = useContext(UserContext);
  return (
    <main className="px-6 pt-40 flex flex-col items-center justify-center space-y-20 md:space-y-12 md:pt-56 lg:pt-0 lg:h-screen">
      <h1 className="text-blue-500 text-4xl text-center font-semibold max-w-sm md:text-6xl md:max-w-lg lg:max-w-xl xl:text-7xl xl:max-w-2xl">
        {`Create, save and share your Qr's all in one place`}
      </h1>

      <Link to={user ? "dashboard" : "auth"} className="w-fit mx-auto">
        <motion.p
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="text-white px-4 py-2 rounded-full bg-blue-800 w-fit mx-auto md:text-lg"
        >
          {user ? "Continue to dashboard" : "Get started"}
        </motion.p>
      </Link>
    </main>
  );
};

export default Landing;

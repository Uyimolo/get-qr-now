import { Link } from "react-router-dom";
import link from "../images/link-icon.svg";
import image from "../images/image-icon.svg";

import { motion } from "framer-motion";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

const CreateQr = () => {
  const { isDarkMode } = useContext(ThemeContext);
  return (
    <div className="pt-28 px-6 md:px-16 xl:px-28">
      <div
        className={`${
          isDarkMode ? "bg-[#424548] hover:bg-[#424548aa]" : "bg-blue-400"
        } Flex flex-col p-2 py-4 space-y-6 transition-all duration-300  shadow-xl rounded-md max-w-md mx-auto md:max-w-3xl xl:max-w-4xl`}
      >
        <div className="flex flex-col space-y-4  ">
          <h1 className="text-gray-100 text-3xl text-center font-semibold lg:text-5xl">
            Create your Qr Codes
          </h1>
          <p className="text-gray-100 text-center ">
            Get started by specifying the kind of Qr code you want to create
          </p>
          <div className="flex space-x-6 w-fit mx-auto">
            <div className="flex flex-col items-center">
              <motion.div
                whileHover={{ scale: 1.1 }}
                initial={{ scale: 1 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 500 }}
                className="bg-gray-100 flex p-4 rounded-md shadow-md shadow-gray-600 "
              >
                <Link to="create-url" className="">
                  <img src={link} alt="create qr for urls" className="w-16" />
                </Link>
              </motion.div>
              <p className="text-gray-200 mt-2">Create Qr for Urls</p>
            </div>
            <div className="flex flex-col items-center">
              <motion.div
                whileHover={{ scale: 1.1 }}
                initial={{ scale: 1 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 500 }}
                className="bg-gray-100 flex p-4 rounded-md shadow-md shadow-gray-600 "
              >
                <Link className="">
                  <img
                    src={image}
                    alt="create qr for images"
                    className="w-16"
                  />
                </Link>
              </motion.div>
              <p className="text-gray-200 mt-2">Create Qr for files</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateQr;

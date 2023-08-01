/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../context/ThemeContext";
import light from "../images/icon-sun.svg";
import dark from "../images/icon-moon.svg";
import menu from "../images/icon-menu.svg";
import menuDark from "../images/icon-menu-dark.svg";
import { motion } from "framer-motion";
import { useLocation } from "react-router";
const Header = ({ setSidebarOpen, sidebarOpen }) => {
  const { isDarkMode, setIsDarkMode } = useContext(ThemeContext);
  const [showMenu, setShowMenu] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.includes("/dashboard")) {
      setShowMenu(true);
    } else {
      setShowMenu(false);
    }
  }, [location])
  

  return (
    <header
      className={`${
        isDarkMode ? "bg-[#26282b]" : "bg-[#eeeeee]"
      } flex items-center justify-between px-6 py-4 fixed top-0 left-0 w-full `}
    >
      <div className="">
        <h1
          className={`${isDarkMode ? "text-white" : "text-gray-600"} text-2xl`}
        >
          GetQrNow
        </h1>
      </div>

      <div className="flex flex-wrap items-center space-x-2 sm:space-x-4 items-center justify-center gap-2">
        <div className="">
          <motion.img
            whileHover={{ rotate: 90 }}
            initial={{ rotate: 0 }}
            transition={{ type: "spring", stiffness: 300 }}
            src={isDarkMode ? light : dark}
            alt="dark / light mode switch"
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="cursor-pointer"
          />
        </div>
        { showMenu &&
          <img
          src={isDarkMode ? menu : menuDark}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          alt=""
          className="cursor-pointer lg:hidden"
        />
        }
        
      </div>
    </header>
  );
};

export default Header;

// import menu from "../images/icon-menu.svg";
import { signOut } from "firebase/auth";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { ThemeContext } from "../context/ThemeContext";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import { auth } from "../../config/firebase";
import light from "../images/icon-sun.svg";
import dark from "../images/icon-moon.svg";
import { motion } from "framer-motion";
const Header = () => {
  const { user } = useContext(UserContext);
  const { isDarkMode, setIsDarkMode } = useContext(ThemeContext);
  const navigate = useNavigate();
  const handleLogout = async () => {
    await signOut(auth);
  };
return (
    <header
      className={`${
        isDarkMode ? "bg-[#26282b]" : "bg-white"
      } flex items-center z-10 justify-between px-6 py-4 fixed top-0 left-0 w-full border-blue-500 border-b-4 `}
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

        <div className="">
          {/* <img src={menu} alt="menu" /> */}
          <Button
            type="button"
            onClick={user ? handleLogout : () => navigate("auth")}
            text={user ? "Sign out" : "Sign in"}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;

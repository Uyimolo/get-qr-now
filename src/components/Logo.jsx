import logo from "../images/logo.svg"
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
const Logo = () => {
  const { isDarkMode } = useContext(ThemeContext);
  return (
    <div className={`flex space-x-1 items-center justify-center`}>
      <img src={logo} alt="" className={`w-8`} />
      <h1 className={`${isDarkMode ? "text-white" : "text-gray-600"} text-2xl`}>
        GetQrNow
      </h1>
    </div>
  );
};

export default Logo;

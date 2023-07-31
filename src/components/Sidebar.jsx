/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { UserContext } from "../context/UserContext";
import { signOut } from "firebase/auth";
import { auth } from "../../config/firebase";
const Sidebar = ({ handleCloseSidebar }) => {
  const { isDarkMode } = useContext(ThemeContext);
  const { user } = useContext(UserContext);
  const handleLogout = async () => {
    await signOut(auth);
  };

  let linkStyle = "";
  isDarkMode
    ? (linkStyle = "text-gray-200 py-3 hover:bg-blue-400 pl-6")
    : (linkStyle = "pl-6 text-gray-200 py-3 hover:bg-blue-600");
  return (
    <div
      className={`${
        isDarkMode
          ? "bg-[#26282b] border-gray-200"
          : "bg-blue-400 shadow-xl border-blue-400"
      } h-screen flex flex-col  py-6 border-r-2`}
    >
      <h2
        className={`${
          isDarkMode ? "text-gray-100" : "text-gray-200"
        } text-2xl pl-6`}
      >
        GetQrNow
      </h2>
      <div className={` flex flex-col pt-20`}>
        <Link
          to="/dashboard"
          className={linkStyle}
          onClick={handleCloseSidebar}
        >
          Website
        </Link>
        <Link
          to="contact-card"
          className={linkStyle}
          onClick={handleCloseSidebar}
        >
          Contact Card
        </Link>
        <Link className={linkStyle} onClick={handleCloseSidebar}>
          Upload image
        </Link>
        <Link to="file" className={linkStyle} onClick={handleCloseSidebar}>
          Upload a file
        </Link>

        <Link to="email" className={linkStyle} onClick={handleCloseSidebar}>
          Email
        </Link>
      </div>
      <div
        className={`${
          isDarkMode
            ? "text-gray-200 hover:bg-blue-400"
            : "text-gray-600 hover:bg-blue-600"
        } ${
          user ? "text-red-400" : "text-blue-400"
        } cursor-pointer mt-8 pl-6 py-3 `}
      >
        <p onClick={handleLogout}>Sign out</p>
      </div>
    </div>
  );
};

export default Sidebar;

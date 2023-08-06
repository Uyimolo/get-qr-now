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
    handleCloseSidebar();
  };

  let linkStyle = "";
  isDarkMode
    ? (linkStyle = "text-gray-200 py-3 hover:bg-blue-400 pl-6")
    : (linkStyle = "pl-6 text-white py-3 hover:bg-blue-600");
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
          isDarkMode ? "text-gray-100" : "text-white"
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
            ? "text-red-600 hover:bg-blue-400"
            : "text-red-600 hover:bg-blue-600"
        } cursor-pointer mt-8 pl-6 py-3 flex space-x-4 items-center`}
      >
        <p className="rounded-full h-10 w-10 flex items-center justify-center text-3xl text-white border-2 shadow-xl">
          {user[0].toUpperCase()}
        </p>
        <p onClick={handleLogout}>Sign out</p>
      </div>
    </div>
  );
};

export default Sidebar;

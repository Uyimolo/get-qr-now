/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { UserContext } from "../context/UserContext";
import { signOut } from "firebase/auth";
import { auth } from "../../config/firebase";
import url from "../images/url.svg";
import contact from "../images/contact-card.svg";
import fileUpload from "../images/file-upload.svg";
import email from "../images/email.svg";

const Sidebar = ({ handleCloseSidebar }) => {
  const { isDarkMode } = useContext(ThemeContext);
  const { user } = useContext(UserContext);
  const handleLogout = async () => {
    await signOut(auth);
    handleCloseSidebar();
  };

  let linkStyle = isDarkMode ? "text-gray-200 py-3" : "text-white py-3 ";
  return (
    <div
      className={`${
        isDarkMode
          ? "bg-[#26282b] border-gray-200"
          : " bg-[#212121] shadow-xl border-blue-400"
      } h-screen flex flex-col  py-6 border-r-2`}
    >
      <h2
        className={`${
          isDarkMode ? "text-gray-100" : "text-white"
        } text-2xl pl-6`}
      >
        GetQrNow
      </h2>
      <div className={` flex flex-col pt-20 `}>
        <div className="flex space-x-2 items-center pl-6 hover:bg-blue-600">
          <img src={url} alt="" className="w-4 h-fit" />
          <Link
            to="/dashboard"
            className={linkStyle}
            onClick={handleCloseSidebar}
          >
            Website
          </Link>
        </div>

        <div className="flex space-x-2 items-center pl-6 hover:bg-blue-600">
          <img src={contact} alt="" className="w-4 h-fit" />
          <Link
            to="contact-card"
            className={linkStyle}
            onClick={handleCloseSidebar}
          >
            Contact Card
          </Link>
        </div>

        <div className="flex space-x-2 items-center pl-6 hover:bg-blue-600">
          <img src={fileUpload} alt="" className="w-4 h-fit" />
          <Link to="file" className={linkStyle} onClick={handleCloseSidebar}>
            Upload a file
          </Link>
        </div>

        <div className="flex space-x-2 items-center pl-6 hover:bg-blue-600">
          <img src={email} alt="" className="w-4 h-fit" />

          <Link to="email" className={linkStyle} onClick={handleCloseSidebar}>
            Email
          </Link>
        </div>
      </div>
      <div
        className={`${
          isDarkMode
            ? "text-red-600 hover:bg-blue-400"
            : "text-red-600 hover:bg-blue-600"
        } cursor-pointer mt-8 pl-6 py-3 flex space-x-4 items-center`}
      >
        <p className="rounded-full h-8 w-8 flex items-center justify-center text-xl text-white border-2 shadow-xl bg-blue-400">
          {user[0].toUpperCase()}
        </p>
        <p onClick={handleLogout}>Sign out</p>
      </div>
    </div>
  );
};

export default Sidebar;

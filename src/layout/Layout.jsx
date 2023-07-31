/* eslint-disable react/prop-types */
import { Outlet } from "react-router";
import Header from "../components/Header";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

const Layout = ({ setSidebarOpen, sidebarOpen }) => {
  const { isDarkMode, setIsDarkMode } = useContext(ThemeContext);

  // todo: save darkmode status to local storage and syncronize with firebase on login

  return (
    <div
      className={`${isDarkMode ? "bg-[#26282b]" : "bg-[#eeeeee]"} min-h-screen`}
    >
      <Header
        setIsDarkMode={setIsDarkMode}
        isDarkMode={isDarkMode}
        setSidebarOpen={setSidebarOpen}
        sidebarOpen={sidebarOpen}
      />
      <Outlet />
    </div>
  );
};

export default Layout;

import { Outlet } from "react-router";
import Header from "../components/Header";
import { useContext} from "react";
import { ThemeContext } from "../context/ThemeContext";

const Layout = () => {
  const { isDarkMode, setIsDarkMode } = useContext(ThemeContext);

  // useEffect(() => {
  //   let mode = localStorage.getItem("mode");
  //   if (mode !== null) {
  //     setIsDarkMode(mode);
  //   }
  //   setIsDarkMode(mode);
  //   // console.log(mode);
  //   // console.log("mode: " + isDarkMode)
  // }, []);

  // useEffect(() => {
  //   localStorage.setItem("mode", `${isDarkMode}`);
  //   // console.log(localStorage.getItem("mode"))
  // }, [isDarkMode]);

  // todo: save darkmode status to local storage and syncronize with firebase on login

  return (
    <div className={`${isDarkMode ? "bg-[#26282b]" : "bg-[#eeeeee]"} min-h-screen`}>
      <Header setIsDarkMode={setIsDarkMode} isDarkMode={isDarkMode} />
      <Outlet />
    </div>
  );
};

export default Layout;

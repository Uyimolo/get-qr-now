import { Outlet } from "react-router";
import Header from "../components/Header";

const Layout = () => {
  return (
    <div className="bg-[#26282b] min-h-screen">
      <Header />
      <Outlet />
    </div>
  );
};

export default Layout;

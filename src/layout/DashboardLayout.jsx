import { Outlet } from "react-router";
// import CreateQr from "../components/CreateQr";
import CreatedQrs from "../components/CreatedQrs";
import Sidebar from "../components/Sidebar";
import { PropTypes } from "prop-types";
import { motion } from "framer-motion";
import { useMediaQuery } from "react-responsive";
import { useEffect } from "react";

const DashboardLayout = ({ sidebarOpen, setSidebarOpen }) => {
  const isDesktop = useMediaQuery({ minWidth: 1024 });
  const handleCloseSidebar = () => {
    if (!isDesktop) {
      setSidebarOpen(false);
    }
  };

  useEffect(() => {
    if (isDesktop) {
      setSidebarOpen(true);
    }
  }, [isDesktop, setSidebarOpen]);

  return (
    <main className="pb-20">
      {/* side bar */}
      <div className="">
        <motion.div
          initial={{ x: 0 }}
          animate={sidebarOpen ? { x: 0 } : { x: "-100%" }}
          transition={{ type: "spring", stiffness: 120 }}
          className={`fixed w-60 z-10`}
        >
          <Sidebar handleCloseSidebar={handleCloseSidebar} />
        </motion.div>
        <div>
          <div className="pt-16 md:pt-24 lg:ml-60">
            <Outlet />
          </div>
          <div className="mt-6 lg:ml-60">
            <CreatedQrs />
          </div>
        </div>
      </div>
    </main>
  );
};

DashboardLayout.propTypes = {
  sidebarOpen: PropTypes.bool.isRequired,
  setSidebarOpen: PropTypes.func.isRequired,
};

export default DashboardLayout;

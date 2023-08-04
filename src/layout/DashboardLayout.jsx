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

  const kareem = {
    current: {},
    count: [
      {
        id: 1,
        arr: [
          { id: 3, name: "kola" },
          { id: 4, name: "kareem" },
        ],
      },
      {
        id: 2,
        arr: [
          { id: 5, name: "queen" },
          { id: 6, name: "cup" },
        ],
      },
    ],
  };

  const editKareem = (identity) => {
    // kareem.count.forEach((obj) => {
    //   obj.arr.forEach((arr, index) => {
    //     if (arr.id === identity) {
    //       obj.arr.splice(index, 1);
    //     }
    //   });
    // });

  kareem.count.forEach((obj) => {
   obj.arr = obj.arr.filter(arr => arr.id !== identity)
  })
    console.log(kareem);
  };

  editKareem(5);

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
          transition={{ type: "spring", stiffness: 70 }}
          className={`fixed w-48 md:w-`}
        >
          <Sidebar handleCloseSidebar={handleCloseSidebar} />
        </motion.div>
        <div>
          <div className="pt-16 md:px-12 md:pt-24 lg:ml-48">
            <Outlet />
          </div>
          <div className="mt-6 lg:ml-48">
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

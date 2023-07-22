import { Outlet } from "react-router";
import CreateQr from "../components/CreateQr";

const DashboardLayout = () => {
  return (
    <main className="">
      <CreateQr />
      <div className="mt-12 px-6 md:px-16 xl:px-28">
        <Outlet />
      </div>
    </main>
  );
};

export default DashboardLayout;

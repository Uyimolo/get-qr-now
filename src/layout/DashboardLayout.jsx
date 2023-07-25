import { Outlet } from "react-router";
import CreateQr from "../components/CreateQr";
import CreatedQrs from "../components/CreatedQrs";

const DashboardLayout = () => {
  return (
    <main className="">
      <CreateQr />
      <div className="my-3 px-6 md:px-16 xl:px-28">
        <Outlet />
      </div>
      <CreatedQrs />
      <div className="h-40"></div>
    </main>
  );
};

export default DashboardLayout;

import { Outlet } from "react-router-dom";
import AdminHeader from "./Header";
import AdminSidebar from "./Sidebar";
import AdminFooter from "./Footer";
import useScreenSize from "../../hooks/useScreenSize";

const AdminLayout = () => {
  const screenSize = useScreenSize();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <AdminHeader />
      <div className="flex flex-1 pt-14">
        {screenSize === "lg" || screenSize === "xl" || screenSize === "2xl" ? (
          <AdminSidebar />
        ) : null}
        <main
          className={`flex-1  transition-all duration-300 mb-10 sm:mb-1 ${
            screenSize === "lg" || screenSize === "xl" || screenSize === "2xl"
              ? "ml-20"
              : ""
          }`}
        >
          <Outlet />
        </main>
      </div>
      {(screenSize === "xs" || screenSize === "sm") && <AdminFooter />}
    </div>
  );
};

export default AdminLayout;

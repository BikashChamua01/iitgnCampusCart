import { Outlet } from "react-router-dom";
import AdminHeader from "./Header";
import AdminSidebar from "./sidebar";
import useScreenSize from "../../hooks/useScreenSize";

const AdminLayout = () => {
  const screenSize = useScreenSize();

  return (
    <div className="min-h-screen flex flex-col bg-amber-50">
      <AdminHeader />
      <div className="flex flex-1 pt-14">
        {screenSize === "lg" || screenSize === "xl" || screenSize === "2xl" ? (
          <AdminSidebar />
        ) : null}
        <main
          className={`flex-1 p-4 transition-all duration-300 ${
            screenSize === "lg" || screenSize === "xl" || screenSize === "2xl"
              ? "ml-20"
              : ""
          }`}
        >
          <Outlet />
        </main>
      </div>
      {(screenSize === "xs" || screenSize === "sm") && <ShopFooter />}
    </div>
  );
};

export default AdminLayout;

import { Outlet } from "react-router-dom";
import ShopHeader from "./Header";
import ShopSidebar from "./Sidebar";
import ShopFooter from "./Footer";
import useScreenSize from "../../hooks/useScreenSize";

const ShopLayout = () => {
  const screenSize = useScreenSize();

  return (
    <div className="min-h-screen flex flex-col bg-amber-50">
      <ShopHeader />
      <div className="flex flex-1 pt-14">
        {screenSize === "lg" || screenSize === "xl" || screenSize === "2xl" ? (
          <ShopSidebar />
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

export default ShopLayout;

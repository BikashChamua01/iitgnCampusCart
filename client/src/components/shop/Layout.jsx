import { Outlet } from "react-router-dom";
import ShopHeader from "./Header";
import ShopSidebar from "./Sidebar";
import ShopFooter from "./Footer";
import useScreenSize from "../../hooks/useScreenSize";

const ShopLayout = () => {
  const screenSize = useScreenSize();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <ShopHeader />
      <div className="flex  flex-1 pt-13">
        {screenSize === "lg" || screenSize === "xl" || screenSize === "2xl" ? (
          <ShopSidebar />
        ) : null}
        <main
          className={`flex-1  transition-all duration-300  pb-12 md:pb-1  ${
            screenSize === "lg" ||
            screenSize === "xl" ||
            screenSize === "2xl"
              ? "ml-20"
              : "ml-0"
          }`}
        >
          <Outlet />
        </main>
      </div>
      {(screenSize === "md" || screenSize === "xs" || screenSize === "sm") && (
        <ShopFooter />
      )}
    </div>
  );
};

export default ShopLayout;

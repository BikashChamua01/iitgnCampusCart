import { Outlet } from "react-router-dom";
import ShopHeader from "./Header";
import ShopFooter from "./Footer";
import useScreenSize from "../../hooks/useScreenSize";

const ShopLayout = () => {
  const screenSize = useScreenSize();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <ShopHeader />
      <div className="flex  flex-1 pt-13">
        <main
          className={`w-full flex-1 transition-all duration-300  pb-10 md:pb-1 mt-2 flex items-center justify-center`}
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

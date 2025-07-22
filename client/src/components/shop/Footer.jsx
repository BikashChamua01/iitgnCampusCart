import { FaHome, FaProductHunt, FaList, FaInfoCircle } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

export default function ShopFooter() {
  const { pathname } = useLocation();

  const menu = [
    { to: "/shop", icon: <FaHome />, label: "Home" },
    { to: "/shop/products", icon: <FaProductHunt />, label: "Products" },
    { to: "/shop/listings", icon: <FaList />, label: "Listings" },
    { to: "/shop/about", icon: <FaInfoCircle />, label: "About" },
  ];

  return (
    <footer
      className="fixed bottom-0 left-0 w-full z-40
      bg-violet-50/95
      border-t border-violet-200
      shadow-[0_-2px_16px_0_rgba(124,58,237,0.07)]
      backdrop-blur-md
      py-2 flex justify-around items-center
      lg:hidden"
    >
      {menu.map(({ to, icon, label }) => {
        const isActive = pathname === to;
        return (
          <Link
            key={to}
            to={to}
            className={`
              flex flex-col items-center gap-0.5
              text-xs font-medium
              transition-all duration-200
              ${
                isActive
                  ? "text-violet-700"
                  : "text-violet-500 hover:text-violet-700"
              }
            `}
            aria-current={isActive ? "page" : undefined}
          >
            <span className="text-lg mb-[1px]">{icon}</span>
            <span className="text-[11px]">{label}</span>
          </Link>
        );
      })}
    </footer>
  );
}

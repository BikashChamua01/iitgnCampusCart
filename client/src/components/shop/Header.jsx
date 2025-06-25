import { FaSearch, FaUserCircle, FaCartPlus } from "react-icons/fa";

const ShopHeader = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-purple text-text-light px-4 py-3 flex justify-between items-center shadow-md">
      {/* Logo */}
      <div className="text-xl font-semibold tracking-wide">CampusCart</div>

      {/* Right Section */}
      <div className="flex items-center gap-x-5">
        {/* Search Bar */}
        <div className="relative hidden md:block w-64">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-purple">
            <FaSearch />
          </span>
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-1 rounded-md bg-white text-text-dark border border-purple-border focus:ring-2 focus:ring-purple outline-none shadow-sm"
          />
        </div>

        {/* Sell Button */}
        <div className="flex items-center gap-1 text-text-light hover:text-white cursor-pointer">
          <FaCartPlus className="w-4 h-4" />
          <span className="text-sm font-medium">Sell</span>
        </div>

        {/* User Dropdown */}
        <div className="relative">
          <button className="text-text-light hover:text-white group focus:outline-none">
            <FaUserCircle className="w-6 h-6" />
            <div className="z-10 hidden group-focus:block absolute right-0 mt-2 w-36 bg-white text-text-dark rounded-lg shadow-md">
              <ul className="py-2 text-sm">
                <li className="hover:bg-purple-light px-4 py-2 rounded">
                  <a href="#">Profile</a>
                </li>
                <li className="hover:bg-purple-light px-4 py-2 rounded">
                  <a href="#">Setting</a>
                </li>
                <li className="hover:bg-purple-light px-4 py-2 rounded">
                  <a href="#">Logout</a>
                </li>
              </ul>
            </div>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default ShopHeader;

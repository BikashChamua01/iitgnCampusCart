import React, { useEffect, useRef } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";

const FilterSidebar = ({ showFilters, setShowFilters, children }) => {
  const sidebarRef = useRef();

  useEffect(() => {
    function handleClickOutside(event) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setShowFilters(false);
      }
    }
    if (showFilters) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showFilters, setShowFilters]);

  return (
    <AnimatePresence>
      {showFilters && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm "
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowFilters(false)}
            aria-hidden="true"
          />

          {/* Sidebar */}
          <motion.div
            ref={sidebarRef}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 w-80 max-w-[90%] h-full bg-white shadow-xl border-l border-gray-200 p-6 z-50 overflow-y-auto shadow-sidebar"
            role="dialog"
            aria-modal="true"
            aria-labelledby="filter-sidebar-title"
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FilterSidebar;

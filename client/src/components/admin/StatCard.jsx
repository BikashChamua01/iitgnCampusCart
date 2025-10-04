/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";

export default function StatCard({ title, value, icon: Icon }) {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="bg-white shadow-md rounded-2xl px-3 py-1 flex items-center gap-4 "
    >
      {Icon && <Icon className="text-blue-500 w-8 h-8" />}
      <div>
        <h3 className="text-sm text-gray-500">{title}</h3>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </motion.div>
  );
}

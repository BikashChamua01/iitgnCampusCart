/* eslint-disable no-unused-vars */
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell, 
} from "recharts";
import { motion } from "framer-motion";

export default function BarChartCard({ title, data, xKey, yKey }) {
  // Array of colors for bars
  const colors = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff8042",
    "#8dd1e1",
    "#d0ed57",
  ];

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white shadow-md rounded-2xl p-4"
    >
      <h2 className="text-lg font-semibold mb-3">{title}</h2>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar
            dataKey={yKey}
            // Dynamically assign color based on index
            fill="#8884d8"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

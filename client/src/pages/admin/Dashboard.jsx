import { useEffect, useState } from "react";
import axios from "axios";
import PieChartCard from "@/components/admin/charts/PieChartCard";
import BarChartCard from "@/components/admin/charts/BarChartCard";
import LineChartCard from "@/components/admin/charts/LineChartCard";
import StatCard from "@/components/admin/StatCard";
import { Users, ShoppingBag, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
  const [categoryData, setCategoryData] = useState([]);
  const [conditionData, setConditionData] = useState([]);
  const [recentUploads, setRecentUploads] = useState([]);
  const [recentSales, setRecentSales] = useState([]);
  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const base = import.meta.env.VITE_BACKEND_URL;

      const [cat, cond, uploads, sales, users] = await Promise.all([
        axios.get(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/v1/admin-stats/products/category`,
          { withCredentials: true }
        ),
        axios.get(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/v1/admin-stats/products/condition`,
          { withCredentials: true }
        ),
        axios.get(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/v1/admin-stats/products/last4months`,
          {
            withCredentials: true,
          }
        ),
        axios.get(`${base}/api/v1/admin-stats/products/sold3months`, {
          withCredentials: true,
        }),
        axios.get(`${base}/api/v1/admin-stats/users/statistics`, {
          withCredentials: true,
        }),
      ]);

      setCategoryData(
        cat?.data.data.map((d) => ({
          name: d._id,
          value: d.count,
        }))
      );

      setConditionData(
        cond?.data.data.map((d) => ({
          name: d._id,
          value: d.count,
        }))
      );

      setRecentUploads(
        uploads?.data.data.map((d) => ({
          month: d.month,
          count: d.count,
        }))
      );

      setRecentSales(
        sales?.data.data.map((d) => ({
          month: d.month,
          count: d.sold || d.count || 0,
        }))
      );

      console.log(cat.data);
      setUserStats((prev) => ({
        ...prev,
        totalUsers: users.data.data.totalUsers,
        activeUsers: users.data.data.activeSellers, // if you want active sellers
      }));
    };

    fetchStats();
  }, []);

  return (
    <div className="p-6 space-y-6">

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Users"
          value={userStats.totalUsers}
          icon={Users}
        />
        <StatCard
          title="Total Products"
          value={categoryData.reduce((a, b)=> a + b.value, 0)}
          icon={ShoppingBag}
        />
        <StatCard
          title="Monthly Sales"
          value={recentSales.reduce((a, b) => a + b.count, 0)}
          icon={TrendingUp}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PieChartCard title="Products Per Category" data={categoryData} />
        <BarChartCard
          title="Products Per Condition"
          data={conditionData}
          xKey="name"
          yKey="value"
        />
        <LineChartCard
          title="Products Uploaded (Last 4 Months)"
          data={recentUploads}
          xKey="month"
          yKey="count"
        />
        <LineChartCard
          title="Products Sold (Last 3 Months)"
          data={recentSales}
          xKey="month"
          yKey="count"
        />
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import apiService from "../services/apiService";
import KpiCard from "../components/dashboard/KpiCard";
import CategoryDoughnutChart from "../components/dashboard/CategoryDoughnutChart";
import MonthlyBarChart from "../components/dashboard/MonthlyBarChart";

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await apiService.get("/dashboard");
        setDashboardData(response.data);
      } catch (err) {
        setError("Failed to fetch dashboard data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []); // Runs once on component mount

  if (loading)
    return <div className="text-center p-10">Loading dashboard...</div>;
  if (error) return <p className="text-red-500 text-center p-10">{error}</p>;
  if (!dashboardData) return null; // Or some other placeholder

  const { kpiData, categoryBreakdown, monthlyTrend } = dashboardData;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Your Financial Overview</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <KpiCard
          title="Total Income"
          value={kpiData.income}
          color="text-green-500"
        />
        <KpiCard
          title="Total Expenses"
          value={kpiData.expenses}
          color="text-red-500"
        />
        <KpiCard
          title="Net Balance"
          value={kpiData.balance}
          color={kpiData.balance >= 0 ? "text-green-500" : "text-red-500"}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {categoryBreakdown && categoryBreakdown.length > 0 ? (
          <CategoryDoughnutChart data={categoryBreakdown} />
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-center h-full min-h-[300px]">
            <p className="text-gray-500">No category data to display.</p>
          </div>
        )}

        {monthlyTrend && monthlyTrend.length > 0 ? (
          <MonthlyBarChart data={monthlyTrend} />
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-center h-full min-h-[300px]">
            <p className="text-gray-500">No monthly trend data available.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;

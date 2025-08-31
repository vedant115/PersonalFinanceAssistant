import React, { useState, useEffect } from "react";
import apiService from "../services/apiService";
import KpiCard from "../components/dashboard/KpiCard";
import CategoryDoughnutChart from "../components/dashboard/CategoryDoughnutChart";
import MonthlyBarChart from "../components/dashboard/MonthlyBarChart";
import RecentTransactions from "../components/dashboard/RecentTransactions";

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("all");

  const durationOptions = [
    { value: "all", label: "All Time" },
    { value: "1month", label: "1 Month" },
    { value: "3months", label: "3 Months" },
    { value: "6months", label: "6 Months" },
  ];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const params =
          selectedDuration !== "all" ? `?duration=${selectedDuration}` : "";
        const response = await apiService.get(`/dashboard${params}`);
        setDashboardData(response.data);
      } catch (err) {
        setError("Failed to fetch dashboard data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [selectedDuration]);

  const handleDurationChange = (duration) => {
    setSelectedDuration(duration);
  };

  if (loading)
    return <div className="text-center p-10">Loading dashboard...</div>;
  if (error) return <p className="text-red-500 text-center p-10">{error}</p>;
  if (!dashboardData) return null;

  const { kpiData, categoryBreakdown, monthlyTrend, recentTransactions } =
    dashboardData;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">
          Your Financial Overview
        </h1>

        <div className="flex flex-wrap gap-2">
          {durationOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleDurationChange(option.value)}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                selectedDuration === option.value
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

      <div className="w-full">
        <RecentTransactions transactions={recentTransactions} />
      </div>
    </div>
  );
};

export default DashboardPage;

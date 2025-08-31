import React, { useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const CategoryDoughnutChart = ({ data }) => {
  const [chartType, setChartType] = useState("EXPENSE");

  //   const incomeData = data.filter((d) => d.type === "INCOME");
  //   const expenseData = data.filter((d) => d.type === "EXPENSE");
  const filteredData = data.filter((d) => d.type === chartType);

  const chartData = {
    labels: filteredData.map((d) => d.category),
    datasets: [
      {
        label: chartType,
        data: filteredData.map((d) => d.total),
        backgroundColor:
          chartType === "INCOME"
            ? ["#10b981", "#34d399", "#6ee7b7", "#a7f3d0", "#d1fae5", "#ecfdf5"]
            : [
                "#ef4444",
                "#f97316",
                "#f59e0b",
                "#eab308",
                "#84cc16",
                "#22c55e",
                "#06b6d4",
                "#8b5cf6",
              ],
        borderColor: "#ffffff",
        borderWidth: 3,
        hoverBorderWidth: 4,
        hoverOffset: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.parsed;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ₹${value.toLocaleString()} (${percentage}%)`;
          },
        },
      },
    },
    cutout: "60%",
    radius: "80%",
  };
  /*
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-center">
        Category Breakdown
      </h3>
      <Doughnut data={chartData} />
    </div>
  );
};

*/
  return (
    <div
      className="bg-white p-6 rounded-lg shadow-md"
      style={{ minHeight: 400 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Category Breakdown</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setChartType("INCOME")}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              chartType === "INCOME"
                ? "bg-green-500 text-white shadow-md"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Income
          </button>
          <button
            onClick={() => setChartType("EXPENSE")}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              chartType === "EXPENSE"
                ? "bg-red-500 text-white shadow-md"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Expense
          </button>
        </div>
      </div>
      {filteredData.length > 0 ? (
        <div style={{ height: 280 }}>
          <Doughnut data={chartData} options={chartOptions} />
        </div>
      ) : (
        <div className="flex items-center justify-center h-64">
          <p className="text-center text-gray-500">
            No {chartType.toLowerCase()} data to display.
          </p>
        </div>
      )}
    </div>
  );
};
export default CategoryDoughnutChart;

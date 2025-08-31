import React, { useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const CategoryDoughnutChart = ({ data }) => {
  const [chartType, setChartType] = useState("EXPENSE"); // Default to showing expenses

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
            ? ["#4ade80", "#86efac", "#bbf7d0", "#804df4", "#00fdf4", "#f0edf5"] // Shades of green
            : [
                "#f87171",
                "#fb923c",
                "#fbbf24",
                "#facc15",
                "#a3e635",
                "#4ade80",
                "#34d399",
                "#2dd4bf",
              ], // Shades of red/orange/yellow
        borderColor: "#ffffff",
        borderWidth: 2,
      },
    ],
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
    <div className="bg-white p-10 m-0.5 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-center">
        Category Breakdown
      </h3>
      <div className="flex justify-center mb-4 space-x-2">
        <button
          onClick={() => setChartType("INCOME")}
          className={`px-4 py-2 text-sm font-medium rounded-md ${
            chartType === "INCOME"
              ? "bg-green-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Income
        </button>
        <button
          onClick={() => setChartType("EXPENSE")}
          className={`px-4 py-2 text-sm font-medium rounded-md ${
            chartType === "EXPENSE"
              ? "bg-red-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Expense
        </button>
      </div>
      {filteredData.length > 0 ? (
        <Doughnut data={chartData} />
      ) : (
        <p className="text-center text-gray-500">
          No {chartType.toLowerCase()} data to display.
        </p>
      )}
    </div>
  );
};
export default CategoryDoughnutChart;

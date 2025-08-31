import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const MonthlyBarChart = ({ data }) => {
  // Process the raw data from the backend
  const monthlyData = {};
  data.forEach((item) => {
    const month = new Date(item.month).toLocaleString("default", {
      month: "long",
      year: "numeric",
    });
    if (!monthlyData[month]) {
      monthlyData[month] = { INCOME: 0, EXPENSE: 0 };
    }
    monthlyData[month][item.type] = parseFloat(item.total);
  });

  const labels = Object.keys(monthlyData);
  const incomeValues = labels.map((month) => monthlyData[month].INCOME);
  const expenseValues = labels.map((month) => monthlyData[month].EXPENSE);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Income",
        data: incomeValues,
        backgroundColor: "rgba(75, 192, 192, 0.8)",
        borderRadius: 4,
        maxBarThickness: 48,
        barPercentage: 0.6,
        categoryPercentage: 0.6,
      },
      {
        label: "Expenses",
        data: expenseValues,
        backgroundColor: "rgba(255, 99, 132, 0.85)",
        borderRadius: 4,
        maxBarThickness: 48,
        barPercentage: 0.6,
        categoryPercentage: 0.6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Monthly Income vs. Expenses" },
    },
    interaction: {
      mode: "index",
      intersect: false,
    },
    layout: {
      padding: { top: 12, right: 12, bottom: 6, left: 6 },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { maxRotation: 0, autoSkip: true, maxTicksLimit: 12 },
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            // format as currency with thousand separators
            if (Math.abs(value) >= 1000) {
              return "₹" + value.toLocaleString();
            }
            return "₹" + value;
          },
        },
        grid: { color: "rgba(0,0,0,0.06)" },
      },
    },
  };

  return (
    <div
      className="bg-white p-6 rounded-lg shadow-md"
      style={{ minHeight: 360 }}
    >
      {labels.length === 0 ? (
        <div className="h-full flex items-center justify-center text-gray-500">
          No data available to render the chart.
        </div>
      ) : (
        <div style={{ height: 320 }}>
          <Bar options={options} data={chartData} />
        </div>
      )}
    </div>
  );
};

export default MonthlyBarChart;

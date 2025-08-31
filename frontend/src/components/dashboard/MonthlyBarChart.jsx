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
        backgroundColor: "#10b981",
        borderColor: "#059669",
        borderWidth: 1,
        borderRadius: 6,
        borderSkipped: false,
        maxBarThickness: 40,
        barPercentage: 0.7,
        categoryPercentage: 0.8,
      },
      {
        label: "Expenses",
        data: expenseValues,
        backgroundColor: "#ef4444",
        borderColor: "#dc2626",
        borderWidth: 1,
        borderRadius: 6,
        borderSkipped: false,
        maxBarThickness: 40,
        barPercentage: 0.7,
        categoryPercentage: 0.8,
      },
    ],
  };

  const options = {
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
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "white",
        bodyColor: "white",
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        callbacks: {
          label: function (context) {
            const label = context.dataset.label || "";
            const value = context.parsed.y;
            return `${label}: ₹${value.toLocaleString()}`;
          },
        },
      },
    },
    interaction: {
      mode: "index",
      intersect: false,
    },
    layout: {
      padding: { top: 10, right: 15, bottom: 10, left: 15 },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxRotation: 45,
          autoSkip: true,
          maxTicksLimit: 8,
          font: {
            size: 11,
          },
        },
        border: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            if (Math.abs(value) >= 100000) {
              return "₹" + (value / 100000).toFixed(1) + "L";
            } else if (Math.abs(value) >= 1000) {
              return "₹" + (value / 1000).toFixed(1) + "K";
            }
            return "₹" + value;
          },
          font: {
            size: 11,
          },
          maxTicksLimit: 6,
        },
        grid: {
          color: "rgba(0,0,0,0.05)",
          drawBorder: false,
        },
        border: {
          display: false,
        },
      },
    },
  };

  return (
    <div
      className="bg-white p-6 rounded-lg shadow-md"
      style={{ minHeight: 400 }}
    >
      <h3 className="text-lg font-semibold mb-6 text-center">
        Monthly Income vs Expenses
      </h3>
      {labels.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-center text-gray-500">
            No data available to render the chart.
          </p>
        </div>
      ) : (
        <div style={{ height: 280 }}>
          <Bar options={options} data={chartData} />
        </div>
      )}
    </div>
  );
};

export default MonthlyBarChart;

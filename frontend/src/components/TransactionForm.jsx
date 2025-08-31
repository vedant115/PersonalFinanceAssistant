import React, { useState, useEffect } from "react";
import apiService from "../services/apiService";
import { useNavigate } from "react-router-dom";

const TransactionForm = ({ initialData }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    amount: "",
    type: "EXPENSE",
    category: "MISC",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFromReceipt, setIsFromReceipt] = useState(false);

  const expenseCategories = [
    "RENT",
    "SHOPPING",
    "FOOD",
    "ENTERTAINMENT",
    "HEALTH",
    "GROCERIES",
    "TRAVEL",
    "MISC",
  ];
  const incomeCategories = [
    "SALARY",
    "FREELANCE",
    "INVESTMENT",
    "BONUS",
    "GIFT",
    "OTHER_INCOME",
  ];

  const availableCategories =
    formData.type === "INCOME" ? incomeCategories : expenseCategories;

  useEffect(() => {
    if (initialData) {
      setIsFromReceipt(true);
      setFormData({
        amount: initialData.amount ? initialData.amount.toString() : "",
        type: initialData.type || "EXPENSE",
        category: initialData.category || "MISC",
        description: initialData.description || "",
        date: initialData.date
          ? new Date(initialData.date).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
      });
    } else {
      setIsFromReceipt(false);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newState = { ...prev, [name]: value };
      if (name === "type") {
        newState.category = availableCategories[0];
      }
      return newState;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await apiService.post("/transactions", {
        ...formData,
        amount: parseFloat(formData.amount),
        date: new Date(formData.date).toISOString(),
      });
      navigate("/transactions");
    } catch (err) {
      setError("Failed to add transaction. Please check your input.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-lg mx-auto">
      {isFromReceipt && (
        <div className="mb-6 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded-lg">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm">
              Form populated from receipt data. Please review and edit as
              needed.
            </span>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <p className="text-red-500 text-center">{error}</p>}
        <div>
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-700"
          >
            Amount
          </label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label
            htmlFor="type"
            className="block text-sm font-medium text-gray-700"
          >
            Type
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="EXPENSE">Expense</option>
            <option value="INCOME">Income</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700"
          >
            Category
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm"
          >
            {availableCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label
            htmlFor="date"
            className="block text-sm font-medium text-gray-700"
          >
            Date
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
        >
          {loading ? "Saving..." : "Save Transaction"}
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;

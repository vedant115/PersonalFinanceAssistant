import { useState, useEffect, useMemo } from "react";
import apiService from "../services/apiService";
import { useDebounce } from "../hooks/useDebounce";
import EditTransactionForm from "./EditTransactionForm";

const TransactionList = ({ searchTerm = "" }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const [filters, setFilters] = useState({
    type: "",
    category: "",
    startDate: "",
    endDate: "",
  });

  const [sort, setSort] = useState({ sortBy: "date", sortOrder: "desc" });

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const expenseCategories = useMemo(
    () => [
      "RENT",
      "SHOPPING",
      "FOOD",
      "ENTERTAINMENT",
      "HEALTH",
      "GROCERIES",
      "TRAVEL",
      "MISC",
    ],
    []
  );

  const incomeCategories = useMemo(
    () => [
      "SALARY",
      "FREELANCE",
      "INVESTMENT",
      "BONUS",
      "GIFT",
      "OTHER_INCOME",
    ],
    []
  );

  const activeCategories = useMemo(() => {
    if (filters.type === "INCOME") return incomeCategories;
    if (filters.type === "EXPENSE") return expenseCategories;
    return [...expenseCategories, ...incomeCategories];
  }, [filters.type, expenseCategories, incomeCategories]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);

        const params = new URLSearchParams({
          page,
          limit,
          sortBy: sort.sortBy,
          sortOrder: sort.sortOrder,
        });

        if (debouncedSearchTerm) params.append("search", debouncedSearchTerm);
        if (filters.type) params.append("type", filters.type);
        if (filters.category) params.append("category", filters.category);
        if (filters.startDate) params.append("startDate", filters.startDate);
        if (filters.endDate) params.append("endDate", filters.endDate);

        const response = await apiService.get(
          `/transactions?${params.toString()}`
        );
        console.log(response.data);
        setTransactions(response.data.transactions);
        setTotalTransactions(response.data.total);
      } catch (err) {
        setError("Failed to fetch transactions.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [
    page,
    debouncedSearchTerm,
    filters.type,
    filters.category,
    filters.startDate,
    filters.endDate,
    sort,
  ]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) =>
      name === "type"
        ? { ...prev, type: value, category: "" }
        : { ...prev, [name]: value }
    );
    setPage(1);
  };

  const handleSortChange = (e) => {
    const [sortBy, sortOrder] = e.target.value.split("_");
    setSort({ sortBy, sortOrder });
    setPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      type: "",
      category: "",
      startDate: "",
      endDate: "",
    });
    setSort({ sortBy: "date", sortOrder: "desc" });
    setPage(1);
  };

  const handlePreviousPage = () => {
    setPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setPage((prev) => Math.min(prev + 1, Math.ceil(totalTransactions / limit)));
  };

  const handleDelete = async (id) => {
    try {
      await apiService.delete(`/transactions/${id}`);
      setTransactions(transactions.filter((t) => t.id !== id));
      setTotalTransactions((prev) => prev - 1);
    } catch (err) {
      setError("Failed to delete transaction");
    }
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
  };

  const handleUpdate = async (updatedTransaction) => {
    try {
      const response = await apiService.put(
        `/transactions/${updatedTransaction.id}`,
        updatedTransaction
      );
      setTransactions(
        transactions.map((t) =>
          t.id === updatedTransaction.id ? response.data : t
        )
      );
      setEditingTransaction(null);
    } catch (err) {
      setError("Failed to update transaction");
    }
  };

  const handleCancelEdit = () => {
    setEditingTransaction(null);
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      {loading && (
        <div className="mb-4 text-sm text-gray-600">Loading transactions…</div>
      )}
      {error && <div className="mb-4 text-red-500">{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
            className="w-full p-2 border rounded-md text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            End Date
          </label>
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
            className="w-full p-2 border rounded-md text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Type
          </label>
          <select
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
            className="w-full p-2 border rounded-md text-sm"
          >
            <option value="">All Types</option>
            <option value="INCOME">Income</option>
            <option value="EXPENSE">Expense</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            className="w-full p-2 border rounded-md text-sm"
          >
            <option value="">All Categories</option>
            {activeCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Order
          </label>
          <select
            onChange={handleSortChange}
            value={`${sort.sortBy}_${sort.sortOrder}`}
            className="w-full p-2 border rounded-md text-sm"
          >
            <option value="date_desc">Date (Newest)</option>
            <option value="date_asc">Date (Oldest)</option>
            <option value="amount_desc">Amount (Highest)</option>
            <option value="amount_asc">Amount (Lowest)</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Actions
          </label>
          <button
            onClick={handleResetFilters}
            className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors text-sm"
            type="button"
          >
            Reset Filters
          </button>
        </div>
      </div>
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="hidden sm:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="hidden md:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-3 sm:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.length > 0 ? (
              transactions.map((t) => (
                <>
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex flex-col">
                        <span>{new Date(t.date).toLocaleDateString()}</span>
                        <span className="sm:hidden text-xs text-gray-500 mt-1">
                          {t.category} • {t.type}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 text-sm text-gray-900">
                      <div className="max-w-xs truncate" title={t.description}>
                        {t.description}
                      </div>
                    </td>
                    <td className="hidden sm:table-cell px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {t.category}
                    </td>
                    <td className="hidden md:table-cell px-3 sm:px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          t.type === "INCOME"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {t.type}
                      </span>
                    </td>
                    <td
                      className={`px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${
                        t.type === "INCOME" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      <div className="flex flex-col items-end">
                        <span>₹{parseFloat(t.amount).toFixed(2)}</span>
                        <span className="md:hidden text-xs">
                          <span
                            className={`px-1 inline-flex text-xs leading-4 font-medium rounded ${
                              t.type === "INCOME"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {t.type}
                          </span>
                        </span>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-center">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleEdit(t)}
                          className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(t.id)}
                          className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                  {editingTransaction && editingTransaction.id === t.id && (
                    <EditTransactionForm
                      transaction={editingTransaction}
                      onUpdate={handleUpdate}
                      onCancel={handleCancelEdit}
                    />
                  )}
                </>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="px-3 sm:px-6 py-8 text-center text-gray-500"
                >
                  <div className="flex flex-col items-center">
                    <svg
                      className="w-12 h-12 text-gray-300 mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <p>No transactions found.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <button
          onClick={handlePreviousPage}
          disabled={page === 1}
          className="w-full sm:w-auto px-4 py-2 bg-gray-300 text-gray-700 rounded-md disabled:opacity-50 hover:bg-gray-400 disabled:hover:bg-gray-300 transition-colors"
        >
          Previous
        </button>
        <div className="flex flex-col sm:flex-row items-center gap-2 text-sm text-gray-600">
          <span>
            Showing {Math.min(page * limit, totalTransactions)} of{" "}
            {totalTransactions}
          </span>
          <span className="hidden sm:inline">•</span>
          <span>
            Page {page} of {Math.ceil(totalTransactions / limit) || 1}
          </span>
        </div>
        <button
          onClick={handleNextPage}
          disabled={page === Math.ceil(totalTransactions / limit)}
          className="w-full sm:w-auto px-4 py-2 bg-gray-300 text-gray-700 rounded-md disabled:opacity-50 hover:bg-gray-400 disabled:hover:bg-gray-300 transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TransactionList;

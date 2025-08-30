import React, { useState, useEffect, useMemo } from "react";
import apiService from "../services/apiService";
import { useDebounce } from "../hooks/useDebounce";

const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;
  const [totalTransactions, setTotalTransactions] = useState(0);

  const [filters, setFilters] = useState({
    search: "",
    type: "",
    category: "",
    startDate: "",
    endDate: "",
  });

  const [sort, setSort] = useState({ sortBy: "date", sortOrder: "desc" });

  const debouncedSearchTerm = useDebounce(filters.search, 500);

  const categories = useMemo(
    () => [
      "RENT",
      "SHOPPING",
      "FOOD",
      "ENTERTAINMENT",
      "HEALTH",
      "GROCERIES",
      "TRAVEL",
      "MISC",
      "SALARY",
      "FREELANCE",
      "INVESTMENT",
      "BONUS",
      "GIFT",
      "OTHER_INCOME",
    ],
    []
  );

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
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPage(1);
  };

  const handleSortChange = (e) => {
    const [sortBy, sortOrder] = e.target.value.split("_");
    setSort({ sortBy, sortOrder });
    setPage(1);
  };

  const handlePreviousPage = () => {
    setPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setPage((prev) => Math.min(prev + 1, Math.ceil(totalTransactions / limit)));
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      {loading && (
        <div className="mb-4 text-sm text-gray-600">Loading transactions…</div>
      )}
      {error && <div className="mb-4 text-red-500">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <input
          type="text"
          name="search"
          placeholder="Search descriptions..."
          value={filters.search}
          onChange={handleFilterChange}
          className="p-2 border rounded-md"
        />
        <input
          type="date"
          name="startDate"
          value={filters.startDate}
          onChange={handleFilterChange}
          className="p-2 border rounded-md"
        />
        <input
          type="date"
          name="endDate"
          value={filters.endDate}
          onChange={handleFilterChange}
          className="p-2 border rounded-md"
        />
        <select
          name="type"
          value={filters.type}
          onChange={handleFilterChange}
          className="p-2 border rounded-md"
        >
          <option value="">All Types</option>
          <option value="INCOME">Income</option>
          <option value="EXPENSE">Expense</option>
        </select>
        <select
          name="category"
          value={filters.category}
          onChange={handleFilterChange}
          className="p-2 border rounded-md"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end mb-4">
        <select
          onChange={handleSortChange}
          value={`${sort.sortBy}_${sort.sortOrder}`}
          className="p-2 border rounded-md"
        >
          <option value="date_desc">Date (Newest)</option>
          <option value="date_asc">Date (Oldest)</option>
          <option value="amount_desc">Amount (Highest)</option>
          <option value="amount_asc">Amount (Lowest)</option>
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.length > 0 ? (
              transactions.map((t) => (
                <tr key={t.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(t.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {t.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {t.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
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
                    className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${
                      t.type === "INCOME" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    ${parseFloat(t.amount).toFixed(2)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={handlePreviousPage}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Count: {Math.min(page * limit, totalTransactions)} of{" "}
          {totalTransactions}
        </span>
        <button
          onClick={handleNextPage}
          disabled={page === Math.ceil(totalTransactions / limit)}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TransactionList;

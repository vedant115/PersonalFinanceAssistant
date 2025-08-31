import React, { useState } from "react";
import TransactionList from "../components/TransactionList";

const AllTransactionsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Your Transactions</h1>
        <div className="w-full sm:w-64 lg:w-80">
          <label className="block text-xs font-medium text-gray-700 mb-1 sm:hidden">
            Search Transactions
          </label>
          <input
            type="text"
            placeholder="Search descriptions..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full p-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
      <TransactionList searchTerm={searchTerm} />
    </div>
  );
};

export default AllTransactionsPage;

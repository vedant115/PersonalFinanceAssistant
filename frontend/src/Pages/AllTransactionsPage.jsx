import React from "react";
import TransactionList from "../components/TransactionList";

const AllTransactionsPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Your Transactions</h1>
      <TransactionList />
    </div>
  );
};

export default AllTransactionsPage;

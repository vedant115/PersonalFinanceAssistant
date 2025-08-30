import React from "react";
import TransactionForm from "../components/TransactionForm";

const AddTransactionPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Add a New Transaction</h1>
      <TransactionForm />
    </div>
  );
};

export default AddTransactionPage;

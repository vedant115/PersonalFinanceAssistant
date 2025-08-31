import React, { useState } from "react";
import TransactionForm from "../components/TransactionForm";
import ReceiptUpload from "../components/ReceiptUpload";

const AddTransactionPage = () => {
  const [mode, setMode] = useState("manual");
  const [receiptData, setReceiptData] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleReceiptProcessed = (ocrResult) => {
    setReceiptData(ocrResult.data);
    setMode("manual");
    setError("");
    setSuccess(
      "Receipt processed successfully! Please review and confirm the details below."
    );
    setTimeout(() => setSuccess(""), 5000);
  };

  const handleReceiptError = (errorMessage) => {
    setError(errorMessage);
    setSuccess("");
    setTimeout(() => setError(""), 10000);
  };

  const clearReceiptData = () => {
    setReceiptData(null);
    setError("");
    setSuccess("");
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4">Add a New Transaction</h1>

        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
          <button
            onClick={() => setMode("manual")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              mode === "manual"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Manual Entry
          </button>
          <button
            onClick={() => setMode("receipt")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              mode === "receipt"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Scan Receipt
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </div>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            {success}
          </div>
        </div>
      )}

      {mode === "receipt" ? (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Upload Receipt</h2>
          <ReceiptUpload
            onReceiptProcessed={handleReceiptProcessed}
            onError={handleReceiptError}
          />
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Transaction Details</h2>
            {receiptData && (
              <button
                onClick={clearReceiptData}
                className="text-sm text-gray-600 hover:text-gray-800 underline"
              >
                Clear receipt data
              </button>
            )}
          </div>
          <TransactionForm initialData={receiptData} />
        </div>
      )}
    </div>
  );
};

export default AddTransactionPage;

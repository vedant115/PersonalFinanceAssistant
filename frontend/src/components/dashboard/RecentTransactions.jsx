import React from "react";
import { useNavigate } from "react-router-dom";

const RecentTransactions = ({ transactions }) => {
  const navigate = useNavigate();

  const handleViewMore = () => {
    navigate("/transactions");
  };

  const formatAmount = (amount, type) => {
    const formattedAmount = `₹${parseFloat(amount).toFixed(2)}`;
    return type === "INCOME" ? `+${formattedAmount}` : `-${formattedAmount}`;
  };

  const getAmountColor = (type) => {
    return type === "INCOME" ? "text-green-600" : "text-red-600";
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Recent Transactions</h3>
        <button
          onClick={handleViewMore}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          View More
        </button>
      </div>
      
      {transactions && transactions.length > 0 ? (
        <div className="space-y-3">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900 truncate">
                      {transaction.description}
                    </p>
                    <p className="text-sm text-gray-500">
                      {transaction.category} • {new Date(transaction.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <p className={`font-semibold ${getAmountColor(transaction.type)}`}>
                      {formatAmount(transaction.amount, transaction.type)}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {transaction.type.toLowerCase()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">No recent transactions found.</p>
        </div>
      )}
    </div>
  );
};

export default RecentTransactions;

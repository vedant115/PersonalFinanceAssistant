import React from "react";

const KpiCard = ({ title, value, color }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md text-center">
      <h3 className="text-gray-500 text-sm font-medium uppercase">{title}</h3>
      <p className={`text-3xl font-bold ${color}`}>
        ₹ {parseFloat(value).toFixed(2)}
      </p>
    </div>
  );
};

export default KpiCard;

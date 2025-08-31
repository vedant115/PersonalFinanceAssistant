import { useState } from "react";

const EditTransactionForm = ({ transaction, onUpdate, onCancel }) => {
  const [formData, setFormData] = useState({
    amount: transaction.amount,
    type: transaction.type,
    category: transaction.category,
    description: transaction.description,
    date: transaction.date.split("T")[0],
  });

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "type") {
      setFormData((prev) => ({
        ...prev,
        type: value,
        category:
          value === "INCOME" ? incomeCategories[0] : expenseCategories[0],
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedData = {
      ...transaction,
      ...formData,
      amount: parseFloat(formData.amount),
      date: new Date(formData.date).toISOString(),
    };
    onUpdate(updatedData);
  };

  return (
    <tr className="bg-blue-50">
      <td colSpan="6" className="px-3 sm:px-6 py-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full p-2 border rounded-md text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Amount
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className="w-full p-2 border rounded-md text-sm"
                step="0.01"
                min="0"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full p-2 border rounded-md text-sm"
                required
              >
                <option value="EXPENSE">Expense</option>
                <option value="INCOME">Income</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-2 border rounded-md text-sm"
                required
              >
                {availableCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Description
              </label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-2 border rounded-md text-sm"
                required
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
            >
              Update
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      </td>
    </tr>
  );
};

export default EditTransactionForm;

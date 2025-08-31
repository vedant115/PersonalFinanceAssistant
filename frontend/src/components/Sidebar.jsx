import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const activeLinkStyle = {
    backgroundColor: "#4f46e5", // A darker indigo for the active link
    color: "white",
  };

  return (
    <aside className="w-64 flex-shrink-0 bg-gray-800 text-white flex flex-col">
      <div className="h-16 flex items-center justify-center text-2xl font-bold border-b border-gray-700">
        FinanceTrack
      </div>
      <nav className="flex-grow p-4 space-y-2">
        <NavLink
          to="/"
          style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
          className="w-full flex items-center px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/transactions"
          style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
          className="w-full flex items-center px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          Transactions
        </NavLink>
        <NavLink
          to="/add-transaction"
          style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
          className="w-full flex items-center px-4 py-2 rounded-lg 
           hover:bg-gray-700 transition-colors"
        >
          Add Transaction
        </NavLink>
      </nav>
      <div className="p-4 border-t border-gray-700">
        <div className="text-center mb-4">
          <span className="text-sm">Welcome, {user?.name}</span>
        </div>
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

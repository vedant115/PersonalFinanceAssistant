import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const activeLinkStyle = {
    fontWeight: "bold",
    textDecoration: "underline",
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 font-bold text-xl text-indigo-600">
            FinanceTrack
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <NavLink
                to="/"
                style={({ isActive }) =>
                  isActive ? activeLinkStyle : undefined
                }
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/transactions"
                style={({ isActive }) =>
                  isActive ? activeLinkStyle : undefined
                }
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Transactions
              </NavLink>
            </div>
          </div>
          <div className="flex items-center">
            <NavLink
              to="/add-transaction"
              className="bg-indigo-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 mr-4"
            >
              + Add Transaction
            </NavLink>
            <span className="text-gray-800 text-sm mr-4">
              Welcome, {user?.name}
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

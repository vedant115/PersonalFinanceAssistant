import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const { user, logout, loading } = useAuth();

  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const activeLinkStyle = {
    backgroundColor: "#4f46e5",
    color: "white",
  };

  const navItems = [
    { to: "/", label: "Dashboard", icon: "📊" },
    { to: "/transactions", label: "Transactions", icon: "💳" },
    { to: "/add-transaction", label: "Add Transaction", icon: "➕" },
  ];

  return (
    <aside
      className={`${
        isExpanded ? "w-64" : "w-16"
      } flex-shrink-0 bg-gray-800 text-white flex flex-col transition-all duration-300 ease-in-out hover:w-64 group`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="h-16 flex items-center border-b border-gray-700 px-5 py-3">
        <span className="text-2xl min-w-[24px]">☰</span>

        <span
          className={`ml-3 text-xl font-bold transition-opacity duration-300 ${
            isExpanded ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          } whitespace-nowrap overflow-hidden`}
        >
          FinanceTrack
        </span>
      </div>

      <nav className="flex-grow p-2 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
            className="w-full flex items-center px-3 py-3 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <span className="text-xl min-w-[24px]">{item.icon}</span>
            <span
              className={`ml-3 transition-opacity duration-300 ${
                isExpanded ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              } whitespace-nowrap`}
            >
              {item.label}
            </span>
          </NavLink>
        ))}
      </nav>

      <div className="p-2 border-t border-gray-700">
        <div
          className={`text-center mb-3 transition-opacity duration-300 ${
            isExpanded ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
        >
          <span className="text-sm whitespace-nowrap">
            {loading ? "Loading..." : `Welcome, ${user?.name || "User"}`}
          </span>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center px-2 py-2 rounded-lg bg-red-500 hover:bg-red-600 transition-colors text-white"
        >
          <span className="text-2xl min-w-[24px]">📤</span>
          <span
            className={`ml-3 transition-opacity duration-300 ${
              isExpanded ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            } whitespace-nowrap`}
          >
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

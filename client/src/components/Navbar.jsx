import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Navbar = () => {
  const { user, setShowLogin, logout, credit } = useContext(AppContext);
  const navigate = useNavigate(); 
  return (
    <div className="flex items-center justify-between py-4 px-6">
      {/* Logo */}
      <Link to="/">
        <img src={assets.logo} alt="Logo" className="w-28 sm:w-32 lg:w-40" />
      </Link>

      {/* User Controls */}
      <div>
        {user ? (
          <div className="flex items-center text-center gap-4 sm:gap-6">
            {/* Credits Section */}
            <button
              onClick={() => navigate("/buy")}
              className="flex items-center gap-2 bg-blue-100 px-4 sm:px-6 py-2 sm:py-3 rounded-full hover:scale-105 transition-transform duration-300"
            >
              <img className="w-5" src={assets.credit_star} alt="Credit Star" />
              <p className="text-xs sm:text-sm font-medium">
                Credit left: {credit}
              </p>
            </button>

            {/* Greeting */}
            <p className="text-sm sm:text-base font-medium text-gray-600 pl-4">
              Hi, {user.name}
            </p>

            {/* Profile Icon with Dropdown */}
            <div className="relative group">
              <img
                src={assets.profile_icon}
                className="w-10 h-10 rounded-full cursor-pointer shadow-md"
                alt="Profile"
              />
              {/* Dropdown Menu */}
              <div className="absolute hidden group-hover:block top-full right-0 z-10 text-black rounded bg-white shadow-lg border mt-2">
                <ul className="list-none m-0 p-2 rounded-md text-sm">
                  <li
                    onClick={logout}
                    className="py-1 px-2 cursor-pointer hover:bg-gray-100"
                  >
                    Logout
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          // Pricing and Login Section
          <div className="flex items-center gap-4 sm:gap-6">
            <p
              className="cursor-pointer text-gray-700 hover:underline"
              onClick={() => navigate("/buy")}
            >
              Pricing
            </p>
            <button
              onClick={() => setShowLogin(true)} // Corrected function call
              className="bg-zinc-800 text-white px-6 py-2 text-sm rounded-full sm:px-8 hover:bg-zinc-700 transition-colors"
            >
              Log In
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;

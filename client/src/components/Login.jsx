import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const [state, setState] = useState("Login");
  const { backendUrl, setToken, setUser, setShowLogin } =
    useContext(AppContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      if (state === "Login") {
        const { data } = await axios.post(backendUrl + "/api/user/login", {
          email,
          password,
        });
        if (data.success) {
          setToken(data.token);
          setUser(data.user);
          localStorage.getItem("token", data.token);
          setShowLogin(false);
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(backendUrl + "/api/user/register", {
          name,
          email,
          password,
        });
        if (data.success) {
          setToken(data.token);
          setUser(data.user);
          localStorage.getItem("token", data.token);
          setShowLogin(false);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-10 flex justify-center items-center bg-black/30 backdrop-blur-sm">
      <motion.form
        onSubmit={onSubmitHandler}
        className="relative bg-white p-8 sm:p-10 rounded-xl shadow-lg text-slate-500 w-full max-w-sm"
        initial={{ opacity: 0.2, y: 50 }}
        transition={{ duration: 0.3 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="flex flex-col items-center">
          <h1 className="text-center text-2xl font-medium text-neutral-700">
            {state === "Login" ? "Sign In" : "Sign Up"}
          </h1>
          <p className="text-sm text-neutral-500 mt-2">
            {state === "Login"
              ? "Welcome back! Please sign in to continue."
              : "Create your account to get started."}
          </p>
        </div>

        {state !== "Login" && (
          <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-5">
            <img src={assets.user_icon} alt="User" className="w-5 h-5" />
            <input
              type="text"
              onChange={(e) => setName(e.target.value)}
              value={name}
              className="outline-none text-sm flex-grow"
              placeholder="Full Name"
              required
            />
          </div>
        )}

        <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-5">
          <img src={assets.email_icon} alt="Email" className="w-5 h-5" />
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            className="outline-none text-sm flex-grow"
            placeholder="Email ID"
            required
          />
        </div>
        <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-5">
          <img src={assets.lock_icon} alt="Password" className="w-5 h-5" />
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type="password"
            className="outline-none text-sm flex-grow"
            placeholder="Password"
            required
          />
        </div>

        {state === "Login" && (
          <p className="text-sm text-blue-600 my-4 text-right cursor-pointer">
            Forgot Password?
          </p>
        )}

        <button className="bg-blue-600 w-full text-white py-2 rounded-full hover:bg-blue-700 transition">
          {state === "Login" ? "Sign In" : "Create Account"}
        </button>

        {state === "Login" ? (
          <p className="mt-5 text-center">
            Don't have an account?
            <span
              className="text-blue-600 cursor-pointer"
              onClick={() => setState("SignUp")}
            >
              Sign Up
            </span>
          </p>
        ) : (
          <p className="mt-5 text-center">
            Already have an account?{" "}
            <span
              className="text-blue-600 cursor-pointer"
              onClick={() => setState("Login")}
            >
              Sign In
            </span>
          </p>
        )}

        <img
          onClick={() => setShowLogin(false)}
          src={assets.cross_icon}
          alt="Close"
          className="absolute top-5 right-5 cursor-pointer"
        />
      </motion.form>
    </div>
  );
};

export default Login;

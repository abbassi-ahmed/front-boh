import React, { useEffect, useState } from "react";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { useAxios } from "../../hooks/fetch-api.hook";
import { addToast } from "@heroui/react";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });
  const { data } = useAxios("users", "POST", {}, "data", false);
  const router = useNavigate();
  const [isFormValid, setIsFormValid] = useState(false);
  const [inputErrors, setInputErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  useEffect(() => {
    const isValid =
      form.name.length > 0 &&
      form.email.length > 0 &&
      validateEmail(form.email) &&
      form.password.length >= 8 &&
      form.password === form.confirmPassword;
    setIsFormValid(isValid);
  }, [form]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));

    let errorMessage = "";
    if (name === "email" && value.includes("@")) {
      errorMessage = validateEmail(value) ? "" : "Invalid email format";
    } else if (name === "password" && value.length > 0 && value.length < 8) {
      errorMessage = "Password must be at least 8 characters";
    } else if (name === "confirmPassword" && value !== form.password) {
      errorMessage = "Passwords don't match";
    }

    setInputErrors((prevErrors) => ({ ...prevErrors, [name]: errorMessage }));
  };

  const togglePasswordVisibility = (field: "password" | "confirmPassword") => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      data.submitRequest({
        name: form.name,
        email: form.email,
        password: form.password,
      });
    }
  };

  useEffect(() => {
    if (data.responseData && !data.error) {
      addToast({
        title: "Signed up successfully",
        description: "Log in to your account to continue.",
        color: "success",
      });
      router("/");
    } else if (data.error) {
      console.error("Login failed:", data.error);
    }
  }, [data.responseData, data.error]);
  return (
    <div className="min-h-screen bg-black bg-gradient-to-b from-purple-900/20 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-zinc-100">Create Account</h1>
          <p className="text-zinc-400">Sign up to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="relative">
            <label className="text-sm text-zinc-400 mb-1 block">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <User className="w-4 h-4 text-zinc-400" />
              </div>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleInputChange}
                placeholder="Enter your name"
                className="w-full bg-zinc-800 text-zinc-100 border border-zinc-700 rounded-lg py-2 px-10 focus:outline-none focus:border-purple-500 placeholder-zinc-500"
              />
            </div>
            {inputErrors.name && (
              <p className="text-red-400 text-sm mt-1">{inputErrors.name}</p>
            )}
          </div>

          <div className="relative">
            <label className="text-sm text-zinc-400 mb-1 block">Email</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <Mail className="w-4 h-4 text-zinc-400" />
              </div>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className="w-full bg-zinc-800 text-zinc-100 border border-zinc-700 rounded-lg py-2 px-10 focus:outline-none focus:border-purple-500 placeholder-zinc-500"
              />
            </div>
            {inputErrors.email && (
              <p className="text-red-400 text-sm mt-1">{inputErrors.email}</p>
            )}
          </div>

          <div className="relative">
            <label className="text-sm text-zinc-400 mb-1 block">Password</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <Lock className="w-4 h-4 text-zinc-400" />
              </div>
              <input
                type={showPassword.password ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleInputChange}
                placeholder="Create a password"
                className="w-full bg-zinc-800 text-zinc-100 border border-zinc-700 rounded-lg py-2 px-10 focus:outline-none focus:border-purple-500 placeholder-zinc-500"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("password")}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword.password ? (
                  <EyeOff className="w-4 h-4 text-zinc-400" />
                ) : (
                  <Eye className="w-4 h-4 text-zinc-400" />
                )}
              </button>
            </div>
            {inputErrors.password && (
              <p className="text-red-400 text-sm mt-1">
                {inputErrors.password}
              </p>
            )}
          </div>

          <div className="relative">
            <label className="text-sm text-zinc-400 mb-1 block">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <Lock className="w-4 h-4 text-zinc-400" />
              </div>
              <input
                type={showPassword.confirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your password"
                className="w-full bg-zinc-800 text-zinc-100 border border-zinc-700 rounded-lg py-2 px-10 focus:outline-none focus:border-purple-500 placeholder-zinc-500"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("confirmPassword")}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword.confirmPassword ? (
                  <EyeOff className="w-4 h-4 text-zinc-400" />
                ) : (
                  <Eye className="w-4 h-4 text-zinc-400" />
                )}
              </button>
            </div>
            {inputErrors.confirmPassword && (
              <p className="text-red-400 text-sm mt-1">
                {inputErrors.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={!isFormValid}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Sign Up
          </button>

          <p className="text-center text-zinc-400">
            Already have an account?{" "}
            <Link
              to={"/"}
              type="button"
              className="text-purple-400 hover:text-purple-300"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;

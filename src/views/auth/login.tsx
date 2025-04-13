import React, { useEffect, useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import { useAxios } from "../../hooks/fetch-api.hook";
import { useAuth } from "../../context/AuthContext";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const { login } = useAuth();
  const [inputErrors, setInputErrors] = useState({
    email: "",
    password: "",
  });
  const { data } = useAxios("auth", "POST", {}, "data", false);

  useEffect(() => {
    setIsFormValid(form.email.length > 0);
  }, [form]);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));

    let errorMessage = "";
    if (name === "email" && value.includes("@")) {
      errorMessage = validateEmail(value) ? "" : "Invalid email format";
    }

    setInputErrors((prevErrors) => ({ ...prevErrors, [name]: errorMessage }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      data.submitRequest({
        email: form.email,
        password: form.password,
      });
    }
  };
  useEffect(() => {
    if (data.responseData && !data.error) {
      login(data.responseData.user, data.responseData.access_token);
    } else if (data.error) {
      console.error("Login failed:", data.error);
    }
  }, [data.responseData, data.error]);

  return (
    <div className="min-h-screen bg-black bg-gradient-to-b from-purple-900/20 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-zinc-100">Welcome Back!</h1>
          <p className="text-zinc-400">Sign in to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
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
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                className="w-full bg-zinc-800 text-zinc-100 border border-zinc-700 rounded-lg py-2 px-10 focus:outline-none focus:border-purple-500 placeholder-zinc-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4 text-zinc-400" />
                ) : (
                  <Eye className="w-4 h-4 text-zinc-400" />
                )}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              className="text-sm text-purple-400 hover:text-purple-300"
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={!isFormValid}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Sign In
          </button>

          <p className="text-center text-zinc-400">
            Don't have an account?{" "}
            <Link
              to={"/signup"}
              type="button"
              className="text-purple-400 hover:text-purple-300"
            >
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;

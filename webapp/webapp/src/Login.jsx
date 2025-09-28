import React, { useState, useRef } from "react";
import { loginService } from "../services/loginService";
import Cookie from "js-cookie";

export default function Login() {
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const username = useRef(null);
  const password = useRef(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await loginService(
        username.current.value,
        password.current.value
      );

      if (response.ok) {
        const data = await response.json();
        Cookie.set("token", data.token);
        window.location.href = "/dashboard"; // redirect after login
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mx-auto mb-6 flex items-center justify-center">
          <img src="/logo.png" alt="Logo" className="h-20 w-20 object-contain" />
        </div>

        {/* Headline */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-semibold text-gray-800">Welcome Back</h1>
          <p className="mt-1 text-gray-500">Sign in to your account</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-white p-6 shadow-xl ring-1 ring-black/5">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-gray-800">Login</h2>
            <p className="text-sm text-gray-500">
              Enter your credentials to continue
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleLogin}>
            {/* Email */}
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">
                Email
              </span>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M2 6.5A2.5 2.5 0 0 1 4.5 4h15A2.5 2.5 0 0 1 22 6.5v11A2.5 2.5 0 0 1 19.5 20h-15A2.5 2.5 0 0 1 2 17.5v-11Zm2.2.3 7.51 5.01a1 1 0 0 0 1.08 0L20.3 6.8a.75.75 0 1 0-.86-1.23L12 10.3 3.56 5.57a.75.75 0 1 0-.86 1.23Z" />
                  </svg>
                </span>
                <input
                  type="email"
                  placeholder="john@example.com"
                  autoComplete="email"
                  className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  ref={username}
                />
              </div>
            </label>

            {/* Password */}
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">
                Password
              </span>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M17 11V8a5 5 0 1 0-10 0v3H5.5A1.5 1.5 0 0 0 4 12.5v7A1.5 1.5 0 0 0 5.5 21h13a1.5 1.5 0 0 0 1.5-1.5v-7A1.5 1.5 0 0 0 18.5 11H17Zm-8-3a3 3 0 1 1 6 0v3H9V8Z" />
                  </svg>
                </span>
                <input
                  type={showPw ? "text" : "password"}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="w-full rounded-lg border border-gray-300 pl-10 pr-10 py-2 text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  ref={password}
                />
                <button
                  type="button"
                  aria-label={showPw ? "Hide password" : "Show password"}
                  onClick={() => setShowPw((s) => !s)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPw ? "Hide" : "Show"}
                </button>
              </div>
            </label>

            {/* Row */}
            <div className="flex items-center justify-between pt-1">
              <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                Remember me
              </label>
              <a
                className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                href="#"
              >
                Forgot password?
              </a>
            </div>

            {/* CTA */}
            <button
              type="submit"
              className="mt-2 w-full rounded-lg bg-indigo-600 py-2.5 font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

            <div className="text-center text-red-600">{error}</div>
          </form>
        </div>
      </div>
    </div>
  );
}

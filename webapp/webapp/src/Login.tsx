import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [showPw, setShowPw] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Login failed");
      }
      const data = await res.json(); // { token: "..." }

      // store token
      const storage = remember ? localStorage : sessionStorage;
      storage.setItem("auth_token", data.token);

      // go to dashboard
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function goForgot() {
    navigate("/forgot-password");
  }
  function goSignup() {
    navigate("/register");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-500 shadow-lg">
          <svg viewBox="0 0 24 24" className="h-7 w-7 text-white" fill="currentColor">
            <rect x="6.5" y="6.5" width="11" height="11" rx="2" />
          </svg>
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
            <p className="text-sm text-gray-500">Enter your credentials to continue</p>
          </div>

          {error && (
            <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Email */}
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">Email</span>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                  <svg className="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M2 6.5A2.5 2.5 0 0 1 4.5 4h15A2.5 2.5 0 0 1 22 6.5v11A2.5 2.5 0 0 1 19.5 20h-15A2.5 2.5 0 0 1 2 17.5v-11Zm2.2.3 7.51 5.01a1 1 0 0 0 1.08 0L20.3 6.8a.75.75 0 1 0-.86-1.23L12 10.3 3.56 5.57a.75.75 0 1 0-.86 1.23Z"/>
                  </svg>
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  autoComplete="email"
                  className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                />
              </div>
            </label>

            {/* Password */}
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">Password</span>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                  <svg className="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17 11V8a5 5 0 1 0-10 0v3H5.5A1.5 1.5 0 0 0 4 12.5v7A1.5 1.5 0 0 0 5.5 21h13a1.5 1.5 0 0 0 1.5-1.5v-7A1.5 1.5 0 0 0 18.5 11H17Zm-8-3a3 3 0 1 1 6 0v3H9V8Z"/>
                  </svg>
                </span>
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="w-full rounded-lg border border-gray-300 pl-10 pr-10 py-2 text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                />
                <button
                  type="button"
                  aria-label={showPw ? "Hide password" : "Show password"}
                  onClick={() => setShowPw((s) => !s)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPw ? (
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M3 3.7 4.3 2.4l18 18L21 21.7l-3.1-3.1A11.8 11.8 0 0 1 12 20c-4.8 0-8.9-2.9-11-7 1-2.2 2.6-4.1 4.6-5.4L3 3.7ZM12 8a4 4 0 0 1 4 4c0 .5-.1 1-.3 1.5l-5.2-5.2c.5-.2 1-.3 1.5-.3Zm0-4c4.8 0 8.9 2.9 11 7-.9 2-2.4 3.7-4.2 4.9l-1.4-1.4A9.7 9.7 0 0 0 21 12c-1.8-3.6-5.2-6-9-6-1.1 0-2.1.2-3 .6L7.6 5.2C8.9 4.5 10.4 4 12 4Z"/></svg>
                  ) : (
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 5c4.8 0 8.9 2.9 11 7-2.1 4.1-6.2 7-11 7S3.1 16.1 1 12c2.1-4.1 6.2-7 11-7Zm0 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z"/></svg>
                  )}
                </button>
              </div>
            </label>

            {/* Row */}
            <div className="flex items-center justify-between pt-1">
              <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                Remember me
              </label>

              <button
                type="button"
                onClick={goForgot}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
              >
                Forgot password?
              </button>
            </div>

            {/* CTA */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-lg bg-indigo-600 py-2.5 font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Footer link */}
          <p className="mt-4 text-center text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <button onClick={goSignup} className="font-semibold text-indigo-600 hover:text-indigo-700">
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

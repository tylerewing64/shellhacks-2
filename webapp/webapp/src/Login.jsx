import React from "react";

function Login() {
  return (
    // 1. Set the root div to fill the viewport (min-h-screen)
    // 2. Enable Flexbox (flex)
    // 3. Center horizontally (justify-center) and vertically (items-center)
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      {/* Container for the Login form content (optional, but good practice) */}
      <div className="flex flex-col items-center p-8 bg-white shadow-xl rounded-lg w-full max-w-sm">
        {/* Title Section */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Login</h1>
        </div>

        {/* Form Inputs Section */}
        <div className="w-full space-y-4">
          {/* Username Field */}
          <div className="w-full">
            <h2 className="text-sm font-medium text-gray-600 mb-1">Username</h2>
            <input
              type="text"
              className="w-full border-b border-gray-300 focus:border-blue-500 focus:ring-0 focus:outline-none p-1 transition duration-150"
            />
          </div>

          {/* Password Field */}
          <div className="w-full">
            <h2 className="text-sm font-medium text-gray-600 mb-1">Password</h2>
            <input
              type="password" // Changed to password type for security
              className="w-full border-b border-gray-300 focus:border-blue-500 focus:ring-0 focus:outline-none p-1 transition duration-150"
            />
          </div>
        </div>

        {/* Button Section */}
        <button
          type="button"
          className="w-full p-2 mt-8 text-base font-semibold bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-150 shadow-md"
        >
          Login
        </button>
      </div>
    </div>
  );
}

export default Login;

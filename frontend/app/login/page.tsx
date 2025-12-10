"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const login = async () => {
    setError("");

    try {
      const res = await fetch("http://127.0.0.1:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (data.access_token) {
        localStorage.setItem("token", data.access_token);
        router.push("/admin");
      } else {
        setError("Invalid username or password");
      }
    } catch {
      setError("Unable to reach server");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-8">
        
        {/* Header */}
        <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
          Admin Login
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Restricted access · Authorized users only
        </p>

        {/* Error */}
        {error && (
          <div className="mb-4 text-red-700 text-sm bg-red-100 border border-red-200 p-3 rounded-md">
            {error}
          </div>
        )}

        {/* Inputs */}
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 rounded-lg
                       bg-white
                       text-gray-900
                       placeholder-gray-500
                       border border-gray-300
                       focus:outline-none
                       focus:ring-2
                       focus:ring-blue-500"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg
                       bg-white
                       text-gray-900
                       placeholder-gray-500
                       border border-gray-300
                       focus:outline-none
                       focus:ring-2
                       focus:ring-blue-500"
          />

          <button
            onClick={login}
            className="w-full py-3 rounded-lg font-semibold text-white
                       bg-gradient-to-r from-blue-600 to-indigo-600
                       hover:from-blue-700 hover:to-indigo-700
                       transition-all shadow-lg"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

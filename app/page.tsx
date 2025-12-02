'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Home() {
  const router = useRouter();

  // Login States
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [showLogoutNotification, setShowLogoutNotification] = useState(false);

  // Register Popup States
  const [showRegister, setShowRegister] = useState(false);
  const [brand, setBrand] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regLoading, setRegLoading] = useState(false);

  // Register show/hide password
  const [regShowPassword, setRegShowPassword] = useState(false);
  const [regShowConfirmPassword, setRegShowConfirmPassword] = useState(false);

  // Handle logout success display
  useEffect(() => {
    const logoutSuccess = localStorage.getItem('logoutSuccess');
    if (logoutSuccess === 'true') {
      setShowLogoutNotification(true);
      localStorage.removeItem('logoutSuccess');
      setTimeout(() => setShowLogoutNotification(false), 3000);
    }
  }, []);

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (!data.success) {
      setIsLoading(false);
      setError('Invalid username or password');
      return;
    }

    setShowSuccessNotification(true);
    setTimeout(() => router.push('/admin/dashboard'), 1000);
  };

  // Handle Register
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (regPassword !== regConfirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setRegLoading(true);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        brand_name: brand,
        username: regUsername,
        password: regPassword,
      }),
    });

    const data = await res.json();
    setRegLoading(false);

    if (!data.success) {
      alert(data.message || "Failed to register");
      return;
    }

    // 🔥 清空所有栏位
    setBrand("");
    setRegUsername("");
    setRegPassword("");
    setRegConfirmPassword("");
    setRegShowPassword(false);
    setRegShowConfirmPassword(false);

    alert("Account created! Please login.");
    setShowRegister(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4">
      
      {/* Login Card */}
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 sm:p-8">
        <div className="text-center mb-6 sm:mb-8">
          <div className="mb-4 sm:mb-6">
            <Image
              src="/dinosaur.png"
              alt="Admin System Logo"
              width={100}
              height={80}
              className="mx-auto rounded-xl"
            />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">Admin Login</h1>
          <p className="text-xs sm:text-sm text-gray-600">Enter your credentials to access dashboard</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">
          {/* Username */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
              Username
            </label>
            <div className="relative">
              <i className="ri-user-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter username"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <i className="ri-lock-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-10 pr-11 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter password"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={isLoading}
              >
                <i className={showPassword ? 'ri-eye-off-line' : 'ri-eye-line'}></i>
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded-lg text-sm flex items-center gap-2">
              <i className="ri-error-warning-line"></i>
              {error}
            </div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Verifying...
              </>
            ) : (
              'Login'
            )}
          </button>

          {/* Register Link */}
          <div className="text-center mt-3">
            <button
              type="button"
              onClick={() => setShowRegister(true)}
              className="text-blue-600 text-sm hover:underline"
            >
              Create an account
            </button>
          </div>
        </form>
      </div>

      {/* Login Success */}
      {showSuccessNotification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3">
          <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
            <i className="ri-check-line text-green-500"></i>
          </div>
          Login successful! Redirecting...
        </div>
      )}

      {/* Logout Success */}
      {showLogoutNotification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3">
          <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
            <i className="ri-check-line text-green-500"></i>
          </div>
          Logout successful!
        </div>
      )}

      {/* Register Modal */}
      {showRegister && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl relative">

            <button
              onClick={() => setShowRegister(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>

            <h2 className="text-xl font-semibold mb-4">Create Account</h2>

            <form onSubmit={handleRegister} className="space-y-4">

              {/* Brand */}
              <div>
                <label className="text-sm font-medium">Select Brand</label>
                <select
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full border p-2 rounded-lg"
                  required
                >
                  <option value="">Select a brand</option>
                  <option value="iPay9">iPay9</option>
                  <option value="Kingbet9">Kingbet9</option>
                  <option value="BP77">BP77</option>
                  <option value="Me99">Me99</option>
                  <option value="Gucci9">Gucci9</option>
                  <option value="Mrbean9">Mrbean9</option>
                  <option value="Pokemon13">Pokemon13</option>
                  <option value="Bugatti13">Bugatti13</option>
                  <option value="Rolex9">Rolex9</option>
                  <option value="Bybid9">Bybid9</option>
                </select>
              </div>

              {/* Username */}
              <div>
                <label className="text-sm font-medium">Username</label>
                <input
                  type="text"
                  className="w-full border p-2 rounded-lg"
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className="text-sm font-medium">Password</label>
                <div className="relative">
                  <input
                    type={regShowPassword ? "text" : "password"}
                    className="w-full border p-2 rounded-lg pr-11"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setRegShowPassword(!regShowPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <i className={regShowPassword ? "ri-eye-off-line" : "ri-eye-line"}></i>
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="text-sm font-medium">Confirm Password</label>
                <div className="relative">
                  <input
                    type={regShowConfirmPassword ? "text" : "password"}
                    className="w-full border p-2 rounded-lg pr-11"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setRegShowConfirmPassword(!regShowConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <i className={regShowConfirmPassword ? "ri-eye-off-line" : "ri-eye-line"}></i>
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 flex justify-center"
                disabled={regLoading}
              >
                {regLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "Create Account"
                )}
              </button>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

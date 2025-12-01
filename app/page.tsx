'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Home() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [showLogoutNotification, setShowLogoutNotification] = useState(false);
  const router = useRouter();

  // 显示 logout 提示（来自 API）
  useEffect(() => {
    const logoutSuccess = localStorage.getItem('logoutSuccess');
    if (logoutSuccess === 'true') {
      setShowLogoutNotification(true);
      localStorage.removeItem('logoutSuccess');
      setTimeout(() => setShowLogoutNotification(false), 3000);
    }
  }, []);

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

    // 成功
    setShowSuccessNotification(true);

    setTimeout(() => router.push('/admin/dashboard'), 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 sm:p-8">
        <div className="text-center mb-6 sm:mb-8">
          <div className="mb-4 sm:mb-6">
            <Image
              src="/auth-icon.png"
              alt="Admin System Logo"
              width={80}
              height={80}
              className="mx-auto rounded-xl"
            />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">Admin Login</h1>
          <p className="text-xs sm:text-sm text-gray-600">Enter your credentials to access dashboard</p>
        </div>

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
    </div>
  );
}

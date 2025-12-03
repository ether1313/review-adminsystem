'use client';

import { useState } from 'react';

interface TopNavProps {
  onLogout: () => void;
}

export default function TopNav({ onLogout }: TopNavProps) {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleConfirmLogout = () => {
    setShowLogoutConfirm(false);
    onLogout();
  };

  const handleCancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <>
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <i className="ri-dashboard-line text-white text-base sm:text-lg w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center"></i>
              </div>
              <h1 className="text-base sm:text-xl font-bold text-gray-800 whitespace-nowrap">Admin Dashboard</h1>
            </div>
            
            <button
              onClick={handleLogoutClick}
              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-xs sm:text-sm font-medium whitespace-nowrap cursor-pointer"
            >
              Logout ➜]
            </button>
          </div>
        </div>
      </nav>

      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-5 sm:p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <i className="ri-logout-box-line text-red-600 text-xl w-5 h-5 flex items-center justify-center"></i>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Confirm Logout</h3>
            </div>
            
            <p className="text-sm text-gray-600 mb-5 sm:mb-6">
              Are you sure you want to logout?
            </p>
            
            <div className="flex gap-2.5 sm:gap-3">
              <button
                onClick={handleCancelLogout}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium whitespace-nowrap cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmLogout}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium whitespace-nowrap cursor-pointer"
              >
                Sure
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

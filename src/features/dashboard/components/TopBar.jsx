import React, { useState } from 'react';
import { Bell, Search, Menu, X, ChevronDown } from 'lucide-react';

const TopBar = ({ onMenuToggle, isSidebarOpen }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      {/* Left side - Menu toggle and search */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        
        <div className="hidden md:flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 min-w-96">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search employees, departments..."
            className="bg-transparent border-none outline-none flex-1"
          />
        </div>
      </div>

      {/* Right side - Notifications and profile */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg hover:bg-gray-100 relative"
          >
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              3
            </span>
          </button>
          
          {showNotifications && (
            <div className="absolute right-0 top-12 bg-white border rounded-lg shadow-lg w-80 z-50">
              <div className="p-4 border-b">
                <h3 className="font-semibold">Notifications</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                <div className="p-3 hover:bg-gray-50 border-b">
                  <p className="text-sm font-medium">New leave request</p>
                  <p className="text-xs text-gray-500">John Doe requested 3 days leave</p>
                </div>
                <div className="p-3 hover:bg-gray-50 border-b">
                  <p className="text-sm font-medium">Onboarding task due</p>
                  <p className="text-xs text-gray-500">Complete orientation for Jane Smith</p>
                </div>
                <div className="p-3 hover:bg-gray-50">
                  <p className="text-sm font-medium">Document uploaded</p>
                  <p className="text-xs text-gray-500">New contract uploaded for review</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100"
          >
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
              A
            </div>
            <ChevronDown size={16} />
          </button>

          {showProfile && (
            <div className="absolute right-0 top-12 bg-white border rounded-lg shadow-lg w-48 z-50">
              <div className="p-3 border-b">
                <p className="font-medium">Admin User</p>
                <p className="text-sm text-gray-500">admin@company.com</p>
              </div>
              <div className="py-2">
                <button className="w-full text-left px-3 py-2 hover:bg-gray-50">Profile</button>
                <button className="w-full text-left px-3 py-2 hover:bg-gray-50">Settings</button>
                <button className="w-full text-left px-3 py-2 hover:bg-gray-50 text-red-600">Logout</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopBar;
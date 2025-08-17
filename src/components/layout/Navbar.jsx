import { Bell, Globe, Search, User } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="bg-white shadow px-6 py-3 flex items-center justify-between">
      {/* Search */}
      <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 w-1/3">
        <Search className="text-gray-500 mr-2 w-4 h-4" />
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent w-full outline-none text-sm"
        />
      </div>

      {/* Right icons */}
      <div className="flex items-center space-x-6">
        <button className="relative">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
            3
          </span>
        </button>

        <button>
          <Globe className="w-5 h-5 text-gray-600" />
        </button>

        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-medium">Edgar</span>
        </div>
      </div>
    </nav>
  );
}

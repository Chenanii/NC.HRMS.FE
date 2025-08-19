import { Bell, Globe, Search, User, Menu } from "lucide-react";

export default function Navbar({ sidebarOpen, setSidebarOpen, isMobile }) {
  return (
    <nav className="bg-white shadow px-4 lg:px-6 py-3 flex items-center justify-between">
      {/* Mobile menu button and search */}
      <div className="flex items-center space-x-4 flex-1">
        {isMobile && (
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 rounded hover:bg-gray-200 transition-colors lg:hidden"
          >
            <Menu size={20} />
          </button>
        )}
        
        {/* Search */}
        <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 flex-1 max-w-md">
          <Search className="text-gray-500 mr-2 w-4 h-4" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent w-full outline-none text-sm"
          />
        </div>
      </div>

      {/* Right icons */}
      <div className="flex items-center space-x-3 lg:space-x-6">
        <button className="relative p-1 rounded hover:bg-gray-100">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
            3
          </span>
        </button>

        <button className="p-1 rounded hover:bg-gray-100 hidden sm:block">
          <Globe className="w-5 h-5 text-gray-600" />
        </button>

        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-medium hidden sm:block">Edgar</span>
        </div>
      </div>
    </nav>
  );
}
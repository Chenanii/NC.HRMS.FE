import React, { useState } from 'react';
import { 
  Users, 
  Building2, 
  Briefcase, 
  Calendar, 
  FileText, 
  UserCheck, 
  DollarSign, 
  BarChart3, 
  Settings, 
  Home,
  ChevronDown,
  Shield
} from 'lucide-react';
import { getUserPermissions } from '../../utilits/auth';

const getPermissions = () => {
  try {
    
    const permissionsInfo = getUserPermissions();
    console.log(permissionsInfo)
    return permissionsInfo || [];
  } catch {
    return [];
  }
};

const hasPermission = (permission) => {
  const permissions = getPermissions();
  return permissions.includes(permission);
};

const Sidebar = ({ isOpen, onClose, activeItem, onItemSelect }) => {
  const [expandedSections, setExpandedSections] = useState(['management']);

  const toggleSection = (section) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      path: '/dashboard',
      permission: 'analytics.dashboard'
    },
    {
      id: 'management',
      label: 'Management',
      icon: Users,
      isSection: true,
      children: [
        {
          id: 'employees',
          label: 'Employees',
          icon: Users,
          path: '/employees',
          permission: 'employees.view',
          badge: '124'
        },
        {
          id: 'departments',
          label: 'Departments',
          icon: Building2,
          path: '/departments',
          permission: 'departments.view'
        },
        {
          id: 'positions',
          label: 'Positions',
          icon: Briefcase,
          path: '/positions',
          permission: 'positions.view'
        }
      ]
    },
    {
      id: 'leave',
      label: 'Leave Management',
      icon: Calendar,
      isSection: true,
      children: [
        {
          id: 'leave-requests',
          label: 'Leave Requests',
          icon: Calendar,
          path: '/leave-requests',
          permission: 'leave.view_all',
          badge: '7'
        },
        {
          id: 'leave-types',
          label: 'Leave Types',
          icon: Calendar,
          path: '/leave-types',
          permission: 'leavetypes.view'
        }
      ]
    },
    {
      id: 'documents',
      label: 'Documents',
      icon: FileText,
      path: '/documents',
      permission: 'documents.view_all'
    },
    {
      id: 'onboarding',
      label: 'Onboarding',
      icon: UserCheck,
      isSection: true,
      children: [
        {
          id: 'onboarding-tasks',
          label: 'Tasks',
          icon: UserCheck,
          path: '/onboarding/tasks',
          permission: 'onboardingtasks.view'
        },
        {
          id: 'onboarding-templates',
          label: 'Templates',
          icon: FileText,
          path: '/onboarding/templates',
          permission: 'onboardingtemplates.view'
        }
      ]
    },
    {
      id: 'payroll',
      label: 'Payroll',
      icon: DollarSign,
      path: '/payroll',
      permission: 'payroll.view',
      badge: 'New'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      path: '/analytics',
      permission: 'analytics.view'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      isSection: true,
      children: [
        {
          id: 'users',
          label: 'Users',
          icon: Users,
          path: '/settings/users',
          permission: 'users.view'
        },
        {
          id: 'roles',
          label: 'Roles',
          icon: Shield,
          path: '/settings/roles',
          permission: 'roles.view'
        },
        {
          id: 'system',
          label: 'System',
          icon: Settings,
          path: '/settings/system',
          permission: 'settings.edit'
        }
      ]
    }
  ];

  const renderNavItem = (item, depth = 0) => {
    if (item.permission && !hasPermission(item.permission)) {
      return null;
    }

    if (item.isSection) {
      const isExpanded = expandedSections.includes(item.id);
      const hasVisibleChildren = item.children?.some(child => 
        !child.permission || hasPermission(child.permission)
      );

      if (!hasVisibleChildren) return null;

      return (
        <div key={item.id}>
          <button
            onClick={() => toggleSection(item.id)}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left hover:bg-gray-100 ${
              depth > 0 ? 'ml-4' : ''
            }`}
          >
            <div className="flex items-center gap-3">
              <item.icon size={20} className="text-gray-600" />
              <span className="font-medium text-gray-700">{item.label}</span>
            </div>
            <ChevronDown 
              size={16} 
              className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            />
          </button>
          {isExpanded && item.children && (
            <div className="mt-1">
              {item.children.map(child => renderNavItem(child, depth + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <button
        key={item.id}
        onClick={() => onItemSelect && onItemSelect(item.id)}
        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left hover:bg-gray-100 ${
          activeItem === item.id ? 'bg-blue-50 border-r-4 border-blue-500' : ''
        } ${depth > 0 ? 'ml-4' : ''}`}
      >
        <div className="flex items-center gap-3">
          <item.icon 
            size={20} 
            className={activeItem === item.id ? 'text-blue-600' : 'text-gray-600'} 
          />
          <span className={`${activeItem === item.id ? 'text-blue-700 font-medium' : 'text-gray-700'}`}>
            {item.label}
          </span>
        </div>
        {item.badge && (
          <span className={`px-2 py-1 text-xs rounded-full ${
            item.badge === 'New' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-600'
          }`}>
            {item.badge}
          </span>
        )}
      </button>
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        {/* Logo */}
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800">NC.HRMS Pro</h1>
          <p className="text-sm text-gray-500">Human Resources</p>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-80px)]">
          {navigationItems.map(item => renderNavItem(item))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
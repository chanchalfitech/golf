import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  MapPin,
  Users,
  UserCheck,
  UserPlus,
  MessageSquare,
  User,
  Layers,
  LayoutDashboard,
  Menu,
  X
} from 'lucide-react';

const menuItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/levels', icon: Layers, label: 'Levels' }, 
  { path: '/clubs', icon: MapPin, label: 'Golf Clubs' },
  { path: '/coaches', icon: Users, label: 'Coaches' },
  { path: '/coach-club-requests', icon: UserCheck, label: 'Coach-Club Requests' },
  { path: '/coach-verification', icon: UserPlus, label: 'Coach Verification' },
  { path: '/pupil-coach-requests', icon: MessageSquare, label: 'Pupil-Coach Requests' },
  { path: '/pupils', icon: User, label: 'Pupils' },
];

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">Golf Admin</h1>
          <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>
        <nav className="mt-6 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-3 mb-1 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  isActive
                    ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main content */}
      <div className="lg:ml-64">
        <div className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center px-6">
          <button
            className="lg:hidden mr-4"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-6 h-6 text-gray-400" />
          </button>
          <h2 className="text-xl font-semibold text-gray-800">
            {menuItems.find((item) => item.path === location.pathname)?.label ||
              'Dashboard'}
          </h2>
        </div>

        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}

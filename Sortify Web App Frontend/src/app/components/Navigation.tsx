import { Link, useLocation } from 'react-router';
import { Scan, Map, Trophy, User, LogOut, Leaf } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';

export function Navigation() {
  const location = useLocation();
  const { user, logout } = useApp();

  const navItems = [
    { path: '/scan', label: 'Scan', icon: Scan },
    { path: '/map', label: 'Map', icon: Map },
    { path: '/leaderboard', label: 'Leaderboard', icon: Trophy },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/scan" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900">Sortify</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-green-50 text-green-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}

            {/* User Avatar & Logout */}
            <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-200">
              <div className="flex items-center gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-green-500 text-white text-sm">
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <div className="text-sm font-medium text-gray-900">{user?.username}</div>
                  <div className="text-xs text-gray-500">{user?.points} pts</div>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-gray-600 hover:text-red-600"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

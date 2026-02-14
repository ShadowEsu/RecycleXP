import { Link, useLocation } from 'react-router';
import { Scan, MapPin, Trophy, User, LogOut, Recycle } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user, logout } = useApp();
  const location = useLocation();

  const navItems = [
    { path: '/scan', label: 'Scan', icon: Scan },
    { path: '/map', label: 'Map', icon: MapPin },
    { path: '/leaderboard', label: 'Leaderboard', icon: Trophy },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-emerald-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/scan" className="flex items-center gap-2 group">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2 rounded-lg group-hover:scale-105 transition-transform">
                <Recycle className="size-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Sortify
              </span>
            </Link>

            {/* Navigation Links */}
            <div className="flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="size-4" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>

            {/* User Section */}
            <div className="flex items-center gap-4">
              {user && (
                <>
                  <div className="text-right hidden sm:block">
                    <div className="text-sm font-medium text-gray-900">{user.username}</div>
                    <div className="text-xs text-emerald-600 font-semibold">{user.points} points</div>
                  </div>
                  <Avatar>
                    <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
                      {user.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={logout}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <LogOut className="size-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}

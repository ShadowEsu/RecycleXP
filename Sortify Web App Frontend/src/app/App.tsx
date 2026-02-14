import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { AppProvider, useApp } from './contexts/AppContext';
import { Navigation } from './components/Navigation';
import { AuthPage } from './pages/AuthPage';
import { ScanPage } from './pages/ScanPage';
import { MapPage } from './pages/MapPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { ProfilePage } from './pages/ProfilePage';

function AppRoutes() {
  const { isAuthenticated } = useApp();

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <Routes>
        <Route path="/" element={<Navigate to="/scan" replace />} />
        <Route path="/scan" element={<ScanPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/scan" replace />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  );
}

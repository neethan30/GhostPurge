
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Users from './components/Users';
import Settings from './components/Settings';
import Reports from './components/Reports';
import Header from './components/Header';
import Admin from './components/Admin';

export type View = 'dashboard' | 'users' | 'settings' | 'reports' | 'admin';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'users':
        return <Users />;
      case 'settings':
        return <Settings />;
      case 'reports':
        return <Reports />;
      // Admin view is now handled by the main layout conditional rendering
      default:
        return <Dashboard />;
    }
  };
  
  const viewTitles: Record<View, string> = {
    dashboard: 'Dashboard',
    users: 'User Management',
    settings: 'Settings',
    reports: 'Reports & Exports',
    admin: 'Administration' // This title is passed to the header, but the header isn't shown for the new Admin layout
  }

  if (currentView === 'admin') {
    return <Admin setCurrentView={setCurrentView} />;
  }

  return (
    <div className="flex h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={viewTitles[currentView]} setCurrentView={setCurrentView} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-100 dark:bg-slate-900 p-4 sm:p-6 md:p-8">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default App;
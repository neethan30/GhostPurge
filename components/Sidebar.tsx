import React from 'react';
import type { View } from '../App';
import { DashboardIcon, UsersIcon, SettingsIcon, ReportsIcon, AppLogo } from './icons';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
  // FIX: Replaced JSX.Element with React.ReactElement to resolve "Cannot find namespace 'JSX'" error.
  const navItems: { id: View; label: string; icon: React.ReactElement }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { id: 'users', label: 'Users', icon: <UsersIcon /> },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon /> },
    { id: 'reports', label: 'Reports', icon: <ReportsIcon /> },
  ];

  return (
    <aside className="w-64 flex-shrink-0 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col">
      <div className="h-16 flex items-center justify-center px-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <AppLogo />
          <h1 className="text-xl font-bold text-slate-800 dark:text-white">Deprovision</h1>
        </div>
      </div>
      <nav className="flex-1 px-4 py-4">
        <ul>
          {navItems.map((item) => (
            <li key={item.id}>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentView(item.id);
                }}
                className={`flex items-center px-4 py-2 my-1 rounded-md text-sm font-medium transition-colors duration-200 ${
                  currentView === item.id
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-slate-200 dark:border-slate-700">
        <div className="flex items-center">
            <img className="h-10 w-10 rounded-full" src="https://i.pravatar.cc/150?u=admin" alt="Admin user" />
            <div className="ml-3">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">IT Admin</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">admin@enterprise.com</p>
            </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
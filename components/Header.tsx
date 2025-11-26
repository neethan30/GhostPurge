
import React from 'react';
import type { View } from '../App';
import { ShieldIcon } from './icons';

interface HeaderProps {
    title: string;
    setCurrentView: (view: View) => void;
}

const Header: React.FC<HeaderProps> = ({ title, setCurrentView }) => {
    return (
        <header className="h-16 flex-shrink-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-4 sm:px-6 md:px-8">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">{title}</h2>
            <div>
                 <button
                    onClick={() => setCurrentView('admin')}
                    className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                >
                    <ShieldIcon />
                    Admin
                </button>
            </div>
        </header>
    );
}

export default Header;

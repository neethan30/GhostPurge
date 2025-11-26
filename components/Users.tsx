
import React, { useState, useMemo } from 'react';
import useMockData from '../hooks/useMockData';
import { User, ServiceName, UserStatus } from '../types';
import { MicrosoftIcon, GoogleIcon, SlackIcon, HubspotIcon, JiraIcon, SalesforceIcon, ServiceNowIcon, FilterIcon, SortAscIcon, SortDescIcon } from './icons';

// FIX: Replaced JSX.Element with React.ReactElement to resolve "Cannot find namespace 'JSX'" error.
const serviceIcons: Record<ServiceName, React.ReactElement> = {
    [ServiceName.Microsoft]: <MicrosoftIcon />,
    [ServiceName.Google]: <GoogleIcon />,
    [ServiceName.Slack]: <SlackIcon />,
    [ServiceName.Hubspot]: <HubspotIcon />,
    [ServiceName.Jira]: <JiraIcon />,
    [ServiceName.Salesforce]: <SalesforceIcon />,
    [ServiceName.ServiceNow]: <ServiceNowIcon />,
};

const statusColors: Record<UserStatus, string> = {
    [UserStatus.Active]: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    [UserStatus.Inactive]: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
    [UserStatus.PendingDeactivation]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
};

type SortKey = keyof User;
type SortDirection = 'asc' | 'desc';

const Users: React.FC = () => {
    const { users } = useMockData();
    const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set());
    const [filterService, setFilterService] = useState<string>('all');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortKey, setSortKey] = useState<SortKey>('lastActive');
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
    const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            const allUserIds = filteredUsers.map(u => u.id);
            setSelectedUserIds(new Set(allUserIds));
        } else {
            setSelectedUserIds(new Set());
        }
    };

    const handleSelectUser = (userId: string) => {
        const newSelection = new Set(selectedUserIds);
        if (newSelection.has(userId)) {
            newSelection.delete(userId);
        } else {
            newSelection.add(userId);
        }
        setSelectedUserIds(newSelection);
    };

    const handleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortDirection('asc');
        }
    };

    const filteredUsers = useMemo(() => {
        return users
            .filter(user => filterService === 'all' || user.service === filterService)
            .filter(user => filterStatus === 'all' || user.status === filterStatus)
            .filter(user =>
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .sort((a, b) => {
                const aVal = a[sortKey];
                const bVal = b[sortKey];
                if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
                return 0;
            });
    }, [users, filterService, filterStatus, searchTerm, sortKey, sortDirection]);
    
    const timeSince = (date: Date) => {
        const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " years ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " months ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " days ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " hours ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " minutes ago";
        return Math.floor(seconds) + " seconds ago";
    };

    const openDeactivateModal = () => {
        if (selectedUserIds.size > 0) {
            setIsDeactivateModalOpen(true);
        }
    }

    const confirmDeactivation = () => {
        alert(`Deactivating ${selectedUserIds.size} user(s). This is a prototype action.`);
        setIsDeactivateModalOpen(false);
        setSelectedUserIds(new Set());
    }

    return (
        <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-lg shadow-md">
            {/* Filters and Actions */}
            <div className="mb-4 space-y-4 md:space-y-0 md:flex md:justify-between md:items-center">
                <div className="flex items-center space-x-2 flex-wrap gap-2">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="pl-8 pr-2 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                        <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-slate-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path></svg>
                        </div>
                    </div>
                     <select value={filterService} onChange={e => setFilterService(e.target.value)} className="border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-sm py-2 px-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="all">All Services</option>
                        {Object.values(ServiceName).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-sm py-2 px-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="all">All Statuses</option>
                        {Object.values(UserStatus).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <div>
                     {selectedUserIds.size > 0 && (
                        <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium">{selectedUserIds.size} selected</span>
                             <button className="px-3 py-2 text-sm font-medium text-white bg-yellow-500 rounded-md hover:bg-yellow-600">Send Notification</button>
                            <button onClick={openDeactivateModal} className="px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700">Deactivate</button>
                        </div>
                    )}
                </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-300">
                        <tr>
                            <th scope="col" className="p-4"><input type="checkbox" onChange={handleSelectAll} checked={selectedUserIds.size > 0 && selectedUserIds.size === filteredUsers.length} className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"/></th>
                            <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => handleSort('name')}>
                                <div className="flex items-center">Name {sortKey === 'name' && (sortDirection === 'asc' ? <SortAscIcon/> : <SortDescIcon/>)}</div>
                            </th>
                            <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => handleSort('service')}>
                                <div className="flex items-center">Service {sortKey === 'service' && (sortDirection === 'asc' ? <SortAscIcon/> : <SortDescIcon/>)}</div>
                            </th>
                            <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => handleSort('lastActive')}>
                                <div className="flex items-center">Last Active {sortKey === 'lastActive' && (sortDirection === 'asc' ? <SortAscIcon/> : <SortDescIcon/>)}</div>
                            </th>
                            <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => handleSort('status')}>
                                <div className="flex items-center">Status {sortKey === 'status' && (sortDirection === 'asc' ? <SortAscIcon/> : <SortDescIcon/>)}</div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user.id} className="bg-white border-b dark:bg-slate-800 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600">
                                <td className="w-4 p-4"><input type="checkbox" checked={selectedUserIds.has(user.id)} onChange={() => handleSelectUser(user.id)} className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" /></td>
                                <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap dark:text-white">
                                    <div className="flex items-center">
                                        <img className="w-8 h-8 rounded-full mr-3" src={user.avatar} alt={user.name} />
                                        <div>
                                            <div>{user.name}</div>
                                            <div className="text-xs text-slate-500">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        {serviceIcons[user.service]}
                                        {user.service}
                                    </div>
                                </td>
                                <td className="px-6 py-4">{timeSince(user.lastActive)}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[user.status]}`}>
                                        {user.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

             {isDeactivateModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-md">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Confirm Deactivation</h3>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                            Are you sure you want to deactivate {selectedUserIds.size} selected user(s)? This action cannot be undone.
                        </p>
                        <div className="mt-6 flex justify-end space-x-3">
                            <button onClick={() => setIsDeactivateModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600">
                                Cancel
                            </button>
                            <button onClick={confirmDeactivation} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700">
                                Deactivate
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Users;

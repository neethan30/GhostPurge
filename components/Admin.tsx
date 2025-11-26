import React, { useState, useMemo } from 'react';
import type { View } from '../App';
import { UsersIcon, ShieldIcon, KeyIcon, MailIcon, AppLogo, ArrowLeftOnRectangleIcon, BuildingLibraryIcon, PencilSquareIcon, TrashIcon, UserGroupIcon, EyeIcon, EyeOffIcon, CheckCircleIcon, NoSymbolIcon, ClipboardDocumentListIcon, DevicePhoneMobileIcon, GlobeAltIcon, ClockIcon } from './icons';

type AdminView = 'userManagement' | 'securityRoles' | 'authentication' | 'emailServices' | 'auditLog';

interface AdminProps {
  setCurrentView: (view: View) => void;
}

// --- Data Structures ---

// User Management
type AdminUserStatus = 'Active' | 'Inactive';
interface AdminUser {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    timezone: string;
    roleId: string;
    status: AdminUserStatus;
}

// Security Roles (RBAC)
interface Permissions {
    dashboard: { view: boolean; generateInsights: boolean; };
    users: { view: boolean; filter: boolean; notify: boolean; deactivate: boolean; };
    settings: { view: boolean; manageConnections: boolean; configureConnections: boolean; };
    reports: { view: boolean; export: boolean; };
}

interface SecurityRole {
    id: string;
    name: string;
    description: string;
    permissions: Permissions;
    isDefault?: boolean;
}

// Authentication
type AuthMethod = 'local' | 'sso';
interface SSOProvider {
    id: string;
    name: string;
    signInUrl: string;
    issuerId: string;
    certificate: string;
}

interface SecuritySettings {
    mfaRequired: boolean;
    ipWhitelistEnabled: boolean;
    allowedIPs: string;
    sessionTimeout: number; // in minutes
}

// Audit Log
type AuditAction = 'USER_CREATED' | 'USER_UPDATED' | 'USER_DELETED' | 'USER_STATUS_CHANGED' | 'ROLE_CREATED' | 'ROLE_UPDATED' | 'ROLE_DELETED' | 'SSO_PROVIDER_CREATED' | 'SSO_PROVIDER_UPDATED' | 'SSO_PROVIDER_DELETED' | 'AUTH_METHOD_CHANGED' | 'SECURITY_POLICY_UPDATED';

interface AuditLogEntry {
    id: string;
    timestamp: Date;
    adminUserEmail: string;
    action: AuditAction;
    details: string;
}

// --- Initial Mock Data ---

const allPermissionsFalse: Permissions = {
    dashboard: { view: false, generateInsights: false },
    users: { view: false, filter: false, notify: false, deactivate: false },
    settings: { view: false, manageConnections: false, configureConnections: false },
    reports: { view: false, export: false },
};

const allPermissionsTrue: Permissions = {
    dashboard: { view: true, generateInsights: true },
    users: { view: true, filter: true, notify: true, deactivate: true },
    settings: { view: true, manageConnections: true, configureConnections: true },
    reports: { view: true, export: true },
};

const initialRoles: SecurityRole[] = [
    {
        id: 'role-default-admin',
        name: 'Default Admin',
        description: 'Has unrestricted access to all features and settings.',
        permissions: allPermissionsTrue,
        isDefault: true,
    },
    {
        id: 'role-viewer',
        name: 'Viewer',
        description: 'Can view dashboards and reports but cannot make changes.',
        permissions: { ...allPermissionsFalse, dashboard: { view: true, generateInsights: false }, reports: { view: true, export: false } },
    }
];

const initialAdminUsers: AdminUser[] = [
    { id: 'admin-1', firstName: 'IT', lastName: 'Admin', email: 'admin@enterprise.com', timezone: 'America/New_York', roleId: 'role-default-admin', status: 'Active' },
    { id: 'admin-2', firstName: 'Compliance', lastName: 'Officer', email: 'compliance@enterprise.com', timezone: 'Europe/London', roleId: 'role-viewer', status: 'Active' },
    { id: 'admin-3', firstName: 'Archived', lastName: 'Admin', email: 'old.admin@enterprise.com', timezone: 'America/Los_Angeles', roleId: 'role-viewer', status: 'Inactive' },
];

const initialSSOProviders: SSOProvider[] = [
    { id: 'sso-1', name: 'Okta Production', signInUrl: 'https://your-company.okta.com/app/your-app/sso/saml', issuerId: 'http://www.okta.com/exk1234567890', certificate: 'MIIDpDCCAoygAwIBAgIGAVV... (truncated)' }
];

const initialSecuritySettings: SecuritySettings = {
    mfaRequired: false,
    ipWhitelistEnabled: true,
    allowedIPs: '203.0.113.1\n198.51.100.0/24\n2001:db8::/32',
    sessionTimeout: 30,
};

const initialAuditLogs: AuditLogEntry[] = [
    { id: 'log-1', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), adminUserEmail: 'admin@enterprise.com', action: 'USER_CREATED', details: 'Created new user compliance@enterprise.com with role Viewer.'},
    { id: 'log-2', timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), adminUserEmail: 'admin@enterprise.com', action: 'ROLE_UPDATED', details: 'Updated permissions for the Viewer role.'},
    { id: 'log-3', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), adminUserEmail: 'admin@enterprise.com', action: 'AUTH_METHOD_CHANGED', details: 'Switched authentication method to Single Sign-On (SSO).'},
];


const timezones = [
    'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
    'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Asia/Tokyo', 'Australia/Sydney'
];

// --- Sub-components for Admin Panel ---

const AdminSidebar: React.FC<{
    adminView: AdminView;
    setAdminView: (view: AdminView) => void;
    onBackToApp: () => void;
}> = ({ adminView, setAdminView, onBackToApp }) => {
    const navItems: { id: AdminView; label: string; icon: React.ReactElement }[] = [
        { id: 'userManagement', label: 'User Management', icon: <UsersIcon /> },
        { id: 'securityRoles', label: 'Security Roles', icon: <UserGroupIcon /> },
        { id: 'authentication', label: 'Authentication', icon: <KeyIcon /> },
        { id: 'auditLog', label: 'Audit Log', icon: <ClipboardDocumentListIcon /> },
        { id: 'emailServices', label: 'Email Services', icon: <MailIcon /> },
    ];

    return (
        <aside className="w-64 flex-shrink-0 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col">
            <div className="h-16 flex items-center justify-center px-4 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2">
                    <AppLogo />
                    <h1 className="text-xl font-bold text-slate-800 dark:text-white">Admin Panel</h1>
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
                                    setAdminView(item.id);
                                }}
                                className={`flex items-center px-4 py-2 my-1 rounded-md text-sm font-medium transition-colors duration-200 ${
                                    adminView === item.id
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
                <button
                    onClick={onBackToApp}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                    <ArrowLeftOnRectangleIcon />
                    Back to App
                </button>
            </div>
        </aside>
    );
};

const AdminHeader: React.FC<{ title: string }> = ({ title }) => (
    <header className="h-16 flex-shrink-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-4 sm:px-6 md:px-8">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">{title}</h2>
        <div className="flex items-center">
            <img className="h-9 w-9 rounded-full" src="https://i.pravatar.cc/150?u=admin" alt="Admin user" />
            <div className="ml-3">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">IT Admin</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">admin@enterprise.com</p>
            </div>
        </div>
    </header>
);

const PlaceholderPage: React.FC<{ title: string; description: string }> = ({ title, description }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{title}</h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>
        <div className="mt-6 text-center py-10 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg">
            <p className="text-slate-500 dark:text-slate-400">Configuration for {title} will be available here.</p>
        </div>
    </div>
);


// --- User Management Component ---

const UserFormModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (user: AdminUser, password?: string) => void;
    user: Partial<AdminUser> | null;
    roles: SecurityRole[];
}> = ({ isOpen, onClose, onSave, user, roles }) => {
    const [formData, setFormData] = useState<Partial<AdminUser>>({});
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    
    React.useEffect(() => {
        if (user) setFormData(user);
        else setFormData({ timezone: timezones[0], roleId: roles.find(r => !r.isDefault)?.id || roles[0]?.id, status: 'Active' });
        setPassword('');
        setConfirmPassword('');
    }, [user, isOpen, roles]);

    if (!isOpen) return null;

    const isNewUser = !formData.id;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }
        if (isNewUser && !password) {
            alert("Password is required for new users.");
            return;
        }
        onSave(formData as AdminUser, password);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-lg">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{isNewUser ? 'Add New User' : 'Edit User'}</h3>
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" name="firstName" placeholder="First Name" value={formData.firstName || ''} onChange={handleChange} required className="rounded-md border-slate-300 dark:border-slate-600 shadow-sm sm:text-sm bg-white dark:bg-slate-700" />
                        <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName || ''} onChange={handleChange} required className="rounded-md border-slate-300 dark:border-slate-600 shadow-sm sm:text-sm bg-white dark:bg-slate-700" />
                    </div>
                    <input type="email" name="email" placeholder="Email Address" value={formData.email || ''} onChange={handleChange} required className="w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm sm:text-sm bg-white dark:bg-slate-700" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <select name="timezone" value={formData.timezone} onChange={handleChange} className="w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm sm:text-sm bg-white dark:bg-slate-700">
                            {timezones.map(tz => <option key={tz} value={tz}>{tz}</option>)}
                        </select>
                         <select name="roleId" value={formData.roleId} onChange={handleChange} className="w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm sm:text-sm bg-white dark:bg-slate-700">
                            {roles.map(role => <option key={role.id} value={role.id}>{role.name}</option>)}
                        </select>
                    </div>
                     <div>
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{isNewUser ? 'Set Password' : 'Reset Password (optional)'}</label>
                        <div className="relative">
                           <input type={showPassword ? 'text' : 'password'} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full mt-1 rounded-md border-slate-300 dark:border-slate-600 shadow-sm sm:text-sm bg-white dark:bg-slate-700" />
                           <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-500">{showPassword ? <EyeOffIcon/> : <EyeIcon/>}</button>
                        </div>
                        <input type={showPassword ? 'text' : 'password'} placeholder="Confirm Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full mt-2 rounded-md border-slate-300 dark:border-slate-600 shadow-sm sm:text-sm bg-white dark:bg-slate-700" />
                    </div>
                    <div className="mt-6 flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600">Cancel</button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">Save User</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const UserManagementSettings: React.FC<{ users: AdminUser[], setUsers: React.Dispatch<React.SetStateAction<AdminUser[]>>, roles: SecurityRole[], logAction: (action: AuditAction, details: string) => void }> = ({ users, setUsers, roles, logAction }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<Partial<AdminUser> | null>(null);

    const handleAddUser = () => {
        setEditingUser(null);
        setIsModalOpen(true);
    };

    const handleEditUser = (user: AdminUser) => {
        setEditingUser(user);
        setIsModalOpen(true);
    };

    const handleSaveUser = (user: AdminUser, password?: string) => {
        const getRoleName = (roleId: string) => roles.find(r => r.id === roleId)?.name || 'Unknown Role';
        if (user.id) {
            setUsers(users.map(u => u.id === user.id ? user : u));
            logAction('USER_UPDATED', `Updated user ${user.email}.`);
            if(password) logAction('USER_UPDATED', `Reset password for user ${user.email}.`);
        } else {
            const newUser = { ...user, id: `admin-${Date.now()}` };
            setUsers([...users, newUser]);
            logAction('USER_CREATED', `Created new user ${newUser.email} with role '${getRoleName(newUser.roleId)}'.`);
        }
        setIsModalOpen(false);
    };

    const handleDeleteUser = (userId: string) => {
        const user = users.find(u => u.id === userId);
        if (user && window.confirm(`Are you sure you want to delete ${user.firstName} ${user.lastName}?`)) {
            setUsers(users.filter(u => u.id !== userId));
            logAction('USER_DELETED', `Deleted user ${user.email}.`);
        }
    };
    
    const handleToggleStatus = (userId: string) => {
        let userEmail = '';
        let newStatus: AdminUserStatus = 'Active';
        setUsers(users.map(u => {
            if (u.id === userId) {
                userEmail = u.email;
                newStatus = u.status === 'Active' ? 'Inactive' : 'Active';
                return { ...u, status: newStatus };
            }
            return u;
        }));
        if(userEmail) logAction('USER_STATUS_CHANGED', `Changed status of ${userEmail} to ${newStatus}.`);
    }
    
    const getRoleName = (roleId: string) => roles.find(r => r.id === roleId)?.name || 'Unknown Role';

    return (
        <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-lg shadow-md">
            <UserFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveUser} user={editingUser} roles={roles} />
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Application Users</h3>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Manage administrators and users of this application.</p>
                </div>
                <button onClick={handleAddUser} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">Add User</button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-300">
                        <tr>
                            <th className="px-6 py-3">Name</th>
                            <th className="px-6 py-3">Email</th>
                            <th className="px-6 py-3">Role</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                             <tr key={user.id} className="bg-white border-b dark:bg-slate-800 dark:border-slate-700">
                                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{user.firstName} {user.lastName}</td>
                                <td className="px-6 py-4">{user.email}</td>
                                <td className="px-6 py-4">{getRoleName(user.roleId)}</td>
                                <td className="px-6 py-4">
                                     <span className={`px-2 py-1 text-xs font-medium rounded-full ${user.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-slate-200 text-slate-800 dark:bg-slate-600 dark:text-slate-200'}`}>
                                        {user.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    <button onClick={() => handleToggleStatus(user.id)} className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-100 dark:hover:bg-slate-700 rounded-md" title={user.status === 'Active' ? 'Deactivate' : 'Activate'}>
                                        {user.status === 'Active' ? <NoSymbolIcon /> : <CheckCircleIcon />}
                                    </button>
                                     <button onClick={() => handleEditUser(user)} className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-100 dark:hover:bg-slate-700 rounded-md" title="Edit"><PencilSquareIcon /></button>
                                     <button onClick={() => handleDeleteUser(user.id)} className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-slate-700 rounded-md" title="Delete"><TrashIcon /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// --- Security Roles (RBAC) Component ---

const PermissionCheckbox: React.FC<{ label: string; description: string; checked: boolean; onChange: (checked: boolean) => void; disabled?: boolean; }> = ({ label, description, checked, onChange, disabled }) => (
    <div className="relative flex items-start">
        <div className="flex items-center h-5">
            <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} disabled={disabled} className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-slate-300 rounded" />
        </div>
        <div className="ml-3 text-sm">
            <label className="font-medium text-slate-700 dark:text-slate-200">{label}</label>
            <p className="text-slate-500 dark:text-slate-400">{description}</p>
        </div>
    </div>
);

const SecurityRolesSettings: React.FC<{ roles: SecurityRole[], setRoles: React.Dispatch<React.SetStateAction<SecurityRole[]>>, logAction: (action: AuditAction, details: string) => void }> = ({ roles, setRoles, logAction }) => {
    const [selectedRoleId, setSelectedRoleId] = useState<string>(roles[0].id);

    const selectedRole = roles.find(r => r.id === selectedRoleId) || null;

    const handlePermissionChange = <K extends keyof Permissions>(group: K, permission: keyof Permissions[K], value: boolean) => {
        if (!selectedRole || selectedRole.isDefault) return;
        const updatedRole = {
            ...selectedRole,
            permissions: { ...selectedRole.permissions, [group]: { ...selectedRole.permissions[group], [permission]: value } }
        };
        setRoles(roles.map(r => r.id === selectedRole.id ? updatedRole : r));
        logAction('ROLE_UPDATED', `Updated permissions for role '${selectedRole.name}'.`);
    };
    
    const handleAddRole = () => {
        const newRoleName = prompt("Enter the name for the new role:");
        if (newRoleName) {
            const newRole: SecurityRole = { id: `role-${Date.now()}`, name: newRoleName, description: 'A custom role.', permissions: allPermissionsFalse };
            setRoles([...roles, newRole]);
            setSelectedRoleId(newRole.id);
            logAction('ROLE_CREATED', `Created new role '${newRoleName}'.`);
        }
    };
    
    const handleDeleteRole = (roleId: string) => {
        const roleToDelete = roles.find(r => r.id === roleId);
        if (roleToDelete && !roleToDelete.isDefault && window.confirm(`Are you sure you want to delete the "${roleToDelete.name}" role?`)) {
            const newRoles = roles.filter(r => r.id !== roleId);
            setRoles(newRoles);
            logAction('ROLE_DELETED', `Deleted role '${roleToDelete.name}'.`);
            if (selectedRoleId === roleId) setSelectedRoleId(newRoles[0]?.id || '');
        }
    };

    return (
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md">
                 <div className="flex justify-between items-center mb-4">
                     <h4 className="font-semibold text-slate-900 dark:text-white">Roles</h4>
                    <button onClick={handleAddRole} className="px-2 py-1 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">Add Role</button>
                </div>
                <ul className="space-y-1">
                    {roles.map(role => (
                        <li key={role.id}>
                            <a href="#" onClick={(e) => { e.preventDefault(); setSelectedRoleId(role.id); }}
                                className={`block p-2 rounded-md ${selectedRoleId === role.id ? 'bg-blue-100 dark:bg-blue-900/50' : 'hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
                                <div className="flex justify-between items-center">
                                    <span className="font-medium text-sm text-slate-800 dark:text-slate-200">{role.name}</span>
                                    {!role.isDefault && (
                                        <button onClick={(e) => { e.stopPropagation(); handleDeleteRole(role.id); }} className="p-1 text-slate-400 hover:text-red-600 rounded-full hover:bg-red-100 dark:hover:bg-slate-600">
                                            <TrashIcon className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                                <p className="text-xs text-slate-500">{role.description}</p>
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="md:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
                {selectedRole ? (
                    <div>
                        <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{selectedRole.name} Permissions</h3>
                        <p className="mt-1 mb-6 text-sm text-slate-500 dark:text-slate-400">
                            {selectedRole.isDefault ? 'This is the default administrator role. Its permissions cannot be changed.' : 'Select the permissions for this role.'}
                        </p>
                        <div className="space-y-8">
                           <div>
                                <h4 className="font-semibold border-b border-slate-200 dark:border-slate-700 pb-2 mb-3">Dashboard</h4>
                                <div className="space-y-3">
                                    <PermissionCheckbox label="View Dashboard" description="Can view the main dashboard and stats." checked={selectedRole.permissions.dashboard.view} onChange={v => handlePermissionChange('dashboard', 'view', v)} disabled={selectedRole.isDefault} />
                                    <PermissionCheckbox label="Generate AI Insights" description="Can use the AI feature to generate insights." checked={selectedRole.permissions.dashboard.generateInsights} onChange={v => handlePermissionChange('dashboard', 'generateInsights', v)} disabled={selectedRole.isDefault} />
                                </div>
                            </div>
                             <div>
                                <h4 className="font-semibold border-b border-slate-200 dark:border-slate-700 pb-2 mb-3">Users</h4>
                                <div className="space-y-3">
                                    <PermissionCheckbox label="View Users List" description="Can see the list of all users from connected services." checked={selectedRole.permissions.users.view} onChange={v => handlePermissionChange('users', 'view', v)} disabled={selectedRole.isDefault} />
                                    <PermissionCheckbox label="Filter & Search Users" description="Can use search and filter controls on the users page." checked={selectedRole.permissions.users.filter} onChange={v => handlePermissionChange('users', 'filter', v)} disabled={selectedRole.isDefault} />
                                    <PermissionCheckbox label="Send Notifications to Users" description="Can send reminder notifications to users." checked={selectedRole.permissions.users.notify} onChange={v => handlePermissionChange('users', 'notify', v)} disabled={selectedRole.isDefault} />
                                    <PermissionCheckbox label="Deactivate Users" description="Can perform the deactivation action for users." checked={selectedRole.permissions.users.deactivate} onChange={v => handlePermissionChange('users', 'deactivate', v)} disabled={selectedRole.isDefault} />
                                </div>
                            </div>
                             <div>
                                <h4 className="font-semibold border-b border-slate-200 dark:border-slate-700 pb-2 mb-3">Settings</h4>
                                <div className="space-y-3">
                                    <PermissionCheckbox label="View Connections" description="Can see the list of configured service connections." checked={selectedRole.permissions.settings.view} onChange={v => handlePermissionChange('settings', 'view', v)} disabled={selectedRole.isDefault} />
                                    <PermissionCheckbox label="Add/Delete Connections" description="Can create new service connections and delete existing ones." checked={selectedRole.permissions.settings.manageConnections} onChange={v => handlePermissionChange('settings', 'manageConnections', v)} disabled={selectedRole.isDefault} />
                                    <PermissionCheckbox label="Configure Connections" description="Can edit credentials and inactivity rules for connections." checked={selectedRole.permissions.settings.configureConnections} onChange={v => handlePermissionChange('settings', 'configureConnections', v)} disabled={selectedRole.isDefault} />
                                </div>
                            </div>
                             <div>
                                <h4 className="font-semibold border-b border-slate-200 dark:border-slate-700 pb-2 mb-3">Reports</h4>
                                <div className="space-y-3">
                                    <PermissionCheckbox label="View Reports Page" description="Can access the reports and exports page." checked={selectedRole.permissions.reports.view} onChange={v => handlePermissionChange('reports', 'view', v)} disabled={selectedRole.isDefault} />
                                    <PermissionCheckbox label="Export Reports" description="Can generate and download all available reports." checked={selectedRole.permissions.reports.export} onChange={v => handlePermissionChange('reports', 'export', v)} disabled={selectedRole.isDefault} />
                                </div>
                            </div>
                        </div>
                    </div>
                ) : <div className="text-center py-20"><p className="text-slate-500">Select a role to view its permissions.</p></div>}
            </div>
        </div>
    );
};

// --- Authentication Settings Component ---

const ToggleSwitch: React.FC<{ enabled: boolean, onChange: (enabled: boolean) => void }> = ({ enabled, onChange }) => (
    <button
        type="button"
        className={`${enabled ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-600'} relative inline-flex items-center h-6 rounded-full w-11 transition-colors`}
        onClick={() => onChange(!enabled)}
    >
        <span className={`${enabled ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full transition-transform`} />
    </button>
);


const SSOProviderForm: React.FC<{ provider: Partial<SSOProvider> | null, onSave: (provider: SSOProvider) => void, onCancel: () => void }> = ({ provider, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Partial<SSOProvider>>(provider || { name: '', signInUrl: '', issuerId: '', certificate: '' });
    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); if (formData.name && formData.signInUrl && formData.issuerId && formData.certificate) { onSave({ id: formData.id || `sso-${Date.now()}`, ...formData } as SSOProvider); }};
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    return (
        <form onSubmit={handleSubmit} className="p-6 my-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900/50 space-y-4">
             <h4 className="text-lg font-semibold text-slate-900 dark:text-white">{provider?.id ? 'Edit' : 'Add'} SSO Provider</h4>
             <div><label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Provider Name</label><input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm sm:text-sm bg-white dark:bg-slate-700" placeholder="e.g., Azure AD" required /></div>
             <div><label htmlFor="signInUrl" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Sign-in URL</label><input type="url" name="signInUrl" id="signInUrl" value={formData.signInUrl} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm sm:text-sm bg-white dark:bg-slate-700" placeholder="https://login.microsoftonline.com/..." required /></div>
             <div><label htmlFor="issuerId" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Issuer / Entity ID</label><input type="text" name="issuerId" id="issuerId" value={formData.issuerId} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm sm:text-sm bg-white dark:bg-slate-700" placeholder="Unique identifier for your IDP" required /></div>
            <div><label htmlFor="certificate" className="block text-sm font-medium text-slate-700 dark:text-slate-300">x.509 Certificate</label><textarea name="certificate" id="certificate" value={formData.certificate} onChange={handleChange} rows={5} className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm sm:text-sm bg-white dark:bg-slate-700 font-mono text-xs" placeholder="-----BEGIN CERTIFICATE-----..." required /></div>
            <div className="flex justify-end space-x-3">
                <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">Save Provider</button>
            </div>
        </form>
    )
}

const AuthenticationSettings: React.FC<{
    ssoProviders: SSOProvider[], 
    setSsoProviders: React.Dispatch<React.SetStateAction<SSOProvider[]>>, 
    securitySettings: SecuritySettings,
    setSecuritySettings: React.Dispatch<React.SetStateAction<SecuritySettings>>,
    logAction: (action: AuditAction, details: string) => void
}> = ({ssoProviders, setSsoProviders, securitySettings, setSecuritySettings, logAction}) => {
    const [authMethod, setAuthMethod] = useState<AuthMethod>('local');
    const [editingProvider, setEditingProvider] = useState<Partial<SSOProvider> | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    
    const handleSetAuthMethod = (method: AuthMethod) => {
        setAuthMethod(method);
        logAction('AUTH_METHOD_CHANGED', `Switched authentication method to ${method === 'sso' ? 'Single Sign-On' : 'Local Authentication'}.`);
    }

    const handleSaveProvider = (provider: SSOProvider) => { 
        if (ssoProviders.some(p => p.id === provider.id)) { 
            setSsoProviders(ssoProviders.map(p => p.id === provider.id ? provider : p)); 
            logAction('SSO_PROVIDER_UPDATED', `Updated SSO Provider '${provider.name}'.`);
        } else { 
            setSsoProviders([...ssoProviders, provider]); 
            logAction('SSO_PROVIDER_CREATED', `Added new SSO Provider '${provider.name}'.`);
        } 
        setIsFormOpen(false); setEditingProvider(null); 
    };
    const handleDeleteProvider = (id: string) => { 
        const provider = ssoProviders.find(p => p.id === id);
        if (provider && window.confirm('Are you sure you want to delete this SSO provider?')) { 
            setSsoProviders(ssoProviders.filter(p => p.id !== id)); 
            logAction('SSO_PROVIDER_DELETED', `Deleted SSO Provider '${provider.name}'.`);
        } 
    }
    const handleAddNew = () => { setEditingProvider({}); setIsFormOpen(true); };
    const handleEdit = (provider: SSOProvider) => { setEditingProvider(provider); setIsFormOpen(true); };
    const handleCancelForm = () => { setIsFormOpen(false); setEditingProvider(null); }

    const handleSecurityChange = <K extends keyof SecuritySettings>(key: K, value: SecuritySettings[K], logMessage: string) => {
        setSecuritySettings(prev => ({ ...prev, [key]: value }));
        logAction('SECURITY_POLICY_UPDATED', logMessage);
    };

    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md space-y-8">
            <div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Authentication Method</h3>
                <p className="mt-1 mb-6 text-sm text-slate-500 dark:text-slate-400">Choose how users will sign in to this application.</p>
                <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className={`relative flex p-4 border rounded-lg cursor-pointer ${authMethod === 'local' ? 'bg-blue-50 dark:bg-blue-900/50 border-blue-300 dark:border-blue-700 ring-2 ring-blue-500' : 'border-slate-300 dark:border-slate-600'}`}><input type="radio" name="authMethod" value="local" checked={authMethod === 'local'} onChange={() => handleSetAuthMethod('local')} className="sr-only" /><div><span className="block text-sm font-medium text-slate-900 dark:text-white">Local Authentication</span><span className="block text-sm text-slate-500 dark:text-slate-400">Use built-in username and password.</span></div></label>
                    <label className={`relative flex p-4 border rounded-lg cursor-pointer ${authMethod === 'sso' ? 'bg-blue-50 dark:bg-blue-900/50 border-blue-300 dark:border-blue-700 ring-2 ring-blue-500' : 'border-slate-300 dark:border-slate-600'}`}><input type="radio" name="authMethod" value="sso" checked={authMethod === 'sso'} onChange={() => handleSetAuthMethod('sso')} className="sr-only" /><div><span className="block text-sm font-medium text-slate-900 dark:text-white">Single Sign-On (SSO)</span><span className="block text-sm text-slate-500 dark:text-slate-400">Authenticate via an Identity Provider (IDP).</span></div></label>
                </fieldset>

                {authMethod === 'sso' && (
                    <div className="mt-6">
                        <div className="flex justify-between items-center mb-2"><h4 className="text-lg font-semibold text-slate-900 dark:text-white">SSO Providers</h4>{!isFormOpen && <button onClick={handleAddNew} className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">Add Provider</button>}</div>
                        {isFormOpen && editingProvider && <SSOProviderForm provider={editingProvider} onSave={handleSaveProvider} onCancel={handleCancelForm} />}
                        <div className="space-y-3 mt-4">
                            {ssoProviders.map(provider => (
                                <div key={provider.id} className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                                    <div className="flex items-center gap-4"><BuildingLibraryIcon className="text-slate-500" /><div><p className="font-medium text-slate-800 dark:text-slate-200">{provider.name}</p><p className="text-xs text-slate-500 dark:text-slate-400">{provider.issuerId}</p></div></div>
                                    <div className="flex items-center gap-2"><button onClick={() => handleEdit(provider)} className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-100 dark:hover:bg-slate-700 rounded-md"><PencilSquareIcon/></button><button onClick={() => handleDeleteProvider(provider.id)} className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-slate-700 rounded-md"><TrashIcon /></button></div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

             <hr className="border-slate-200 dark:border-slate-700" />

            <div>
                 <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Additional Security Settings</h3>
                 <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Enforce stricter security policies for all users of this application.</p>
                
                <div className="mt-6 space-y-6">
                    {/* MFA Enforcement */}
                    <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                        <div className="flex items-center gap-4">
                            <DevicePhoneMobileIcon className="h-6 w-6 text-slate-500" />
                            <div>
                                <h4 className="font-medium text-slate-800 dark:text-slate-200">Require Multi-Factor Authentication (MFA)</h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Force all users to use a second factor during login.</p>
                            </div>
                        </div>
                        <ToggleSwitch enabled={securitySettings.mfaRequired} onChange={(val) => handleSecurityChange('mfaRequired', val, `MFA enforcement ${val ? 'enabled' : 'disabled'}.`)} />
                    </div>

                    {/* IP Whitelisting */}
                    <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                         <div className="flex items-center justify-between">
                             <div className="flex items-center gap-4">
                                <GlobeAltIcon className="h-6 w-6 text-slate-500" />
                                <div>
                                    <h4 className="font-medium text-slate-800 dark:text-slate-200">IP Address Whitelisting</h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Only allow access from specified IP addresses or ranges.</p>
                                </div>
                            </div>
                            <ToggleSwitch enabled={securitySettings.ipWhitelistEnabled} onChange={(val) => handleSecurityChange('ipWhitelistEnabled', val, `IP Whitelisting ${val ? 'enabled' : 'disabled'}.`)} />
                        </div>
                        {securitySettings.ipWhitelistEnabled && (
                            <div className="mt-4 pl-10">
                                 <label htmlFor="allowedIPs" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Allowed IP Addresses (one per line)</label>
                                <textarea 
                                    id="allowedIPs" 
                                    value={securitySettings.allowedIPs}
                                    onChange={(e) => handleSecurityChange('allowedIPs', e.target.value, 'Updated the list of allowed IPs.')}
                                    rows={4} 
                                    className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm sm:text-sm bg-white dark:bg-slate-700 font-mono text-xs"
                                    placeholder="e.g., 203.0.113.1&#10;198.51.100.0/24"
                                />
                            </div>
                        )}
                    </div>

                    {/* Session Timeout */}
                    <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                        <div className="flex items-center gap-4">
                            <ClockIcon className="h-6 w-6 text-slate-500" />
                            <div>
                                <h4 className="font-medium text-slate-800 dark:text-slate-200">Idle Session Timeout</h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Automatically log out users after a period of inactivity.</p>
                            </div>
                        </div>
                         <div className="relative">
                            <input
                                type="number"
                                value={securitySettings.sessionTimeout}
                                onChange={(e) => handleSecurityChange('sessionTimeout', parseInt(e.target.value, 10), `Updated session timeout to ${e.target.value} minutes.`)}
                                className="w-28 rounded-md border-slate-300 dark:border-slate-600 shadow-sm sm:text-sm bg-white dark:bg-slate-700 pr-14"
                            />
                            <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 text-sm">minutes</span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
};

// --- Admin Audit Log Component ---
const AdminAuditLog: React.FC<{ logs: AuditLogEntry[] }> = ({ logs }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredLogs = useMemo(() => {
        return logs.filter(log => 
            log.adminUserEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.details.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [logs, searchTerm]);

    const formatTimestamp = (date: Date) => {
        return date.toLocaleString(undefined, {
            dateStyle: 'medium',
            timeStyle: 'short'
        });
    }

    return (
        <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-lg shadow-md">
             <div className="flex justify-between items-center mb-4">
                <div>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Admin Audit Log</h3>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Track all administrative actions performed in the application.</p>
                </div>
                 <div className="relative">
                    <input
                        type="text"
                        placeholder="Search logs..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="pl-8 pr-2 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                    <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-slate-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path></svg>
                    </div>
                </div>
            </div>
             <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-300">
                        <tr>
                            <th className="px-6 py-3">Timestamp</th>
                            <th className="px-6 py-3">Admin</th>
                            <th className="px-6 py-3">Action</th>
                            <th className="px-6 py-3">Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLogs.map(log => (
                             <tr key={log.id} className="bg-white border-b dark:bg-slate-800 dark:border-slate-700">
                                <td className="px-6 py-4 whitespace-nowrap">{formatTimestamp(log.timestamp)}</td>
                                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{log.adminUserEmail}</td>
                                <td className="px-6 py-4">
                                     <span className="px-2 py-1 text-xs font-mono rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                                        {log.action}
                                    </span>
                                </td>
                                <td className="px-6 py-4">{log.details}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
             </div>
        </div>
    );
};


// --- Main Admin Component ---

const Admin: React.FC<AdminProps> = ({ setCurrentView }) => {
    const [adminView, setAdminView] = useState<AdminView>('userManagement');
    
    // Lifted state
    const [users, setUsers] = useState<AdminUser[]>(initialAdminUsers);
    const [roles, setRoles] = useState<SecurityRole[]>(initialRoles);
    const [ssoProviders, setSsoProviders] = useState<SSOProvider[]>(initialSSOProviders);
    const [securitySettings, setSecuritySettings] = useState<SecuritySettings>(initialSecuritySettings);
    const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(initialAuditLogs);

    const logAdminAction = (action: AuditAction, details: string) => {
        const newLog: AuditLogEntry = {
            id: `log-${Date.now()}`,
            timestamp: new Date(),
            adminUserEmail: 'admin@enterprise.com', // This would be the currently logged-in admin
            action,
            details
        };
        // Add to the top of the list
        setAuditLogs(prev => [newLog, ...prev]);
    };

    const renderAdminView = () => {
        switch (adminView) {
            case 'userManagement':
                return <UserManagementSettings users={users} setUsers={setUsers} roles={roles} logAction={logAdminAction} />;
            case 'securityRoles':
                return <SecurityRolesSettings roles={roles} setRoles={setRoles} logAction={logAdminAction} />;
            case 'authentication':
                return <AuthenticationSettings ssoProviders={ssoProviders} setSsoProviders={setSsoProviders} securitySettings={securitySettings} setSecuritySettings={setSecuritySettings} logAction={logAdminAction} />;
            case 'auditLog':
                return <AdminAuditLog logs={auditLogs} />;
            case 'emailServices':
                return <PlaceholderPage title="Email Services" description="Configure SMTP settings for sending notifications and reports." />;
            default:
                return <UserManagementSettings users={users} setUsers={setUsers} roles={roles} logAction={logAdminAction} />;
        }
    };

    const adminViewTitles: Record<AdminView, string> = {
        userManagement: 'User Management',
        securityRoles: 'Security Roles',
        authentication: 'Authentication',
        auditLog: 'Admin Audit Log',
        emailServices: 'Email Services',
    };

    return (
        <div className="flex h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
            <AdminSidebar adminView={adminView} setAdminView={setAdminView} onBackToApp={() => setCurrentView('dashboard')} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <AdminHeader title={adminViewTitles[adminView]} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-100 dark:bg-slate-900 p-4 sm:p-6 md:p-8">
                    {renderAdminView()}
                </main>
            </div>
        </div>
    );
};

export default Admin;

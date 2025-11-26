import React, { useState } from 'react';
import { ServiceName } from '../types';
import { MicrosoftIcon, GoogleIcon, SlackIcon, HubspotIcon, JiraIcon, SalesforceIcon, ServiceNowIcon, BackArrowIcon, EyeIcon, EyeOffIcon, TrashIcon, PlusIcon } from './icons';

const serviceMetadata = [
  { name: ServiceName.Microsoft, icon: <MicrosoftIcon /> },
  { name: ServiceName.Google, icon: <GoogleIcon /> },
  { name: ServiceName.Slack, icon: <SlackIcon /> },
  { name: ServiceName.Hubspot, icon: <HubspotIcon /> },
  { name: ServiceName.Jira, icon: <JiraIcon /> },
  { name: ServiceName.Salesforce, icon: <SalesforceIcon /> },
  { name: ServiceName.ServiceNow, icon: <ServiceNowIcon /> },
];

// Data Structures
interface ConnectionCredentials {
  tenantId?: string;
  clientId?: string;
  clientSecret?: string;
  serviceAccountJSON?: string;
  adminEmail?: string;
  token?: string;
  instanceUrl?: string;
  username?: string;
  password?: string;
}

interface LicenseSetting {
  id: string;
  name: string;
  period: number;
  cost: number;
}

interface ServiceSettings {
    connected: boolean;
    credentials?: ConnectionCredentials;
    period?: number;
    licenses?: LicenseSetting[];
}

export interface Connection {
    id: string;
    name: string;
    service: ServiceName;
    settings: ServiceSettings;
}


// Initial Data
const initialConnections: Connection[] = [
    {
        id: 'conn-m365-1',
        name: 'Microsoft 365 - Primary Tenant',
        service: ServiceName.Microsoft,
        settings: {
            connected: true,
            credentials: {
              tenantId: 'd8e5a-e8f2-4f9c-b1b7-a3d8fabe2c15',
              clientId: 'c7b4a-f9e1-4a8b-9d0c-b5c6d7a8e9f0',
              clientSecret: 'a1b2c3d4-e5f6-a7b8-c9d0-e1f2a3b4c5d6',
            },
            licenses: [
                { id: 'm1', name: 'E3', period: 90, cost: 36 },
                { id: 'm2', name: 'E5', period: 90, cost: 57 },
                { id: 'm3', name: 'F3', period: 60, cost: 8 },
            ]
        }
    },
    { id: 'conn-google-1', name: 'Google Workspace', service: ServiceName.Google, settings: { connected: true, period: 90 } },
    { id: 'conn-slack-1', name: 'Slack Workspace', service: ServiceName.Slack, settings: { connected: true, period: 60, credentials: { token: 'xoxb-12345-67890-abcdefg' } } },
    { id: 'conn-jira-1', name: 'Jira Cloud Instance', service: ServiceName.Jira, settings: { connected: true, period: 90 } },
    { id: 'conn-salesforce-1', name: 'Salesforce Production', service: ServiceName.Salesforce, settings: { connected: false, period: 90 } },
    { id: 'conn-servicenow-1', name: 'ServiceNow Prod', service: ServiceName.ServiceNow, settings: { connected: false, period: 120 } },
    { id: 'conn-hubspot-1', name: 'Hubspot Marketing', service: ServiceName.Hubspot, settings: { connected: false, period: 120 } },
];


const AddConnectionModal = ({ isOpen, onClose, onAdd }: { isOpen: boolean, onClose: () => void, onAdd: (name: string, service: ServiceName) => void }) => {
    const [name, setName] = useState('');
    const [service, setService] = useState<ServiceName>(ServiceName.Microsoft);

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (name.trim()) {
            onAdd(name.trim(), service);
            setName('');
            setService(ServiceName.Microsoft);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-md">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Add New Connection</h3>
                <div className="mt-4 space-y-4">
                    <div>
                        <label htmlFor="conn-name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Connection Name</label>
                        <input
                            type="text"
                            id="conn-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., M365 - EU Tenant"
                            className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm sm:text-sm bg-white dark:bg-slate-700"
                        />
                    </div>
                    <div>
                        <label htmlFor="conn-service" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Service</label>
                        <select
                            id="conn-service"
                            value={service}
                            onChange={(e) => setService(e.target.value as ServiceName)}
                            className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm sm:text-sm bg-white dark:bg-slate-700"
                        >
                            {Object.values(ServiceName).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600">
                        Cancel
                    </button>
                    <button onClick={handleSubmit} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-400" disabled={!name.trim()}>
                        Create Connection
                    </button>
                </div>
            </div>
        </div>
    );
};


const ConnectionList = ({ connections, onSelectConnection, onAdd, onDelete }: { connections: Connection[], onSelectConnection: (id: string) => void, onAdd: () => void, onDelete: (id: string) => void }) => {
    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-2">
                 <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Service Connections</h3>
                 <button onClick={onAdd} className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 flex items-center gap-2">
                    <PlusIcon />
                    Add Connection
                </button>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                Manage connections and define inactivity rules for your enterprise applications.
            </p>
            <div className="space-y-4">
                {connections.length > 0 ? connections.map((conn) => {
                    const serviceInfo = serviceMetadata.find(s => s.name === conn.service);
                    return (
                        <div key={conn.id} className="flex flex-wrap items-center justify-between gap-4 p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                            <div className="flex items-center gap-4">
                                {serviceInfo?.icon}
                                <div>
                                    <p className="font-medium text-slate-800 dark:text-slate-200">{conn.name}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{conn.service}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={(e) => { e.stopPropagation(); onDelete(conn.id); }}
                                    className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-slate-700 rounded-md"
                                    aria-label={`Delete ${conn.name}`}
                                >
                                    <TrashIcon />
                                </button>
                                <button
                                    onClick={() => onSelectConnection(conn.id)}
                                    className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-600 rounded-md hover:bg-slate-200 dark:hover:bg-slate-500"
                                >
                                    Configure
                                </button>
                            </div>
                        </div>
                    )
                }) : (
                    <div className="text-center py-10 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg">
                        <p className="text-slate-500 dark:text-slate-400">No connections have been configured.</p>
                        <p className="text-sm text-slate-400 dark:text-slate-500">Click "Add Connection" to get started.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const SettingsDetailHeader = ({ connection, onBack }: { connection: Connection, onBack: () => void }) => {
    const serviceInfo = serviceMetadata.find(s => s.name === connection.service);
    return (
        <div className="flex items-center mb-6">
            <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 mr-4" aria-label="Go back to connections list">
                <BackArrowIcon />
            </button>
            <div className="flex items-center gap-3">
                {serviceInfo?.icon}
                <div>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{connection.name}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 -mt-1">{connection.service}</p>
                </div>
            </div>
        </div>
    )
}

const TestConnectionButton = () => {
    const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'failed'>('idle');
    const handleTestConnection = () => {
        setTestStatus('testing');
        setTimeout(() => {
            // This is a mock test. In a real app, you would make an API call.
            const isSuccess = Math.random() > 0.3; // 70% chance of success
            setTestStatus(isSuccess ? 'success' : 'failed');
            setTimeout(() => setTestStatus('idle'), 3000);
        }, 1500);
    }
     return (
        <button onClick={handleTestConnection} className="px-4 py-2 text-sm font-medium text-white bg-slate-600 rounded-md hover:bg-slate-700 disabled:opacity-50" disabled={testStatus === 'testing'}>
            {testStatus === 'testing' && 'Testing...'}
            {testStatus === 'idle' && 'Test Connection'}
            {testStatus === 'success' && 'Connection Successful!'}
            {testStatus === 'failed' && 'Connection Failed!'}
        </button>
    )
}

const CredentialInput = ({id, label, value, onChange, type = 'text', placeholder = ''} : {id: string, label: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void, type?: string, placeholder?: string}) => {
    const [showSecret, setShowSecret] = useState(false);
    const isPassword = type === 'password';

    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
            <div className="relative mt-1">
                <input 
                    type={isPassword && !showSecret ? 'password' : 'text'} 
                    id={id} 
                    value={value} 
                    onChange={onChange}
                    placeholder={placeholder}
                    className="block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm sm:text-sm bg-white dark:bg-slate-700 pr-10"
                />
                {isPassword && (
                    <button type="button" onClick={() => setShowSecret(!showSecret)} className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-500" aria-label={showSecret ? "Hide secret" : "Show secret"}>
                        {showSecret ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                )}
            </div>
        </div>
    )
}

const InactivityPeriodInput = ({ value, onChange } : { value: number, onChange: (val: number) => void}) => {
     return (
        <div className="max-w-xs">
             <h4 className="font-semibold text-lg text-slate-800 dark:text-slate-200 mb-1">Inactivity Rules</h4>
             <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Set the number of days a user can be inactive before being flagged.</p>
             <label htmlFor="period" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Inactive account period</label>
            <div className="relative mt-1">
                <input 
                    type="number"
                    id="period"
                    value={value}
                    onChange={(e) => onChange(parseInt(e.target.value, 10) || 0)}
                    className="w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm sm:text-sm bg-white dark:bg-slate-700 pr-12"
                />
                <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 text-sm">days</span>
            </div>
        </div>
    )
}

const M365SettingsDetail = ({ connection, onBack, onConnectionChange }: { connection: Connection, onBack: () => void, onConnectionChange: (newConnection: Connection) => void }) => {
    
    const handleSettingsChange = (newSettings: ServiceSettings) => {
        onConnectionChange({ ...connection, settings: newSettings });
    };

    const handleCredentialChange = (field: keyof ConnectionCredentials, value: string) => {
        handleSettingsChange({
            ...connection.settings,
            credentials: { ...connection.settings.credentials, [field]: value }
        });
    }
    
    const handleLicenseChange = (licenseId: string, field: keyof Omit<LicenseSetting, 'id'>, value: string | number) => {
        const newLicenses = connection.settings.licenses?.map(lic =>
            lic.id === licenseId ? { ...lic, [field]: value } : lic
        );
        handleSettingsChange({ ...connection.settings, licenses: newLicenses });
    };

    const handleAddLicense = () => {
        const newLicense: LicenseSetting = { id: `m${Date.now()}`, name: 'New License', period: 90, cost: 0 };
        handleSettingsChange({ ...connection.settings, licenses: [...(connection.settings.licenses || []), newLicense] });
    };

    const handleRemoveLicense = (licenseId: string) => {
        handleSettingsChange({ ...connection.settings, licenses: connection.settings.licenses?.filter(lic => lic.id !== licenseId) });
    };
    
    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
            <SettingsDetailHeader connection={connection} onBack={onBack} />

            {/* Connection Credentials */}
            <div className="border-b border-slate-200 dark:border-slate-700 pb-6 mb-6">
                <h4 className="font-semibold text-lg text-slate-800 dark:text-slate-200 mb-1">Connection Credentials</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Provide the details from your Microsoft Entra ID App Registration.</p>
                <div className="space-y-4 max-w-xl">
                     <CredentialInput id="tenantId" label="Tenant ID" value={connection.settings.credentials?.tenantId || ''} onChange={e => handleCredentialChange('tenantId', e.target.value)} />
                     <CredentialInput id="clientId" label="Client ID" value={connection.settings.credentials?.clientId || ''} onChange={e => handleCredentialChange('clientId', e.target.value)} />
                     <CredentialInput id="clientSecret" label="Client Secret" value={connection.settings.credentials?.clientSecret || ''} onChange={e => handleCredentialChange('clientSecret', e.target.value)} type="password" />
                    <div>
                        <TestConnectionButton />
                    </div>
                </div>
            </div>
            
            {/* License Settings */}
            <div>
                 <h4 className="font-semibold text-lg text-slate-800 dark:text-slate-200 mb-1">License Inactivity Rules</h4>
                 <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Define inactivity period and cost for each license type to calculate savings.</p>
                <div className="space-y-3">
                    {connection.settings.licenses?.map((license) => (
                         <div key={license.id} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
                             <input type="text" placeholder="License Name (e.g., E5)" value={license.name} onChange={(e) => handleLicenseChange(license.id, 'name', e.target.value)} className="md:col-span-2 rounded-md border-slate-300 dark:border-slate-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-white dark:bg-slate-700"/>
                            <div className="relative"><input type="number" value={license.period} onChange={(e) => handleLicenseChange(license.id, 'period', parseInt(e.target.value, 10))} className="w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm sm:text-sm bg-white dark:bg-slate-700 pr-12"/><span className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 text-sm">days</span></div>
                             <div className="flex items-center gap-2">
                                 <div className="relative flex-grow"><span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 text-sm">$</span><input type="number" value={license.cost} onChange={(e) => handleLicenseChange(license.id, 'cost', parseFloat(e.target.value))} className="w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm sm:text-sm bg-white dark:bg-slate-700 pl-7"/></div>
                                 <button onClick={() => handleRemoveLicense(license.id)} className="text-slate-400 hover:text-red-500 p-1.5 rounded-md hover:bg-red-100 dark:hover:bg-red-900/50" aria-label={`Remove ${license.name} license`}><TrashIcon /></button>
                             </div>
                         </div>
                    ))}
                </div>
                 <button onClick={handleAddLicense} className="mt-4 px-3 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/50 rounded-md hover:bg-blue-200 dark:hover:bg-blue-900">+ Add License Type</button>
            </div>
        </div>
    );
}

// Base component for services with simple credential fields and one inactivity period
const SimpleServiceSettingsDetail = ({ connection, onBack, onConnectionChange, children, description }: { connection: Connection, onBack: () => void, onConnectionChange: (newConnection: Connection) => void, children?: React.ReactNode, description: string }) => {
    
    const handlePeriodChange = (period: number) => {
        onConnectionChange({ ...connection, settings: { ...connection.settings, period } });
    };

    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
            <SettingsDetailHeader connection={connection} onBack={onBack} />
             <div className="border-b border-slate-200 dark:border-slate-700 pb-6 mb-6">
                <h4 className="font-semibold text-lg text-slate-800 dark:text-slate-200 mb-1">Connection Credentials</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{description}</p>
                <div className="space-y-4 max-w-xl">
                    {children}
                    <div>
                        <TestConnectionButton />
                    </div>
                </div>
            </div>
            <InactivityPeriodInput value={connection.settings.period || 90} onChange={handlePeriodChange} />
        </div>
    );
}

const GoogleSettingsDetail = (props: { connection: Connection, onBack: () => void, onConnectionChange: (c: Connection) => void }) => {
    const { connection, onConnectionChange } = props;
    const handleCredentialChange = (field: keyof ConnectionCredentials, value: string) => {
        onConnectionChange({ ...connection, settings: { ...connection.settings, credentials: { ...connection.settings.credentials, [field]: value } } });
    }
    return (
        <SimpleServiceSettingsDetail {...props} description="Paste your Google Cloud Service Account JSON and provide an admin email to impersonate.">
             <div>
                <label htmlFor="serviceAccountJSON" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Service Account JSON</label>
                <textarea id="serviceAccountJSON" value={connection.settings.credentials?.serviceAccountJSON || ''} onChange={e => handleCredentialChange('serviceAccountJSON', e.target.value)} rows={5} className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm sm:text-sm bg-white dark:bg-slate-700 font-mono text-xs" />
            </div>
            <CredentialInput id="adminEmail" label="Admin User Email" value={connection.settings.credentials?.adminEmail || ''} onChange={e => handleCredentialChange('adminEmail', e.target.value)} placeholder="admin@yourdomain.com" />
        </SimpleServiceSettingsDetail>
    );
}

const SlackSettingsDetail = (props: { connection: Connection, onBack: () => void, onConnectionChange: (c: Connection) => void }) => {
    const { connection, onConnectionChange } = props;
    const handleCredentialChange = (value: string) => {
        onConnectionChange({ ...connection, settings: { ...connection.settings, credentials: { ...connection.settings.credentials, token: value } } });
    }
    return (
        <SimpleServiceSettingsDetail {...props} description="Provide the Bot User OAuth Token from your Slack App configuration.">
            <CredentialInput id="token" label="Bot User OAuth Token" value={connection.settings.credentials?.token || ''} onChange={e => handleCredentialChange(e.target.value)} type="password" placeholder="xoxb-..." />
        </SimpleServiceSettingsDetail>
    );
}

const JiraSettingsDetail = (props: { connection: Connection, onBack: () => void, onConnectionChange: (c: Connection) => void }) => {
    const { connection, onConnectionChange } = props;
    const handleCredentialChange = (field: keyof ConnectionCredentials, value: string) => {
        onConnectionChange({ ...connection, settings: { ...connection.settings, credentials: { ...connection.settings.credentials, [field]: value } } });
    }
    return (
        <SimpleServiceSettingsDetail {...props} description="Provide your Atlassian site URL, a user email, and an API token.">
            <CredentialInput id="instanceUrl" label="Atlassian Site URL" value={connection.settings.credentials?.instanceUrl || ''} onChange={e => handleCredentialChange('instanceUrl', e.target.value)} placeholder="your-company.atlassian.net" />
            <CredentialInput id="adminEmail" label="User Email" value={connection.settings.credentials?.adminEmail || ''} onChange={e => handleCredentialChange('adminEmail', e.target.value)} placeholder="user@your-company.com" />
            <CredentialInput id="token" label="API Token" value={connection.settings.credentials?.token || ''} onChange={e => handleCredentialChange('token', e.target.value)} type="password" />
        </SimpleServiceSettingsDetail>
    );
}

const SalesforceSettingsDetail = (props: { connection: Connection, onBack: () => void, onConnectionChange: (c: Connection) => void }) => {
    const { connection, onConnectionChange } = props;
    const handleCredentialChange = (field: keyof ConnectionCredentials, value: string) => {
        onConnectionChange({ ...connection, settings: { ...connection.settings, credentials: { ...connection.settings.credentials, [field]: value } } });
    }
    return (
        <SimpleServiceSettingsDetail {...props} description="Provide the details from your Salesforce Connected App.">
            <CredentialInput id="instanceUrl" label="Instance URL" value={connection.settings.credentials?.instanceUrl || ''} onChange={e => handleCredentialChange('instanceUrl', e.target.value)} placeholder="your-instance.my.salesforce.com" />
            <CredentialInput id="clientId" label="Client ID (Consumer Key)" value={connection.settings.credentials?.clientId || ''} onChange={e => handleCredentialChange('clientId', e.target.value)} />
            <CredentialInput id="clientSecret" label="Client Secret (Consumer Secret)" value={connection.settings.credentials?.clientSecret || ''} onChange={e => handleCredentialChange('clientSecret', e.target.value)} type="password" />
        </SimpleServiceSettingsDetail>
    );
}

const ServiceNowSettingsDetail = (props: { connection: Connection, onBack: () => void, onConnectionChange: (c: Connection) => void }) => {
    const { connection, onConnectionChange } = props;
    const handleCredentialChange = (field: keyof ConnectionCredentials, value: string) => {
        onConnectionChange({ ...connection, settings: { ...connection.settings, credentials: { ...connection.settings.credentials, [field]: value } } });
    }
    return (
        <SimpleServiceSettingsDetail {...props} description="Provide your ServiceNow instance URL and credentials for an integration user account.">
            <CredentialInput id="instanceUrl" label="Instance URL" value={connection.settings.credentials?.instanceUrl || ''} onChange={e => handleCredentialChange('instanceUrl', e.target.value)} placeholder="your-instance.service-now.com" />
            <CredentialInput id="username" label="Username" value={connection.settings.credentials?.username || ''} onChange={e => handleCredentialChange('username', e.target.value)} />
            <CredentialInput id="password" label="Password" value={connection.settings.credentials?.password || ''} onChange={e => handleCredentialChange('password', e.target.value)} type="password" />
        </SimpleServiceSettingsDetail>
    );
}

const HubspotSettingsDetail = (props: { connection: Connection, onBack: () => void, onConnectionChange: (c: Connection) => void }) => {
    const { connection, onConnectionChange } = props;
    const handleCredentialChange = (value: string) => {
        onConnectionChange({ ...connection, settings: { ...connection.settings, credentials: { ...connection.settings.credentials, token: value } } });
    }
    return (
        <SimpleServiceSettingsDetail {...props} description="Provide the Private App Access Token from your Hubspot account.">
            <CredentialInput id="token" label="Private App Access Token" value={connection.settings.credentials?.token || ''} onChange={e => handleCredentialChange(e.target.value)} type="password" />
        </SimpleServiceSettingsDetail>
    );
}


const GenericSettingsDetail = ({ connection, onBack }: { connection: Connection, onBack: () => void }) => {
    return (
         <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
             <SettingsDetailHeader connection={connection} onBack={onBack}/>
            <div className="text-center py-12">
                <p className="text-slate-500 dark:text-slate-400">Configuration for {connection.service} is not yet implemented.</p>
            </div>
         </div>
    )
}

const Settings: React.FC = () => {
  const [connections, setConnections] = useState<Connection[]>(initialConnections);
  const [selectedConnectionId, setSelectedConnectionId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSelectConnection = (id: string) => setSelectedConnectionId(id);
  const handleBack = () => setSelectedConnectionId(null);
  
  const handleConnectionChange = (updatedConnection: Connection) => {
      setConnections(prev => prev.map(c => c.id === updatedConnection.id ? updatedConnection : c));
  }

  const handleAddConnection = (name: string, service: ServiceName) => {
    const newConnection: Connection = {
        id: `conn-${Date.now()}`,
        name,
        service,
        settings: { connected: false, period: 90, licenses: service === ServiceName.Microsoft ? [] : undefined },
    };
    setConnections(prev => [...prev, newConnection]);
    setIsAddModalOpen(false);
  };
  
  const handleDeleteConnection = (id: string) => {
      if (window.confirm('Are you sure you want to delete this connection?')) {
          setConnections(prev => prev.filter(c => c.id !== id));
      }
  };

  const handleSave = () => {
    console.log('Settings saved.', connections);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };
  
  const renderDetailView = () => {
      const selectedConnection = connections.find(c => c.id === selectedConnectionId);
      if (!selectedConnection) return null;

      const props = { connection: selectedConnection, onBack: handleBack, onConnectionChange: handleConnectionChange };

      switch(selectedConnection.service) {
          case ServiceName.Microsoft: return <M365SettingsDetail {...props} />;
          case ServiceName.Google: return <GoogleSettingsDetail {...props} />;
          case ServiceName.Slack: return <SlackSettingsDetail {...props} />;
          case ServiceName.Jira: return <JiraSettingsDetail {...props} />;
          case ServiceName.Salesforce: return <SalesforceSettingsDetail {...props} />;
          case ServiceName.ServiceNow: return <ServiceNowSettingsDetail {...props} />;
          case ServiceName.Hubspot: return <HubspotSettingsDetail {...props} />;
          default: return <GenericSettingsDetail connection={selectedConnection} onBack={handleBack} />;
      }
  }

  return (
    <div className="max-w-4xl mx-auto">
        <AddConnectionModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAdd={handleAddConnection} />

        {!selectedConnectionId ? (
            <ConnectionList connections={connections} onSelectConnection={handleSelectConnection} onAdd={() => setIsAddModalOpen(true)} onDelete={handleDeleteConnection} />
        ) : (
            renderDetailView()
        )}

        {/* Show Save button only when a detail view is active */}
        {selectedConnectionId && (
             <div className="mt-6 flex justify-end items-center gap-4">
                {isSaved && <span className="text-sm text-green-600 dark:text-green-400">Settings saved successfully!</span>}
                <button
                    onClick={handleSave}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                    Save Changes
                </button>
            </div>
        )}
    </div>
  );
};

export default Settings;
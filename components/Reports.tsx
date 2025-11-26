
import React from 'react';
import { DownloadIcon } from './icons';

const Reports: React.FC = () => {
    const handleExport = (reportType: string) => {
        alert(`Exporting ${reportType} report. This is a prototype action.`);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Export Reports</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Generate and download detailed reports of user activity for compliance and auditing purposes.
                </p>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Inactive Users Report */}
                    <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                        <h4 className="font-semibold text-slate-800 dark:text-slate-200">Inactive Users Report</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            A comprehensive list of all users currently flagged as inactive across all connected services.
                        </p>
                        <button
                            onClick={() => handleExport('Inactive Users')}
                            className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                        >
                            <DownloadIcon />
                            Export CSV
                        </button>
                    </div>

                    {/* All Users Report */}
                    <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                        <h4 className="font-semibold text-slate-800 dark:text-slate-200">All Users Audit Log</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            A complete audit log of all users, their statuses, and last active dates from all platforms.
                        </p>
                        <button
                            onClick={() => handleExport('All Users Audit')}
                            className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                        >
                            <DownloadIcon />
                            Export CSV
                        </button>
                    </div>

                    {/* Savings Report */}
                    <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                        <h4 className="font-semibold text-slate-800 dark:text-slate-200">Potential Savings Report</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                           An estimated breakdown of potential monthly and annual savings by deprovisioning inactive accounts.
                        </p>
                        <button
                            onClick={() => handleExport('Savings Report')}
                            className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                        >
                           <DownloadIcon />
                            Export PDF
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;

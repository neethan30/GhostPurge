
import React, { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, Sector } from 'recharts';
import useMockData from '../hooks/useMockData';
import { UserStatus, ServiceName } from '../types';
import { InfoIcon, MoneyIcon, UsersIcon as TotalUsersIcon, UserXIcon } from './icons';
import { getGeminiInsights } from '../services/geminiService';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333" className="dark:fill-slate-200">{`${value} Users`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
        {`(Rate ${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};


const Dashboard: React.FC = () => {
    const { users, inactivityPeriod } = useMockData();
    const [activeIndex, setActiveIndex] = useState(0);
    const [insights, setInsights] = useState('');
    const [loadingInsights, setLoadingInsights] = useState(false);

    const inactiveUsers = useMemo(() => users.filter(u => u.status === UserStatus.Inactive), [users]);
    const potentialSavings = useMemo(() => inactiveUsers.length * 50, [inactiveUsers]); // Assuming $50/user/month avg

    const userStats = useMemo(() => {
      const stats = {
        total: users.length,
        inactive: inactiveUsers.length,
        savings: potentialSavings
      };
      return stats;
    }, [users, inactiveUsers.length, potentialSavings]);

    const usersByService = useMemo(() => {
        const serviceCounts = Object.values(ServiceName).reduce((acc, service) => {
            acc[service] = { name: service, active: 0, inactive: 0 };
            return acc;
        }, {} as Record<ServiceName, { name: ServiceName; active: number; inactive: number }>);

        users.forEach(user => {
            if (user.status === UserStatus.Inactive) {
                serviceCounts[user.service].inactive++;
            } else {
                serviceCounts[user.service].active++;
            }
        });

        return Object.values(serviceCounts);
    }, [users]);
    
    const userStatusDistribution = useMemo(() => {
      const statusCounts = {
        [UserStatus.Active]: 0,
        [UserStatus.Inactive]: 0,
        [UserStatus.PendingDeactivation]: 0,
      };

      users.forEach(user => {
        statusCounts[user.status]++;
      });

      return Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
    }, [users]);
    
    const onPieEnter = (_: any, index: number) => {
        setActiveIndex(index);
    };

    const handleGenerateInsights = async () => {
        setLoadingInsights(true);
        setInsights('');
        try {
            const result = await getGeminiInsights(userStats.inactive, userStats.total, userStats.savings, inactivityPeriod);
            setInsights(result);
        } catch (error) {
            console.error(error);
            setInsights('Failed to generate insights. Please try again.');
        } finally {
            setLoadingInsights(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md flex items-center">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-full mr-4"><TotalUsersIcon className="text-blue-500"/></div>
                    <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Total Users</p>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white">{userStats.total}</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md flex items-center">
                    <div className="p-3 bg-red-100 dark:bg-red-900/50 rounded-full mr-4"><UserXIcon className="text-red-500"/></div>
                    <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Inactive Users ({`>${inactivityPeriod} days`})</p>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white">{userStats.inactive}</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md flex items-center">
                    <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-full mr-4"><MoneyIcon className="text-green-500"/></div>
                    <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Est. Monthly Savings</p>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white">${potentialSavings.toLocaleString()}</p>
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              <div className="lg:col-span-3 bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
                <h3 className="font-semibold text-lg mb-4 text-slate-800 dark:text-white">User Activity by Service</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={usersByService}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(100, 116, 139, 0.3)" />
                    <XAxis dataKey="name" tick={{ fill: 'rgb(100 116 139)'}} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fill: 'rgb(100 116 139)'}} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: 'rgb(30 41 59)', border: '1px solid rgb(71 85 105)'}} cursor={{fill: 'rgba(100, 116, 139, 0.1)'}}/>
                    <Legend />
                    <Bar dataKey="active" stackId="a" fill="#2563eb" name="Active" />
                    <Bar dataKey="inactive" stackId="a" fill="#dc2626" name="Inactive" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
                 <h3 className="font-semibold text-lg mb-4 text-slate-800 dark:text-white">User Status Distribution</h3>
                 <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                       <Pie
                          activeIndex={activeIndex}
                          activeShape={renderActiveShape}
                          data={userStatusDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          onMouseEnter={onPieEnter}
                       >
                         {userStatusDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                         ))}
                       </Pie>
                    </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
             {/* AI Insights */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-lg text-slate-800 dark:text-white">AI-Powered Insights</h3>
                    <button onClick={handleGenerateInsights} disabled={loadingInsights} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center transition-colors">
                        {loadingInsights ? (
                             <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : '✨'}
                        {loadingInsights ? 'Generating...' : 'Generate Insights'}
                    </button>
                </div>
                {insights ? (
                    <div className="prose prose-sm dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-md" dangerouslySetInnerHTML={{ __html: insights }} />
                ) : (
                    <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                        <InfoIcon className="mx-auto h-8 w-8 mb-2" />
                        <p>Click "Generate Insights" to get an AI-powered summary of your account activity.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;

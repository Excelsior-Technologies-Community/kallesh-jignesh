import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Download } from 'lucide-react';

const data = [
    { name: 'January', visits: 165, unique: 125 },
    { name: 'February', visits: 100, unique: 80 },
    { name: 'March', visits: 150, unique: 110 },
    { name: 'April', visits: 200, unique: 150 },
    { name: 'May', visits: 160, unique: 130 },
    { name: 'June', visits: 180, unique: 140 },
    { name: 'July', visits: 160, unique: 125 },
];

const TrafficChart = () => {
    return (
        <div className="glass-card rounded-2xl p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h3 className="text-[18px] font-bold text-[#3c4b64] dark:text-white">Traffic</h3>
                    <p className="text-[13px] text-gray-500">January - July 2023</p>
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex bg-gray-100 dark:bg-[#1a1c23] p-1 rounded-md">
                        <button className="px-3 py-1 text-[12px] font-medium text-gray-500 hover:text-[#321fdb]">Day</button>
                        <button className="px-3 py-1 text-[12px] font-medium bg-white dark:bg-[#3c4b64] text-[#321fdb] dark:text-white rounded shadow-sm">Month</button>
                        <button className="px-3 py-1 text-[12px] font-medium text-gray-500 hover:text-[#321fdb]">Year</button>
                    </div>
                    <button className="p-2 bg-[#321fdb] text-white rounded-md hover:bg-[#2a1ab9] transition-colors">
                        <Download size={16} />
                    </button>
                </div>
            </div>

            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#2eb85c" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#2eb85c" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorUnique" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#321fdb" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#321fdb" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#8a93a2', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#8a93a2', fontSize: 12 }}
                            domain={[50, 200]}
                            ticks={[50, 100, 150, 200]}
                        />
                        <Tooltip
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="visits"
                            stroke="#2eb85c"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorVisits)"
                        />
                        <Area
                            type="monotone"
                            dataKey="unique"
                            stroke="#321fdb"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorUnique)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
                <div className="text-center">
                    <div className="text-[13px] text-gray-500 mb-1">Visits</div>
                    <div className="text-[16px] font-bold text-[#3c4b64] dark:text-white">29.703 Users (40%)</div>
                    <div className="h-1 bg-[#2eb85c] rounded-full mt-2 w-full mx-auto max-w-[80px]" />
                </div>
                <div className="text-center">
                    <div className="text-[13px] text-gray-500 mb-1">Unique</div>
                    <div className="text-[16px] font-bold text-[#3c4b64] dark:text-white">24.093 Users (20%)</div>
                    <div className="h-1 bg-[#43d1f0] rounded-full mt-2 w-full mx-auto max-w-[80px]" />
                </div>
                <div className="text-center">
                    <div className="text-[13px] text-gray-500 mb-1">Pageviews</div>
                    <div className="text-[16px] font-bold text-[#3c4b64] dark:text-white">78.706 Views (60%)</div>
                    <div className="h-1 bg-[#f9b115] rounded-full mt-2 w-full mx-auto max-w-[80px]" />
                </div>
                <div className="text-center">
                    <div className="text-[13px] text-gray-500 mb-1">New Users</div>
                    <div className="text-[16px] font-bold text-[#3c4b64] dark:text-white">22.123 Users (80%)</div>
                    <div className="h-1 bg-[#e55353] rounded-full mt-2 w-full mx-auto max-w-[80px]" />
                </div>
                <div className="text-center">
                    <div className="text-[13px] text-gray-500 mb-1">Bounce Rate</div>
                    <div className="text-[16px] font-bold text-[#3c4b64] dark:text-white">40.15%</div>
                    <div className="h-1 bg-[#321fdb] rounded-full mt-2 w-full mx-auto max-w-[80px]" />
                </div>
            </div>
        </div>
    );
};

export default TrafficChart;

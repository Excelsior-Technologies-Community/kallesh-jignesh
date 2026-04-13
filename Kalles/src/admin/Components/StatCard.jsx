
import React from 'react';
import { MoreVertical } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

const StatCard = ({ title, value, percentage, color, data, isNegative }) => {
    return (
        <div className={`${color} bg-opacity-80 dark:bg-opacity-40 glass-card rounded-2xl p-4 pb-0 text-white flex flex-col h-[160px] relative overflow-hidden group`}>
            <div className="flex justify-between items-start mb-1">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="text-[20px] font-bold">{value}</span>
                        <span className="text-[12px] opacity-80 flex items-center">
                            ({percentage} {isNegative ? '↓' : '↑'})
                        </span>
                    </div>
                    <div className="text-[14px] opacity-80">{title}</div>
                </div>
                <button className="text-white opacity-60 hover:opacity-100 transition-opacity">
                    <MoreVertical size={16} />
                </button>
            </div>

            <div className="flex-1 mt-2 -mx-4">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke="rgba(255,255,255,0.4)"
                            strokeWidth={2}
                            dot={false}
                            animationDuration={1500}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="absolute -bottom-1 -left-1 -right-1 h-12 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </div>
    );
};

export default StatCard;

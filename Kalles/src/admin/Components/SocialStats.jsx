import React from 'react';
import { FaFacebookF, FaTwitter, FaLinkedinIn } from 'react-icons/fa';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

const SocialCard = ({ icon: Icon, count, label, color }) => (
    <div className="glass-card rounded-2xl overflow-hidden">
        <div className={`h-[100px] flex items-center justify-center ${color} bg-opacity-80 dark:bg-opacity-40 text-white`}>
            <Icon size={32} />
        </div>
        <div className="flex divide-x divide-white/10 dark:divide-slate-800/50 bg-white/5">
            <div className="flex-1 py-3 text-center">
                <div className="text-[18px] font-bold text-[#3c4b64] dark:text-white">{count}</div>
                <div className="text-[12px] text-gray-500 uppercase font-medium">{label}</div>
            </div>
            <div className="flex-1 py-3 text-center">
                <div className="text-[18px] font-bold text-[#3c4b64] dark:text-white">459</div>
                <div className="text-[12px] text-gray-500 uppercase font-medium">Feed</div>
            </div>
        </div>
    </div>
);

const SocialStats = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <SocialCard
                icon={FaFacebookF}
                count="89k"
                label="Friends"
                color="bg-[#3b5998]"
            />
            <SocialCard
                icon={FaTwitter}
                count="973k"
                label="Followers"
                color="bg-[#00aced]"
            />
            <SocialCard
                icon={FaLinkedinIn}
                count="500+"
                label="Contacts"
                color="bg-[#4875b4]"
            />
        </div>
    );
};

export default SocialStats;

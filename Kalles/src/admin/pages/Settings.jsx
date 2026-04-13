import { Bell, CreditCard, Globe, Globe2, GlobeLock, Languages, Layout, Lock, Mail, Palette, Save, Settings as SettingsIcon, Shield, ShieldCheck, UserCog, Users } from 'lucide-react';
import { useState } from 'react';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('general');
    const [loading, setLoading] = useState(false);

    const tabs = [
        { id: 'general', label: 'General', icon: Globe2 },
        { id: 'branding', label: 'Branding', icon: Palette },
        { id: 'security', label: 'Security', icon: ShieldCheck },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'permissions', label: 'Roles & Permissions', icon: UserCog },
        { id: 'payments', label: 'Integrations', icon: CreditCard },
    ];

    const handleSave = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            alert('Settings saved successfully!');
        }, 1000);
    };

    return (
        <div className="max-w-[1200px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3 tracking-tighter uppercase">
                        <SettingsIcon className="text-indigo-600" size={32} />
                        System Settings
                    </h1>
                    <p className="text-slate-500 font-medium mt-1">Manage your website configurations and security</p>
                </div>
                <button 
                    onClick={handleSave}
                    disabled={loading}
                    className="px-8 py-3 bg-indigo-600 text-white rounded-2xl text-sm font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 active:scale-95"
                >
                    <Save size={18} /> {loading ? 'Saving...' : 'Save All Changes'}
                </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Tabs Sidebar */}
                <div className="lg:w-72 space-y-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-bold ${activeTab === tab.id 
                                ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20 translate-x-1' 
                                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                        >
                            <tab.icon size={20} />
                            <span className="text-sm">{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Main Content Area */}
                <div className="flex-1">
                    <div className="glass-card p-8 rounded-[2rem] border border-white/20 dark:border-slate-800/50">
                        {activeTab === 'general' && (
                            <div className="space-y-8">
                                <section className="space-y-6">
                                    <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2 tracking-tight">
                                        <Globe size={20} className="text-indigo-600" />
                                        General Configuration
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest pl-1">Site Title</label>
                                             <input type="text" defaultValue="Kalles Fashion" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-bold text-slate-900 dark:text-white" />
                                         </div>
                                         <div className="space-y-2">
                                             <label className="text-xs font-black text-slate-500 uppercase tracking-widest pl-1">Tagline</label>
                                             <input type="text" defaultValue="Modern eCommerce Solution" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-bold text-slate-900 dark:text-white" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest pl-1">Timezone</label>
                                            <div className="relative">
                                                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                                <select className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-bold appearance-none">
                                                    <option>(GMT+05:30) Mumbai, Kolkata, New Delhi</option>
                                                    <option>(GMT+00:00) UTC</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest pl-1">Language</label>
                                            <div className="relative">
                                                <Languages className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                                <select className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-bold appearance-none">
                                                    <option>English (US)</option>
                                                    <option>Hindi (India)</option>
                                                    <option>Spanish</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        )}

                        {activeTab === 'branding' && (
                            <div className="space-y-8">
                                <section className="space-y-6">
                                    <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2 tracking-tight">
                                        <Palette size={20} className="text-indigo-600" />
                                        Brand Assets
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest pl-1">Main Logo</label>
                                            <div className="p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl flex flex-col items-center justify-center gap-4 hover:border-indigo-500/50 transition-colors cursor-pointer group">
                                                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 group-hover:scale-110 transition-transform">
                                                    <Layout size={32} />
                                                </div>
                                                <p className="text-xs font-bold text-slate-500">Click to upload logo (PNG/SVG)</p>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest pl-1">Favicon</label>
                                            <div className="p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl flex flex-col items-center justify-center gap-4 hover:border-indigo-500/50 transition-colors cursor-pointer group">
                                                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 group-hover:scale-110 transition-transform">
                                                    <Globe2 size={32} />
                                                </div>
                                                <p className="text-xs font-bold text-slate-500">Upload Icon (32x32)</p>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="space-y-8">
                                <section className="space-y-6">
                                    <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2 tracking-tight">
                                        <Lock size={20} className="text-indigo-600" />
                                        Security Policies
                                    </h3>
                                    <div className="space-y-4">
                                        {[
                                            { title: 'Two-Factor Authentication (2FA)', desc: 'Add an extra layer of security to account logins.', icon: Shield, enabled: true },
                                            { title: 'Password Policy', desc: 'Require users to use complex passwords with symbols.', icon: ShieldCheck, enabled: true },
                                            { title: 'Login Notifications', desc: 'Email users when a new login session is detected.', icon: Mail, enabled: false },
                                            { title: 'Session Timeout', desc: 'Automatically logout inactive users after 30 minutes.', icon: GlobeLock, enabled: true },
                                        ].map((item, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-indigo-600">
                                                        <item.icon size={20} />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-slate-800 dark:text-white">{item.title}</p>
                                                        <p className="text-xs text-slate-500 font-medium">{item.desc}</p>
                                                    </div>
                                                </div>
                                                <div className={`w-12 h-6 rounded-full relative cursor-pointer transition-all ${item.enabled ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'}`}>
                                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${item.enabled ? 'right-1' : 'left-1'}`}></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </div>
                        )}

                        {activeTab === 'notifications' && (
                             <div className="space-y-8">
                             <section className="space-y-6">
                                 <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2 tracking-tight">
                                     <Bell size={20} className="text-indigo-600" />
                                     Notification Channels
                                 </h3>
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                     <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800/50 space-y-4">
                                         <div className="flex items-center gap-3">
                                             <Mail className="text-indigo-600" size={24} />
                                             <p className="text-sm font-black uppercase tracking-widest">Email (SMTP)</p>
                                         </div>
                                         <div className="space-y-3">
                                             <input type="text" placeholder="SMTP Host" className="w-full px-4 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none text-xs font-bold text-slate-900 dark:text-white" />
                                             <input type="text" placeholder="Port" className="w-full px-4 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none text-xs font-bold text-slate-900 dark:text-white" />
                                         </div>
                                         <button className="w-full py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-[10px] font-black uppercase text-indigo-600 hover:bg-slate-100 transition-all">Test Connection</button>
                                     </div>
                                 </div>
                             </section>
                         </div>
                        )}

                        {activeTab === 'permissions' && (
                             <div className="space-y-8">
                             <section className="space-y-6">
                                 <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2 tracking-tight">
                                        <Users size={20} className="text-indigo-600" />
                                        User Roles & Access Control
                                    </h3>
                                    <button className="text-xs font-black text-indigo-600 uppercase tracking-widest">+ New Role</button>
                                 </div>
                                 <div className="space-y-3">
                                     {['Owner', 'Administrator', 'Editor', 'Moderator'].map((role) => (
                                         <div key={role} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 group hover:border-indigo-500/30 transition-all">
                                             <div className="flex items-center gap-4">
                                                 <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center font-black text-indigo-600 shadow-sm">{role[0]}</div>
                                                 <div>
                                                     <p className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tighter">{role}</p>
                                                     <p className="text-xs text-slate-500 font-medium">Full access to systemic features</p>
                                                 </div>
                                             </div>
                                             <button className="px-4 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-[10px] font-black uppercase hover:border-indigo-600 transition-all">Manage Permissions</button>
                                         </div>
                                     ))}
                                 </div>
                             </section>
                         </div>
                        )}

                        {activeTab === 'payments' && (
                            <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                                <CreditCard size={48} className="mx-auto text-slate-300 mb-4" />
                                <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-widest">Connect Integrations</h3>
                                <p className="text-sm text-slate-500 font-medium mt-2">Add Stripe, PayPal, or Google Analytics to expand your store.</p>
                                <button className="mt-6 px-8 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/20">Browse App Marketplace</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;

import { BadgeCheck, Briefcase, Camera, Eye, EyeOff, Lock, Mail, MapPin, Phone, Save, Shield, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';

const Profile = () => {
    // Get current logged in user from storage
    const getSavedUser = () => {
        // Prioritize sessionStorage for active admin session, fallback to localStorage if needed
        const userStr = sessionStorage.getItem('admin_user') || localStorage.getItem('admin_user');
        return userStr ? JSON.parse(userStr) : null;
    };

    const savedUser = getSavedUser();

    const [admin, setAdmin] = useState({
        id: savedUser?.id || savedUser?.adminId || '',
        name: savedUser?.name || 'Admin User',
        email: savedUser?.email || 'admin@kalles.com',
        phone: savedUser?.phone || '+91 98765 43210',
        designation: savedUser?.role || savedUser?.designation || 'Super Admin',
        bio: savedUser?.bio || 'Responsible for managing the overall system, users, and product inventory.',
        avatar: savedUser?.avatar || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSex0_2jKFFviUr3QZCCN_v31N5_gF4_U_Z9Q&s',
        two_factor_enabled: !!savedUser?.two_factor_enabled
    });

    const [isEditing, setIsEditing] = useState(false);
    const [passwords, setPasswords] = useState({
        current: '',
        new: '',
        confirm: ''
    });
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64 = reader.result;
                setAdmin(prev => ({ ...prev, avatar: base64 }));
                
                // Update local storage for persistence
                const user = getSavedUser();
                if (user) {
                    user.avatar = base64;
                    localStorage.setItem('admin_user', JSON.stringify(user));
                    sessionStorage.setItem('admin_user', JSON.stringify(user));
                }

                // If admin ID is present, save to database immediately
                if (admin.id) {
                    try {
                        const updatedAdmin = { ...admin, avatar: base64 };
                        await axios.put(`http://localhost:5000/api/admin/${admin.id}/profile`, updatedAdmin);
                        console.log("Avatar updated in database");
                    } catch (err) {
                        console.error("Failed to update avatar in database:", err);
                    }
                }
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        const user = getSavedUser();
        if (user) {
            setAdmin(prev => ({
                ...prev,
                id: user.id || prev.id,
                name: user.name || prev.name,
                email: user.email || prev.email,
                phone: user.phone || prev.phone,
                designation: user.designation || user.role || prev.designation,
                bio: user.bio || prev.bio,
                avatar: user.avatar || prev.avatar,
                two_factor_enabled: !!user.two_factor_enabled
            }));
        }
    }, []);

    const handleToggle2FA = async () => {
        const newState = !admin.two_factor_enabled;
        try {
            setLoading(true);
            const res = await axios.post("http://localhost:5000/api/auth/toggle-2fa", {
                adminId: admin.id,
                enabled: newState
            });
            if (res.status === 200) {
                setAdmin(prev => ({ ...prev, two_factor_enabled: newState }));
                // Update storage
                const user = getSavedUser();
                const updatedUser = { ...user, two_factor_enabled: newState };
                localStorage.setItem('admin_user', JSON.stringify(updatedUser));
                sessionStorage.setItem('admin_user', JSON.stringify(updatedUser));
                alert(`Two-factor authentication ${newState ? 'enabled' : 'disabled'} successfully!`);
            }
        } catch (err) {
            console.error(err);
            alert("Failed to update 2FA status");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        if (!admin.id) {
            alert("Error: Admin ID not found. Please log out and log in again.");
            return;
        }
        setLoading(true);
        try {
            const res = await axios.put(`http://localhost:5000/api/admin/${admin.id}/profile`, admin);
            if (res.status === 200) {
                // Update local storage for immediate sync across tabs
                const user = getSavedUser();
                const updatedUser = { ...user, ...admin, role: admin.designation };
                localStorage.setItem('admin_user', JSON.stringify(updatedUser));
                sessionStorage.setItem('admin_user', JSON.stringify(updatedUser));
                setIsEditing(false);
                alert("Profile updated successfully!");
            }
        } catch (err) {
            console.error(err);
            const errorMsg = err.response?.data || err.message || "Error updating profile. Please try again.";
            alert(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (passwords.new !== passwords.confirm) {
            alert("New passwords do not match!");
            return;
        }
        setLoading(true);
        try {
            const res = await axios.put(`http://localhost:5000/api/admin/${admin.id}/password`, {
                currentPassword: passwords.current,
                newPassword: passwords.new
            });
            if (res.status === 200) {
                setPasswords({ current: '', new: '', confirm: '' });
                alert("Password changed successfully!");
            }
        } catch (err) {
            console.error(err);
            const errorMsg = err.response?.data || "Error changing password";
            alert(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-[1400px] mx-auto space-y-0 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="relative h-[280px] rounded-3xl shadow-2xl mb-12">
                <div className="absolute inset-0 bg-[#1a1c2e] rounded-3xl overflow-hidden">
                    {/* High-end gradient mesh */}
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-purple-900/40 to-indigo-900/40 animate-pulse duration-[10s]"></div>
                    <div className="absolute top-[-50%] left-[-20%] w-[100%] h-[150%] bg-gradient-to-r from-indigo-500/20 to-purple-500/20 blur-[100px] rounded-full rotate-45 animate-spin duration-[30s]"></div>
                    <div className="absolute bottom-[-30%] right-[-10%] w-[80%] h-[120%] bg-gradient-to-l from-indigo-600/20 to-pink-600/20 blur-[120px] rounded-full -rotate-12 animate-pulse duration-[8s]"></div>
                </div>

                {/* Profile Briefing Area - POSITIONED HIGHER IN BANNER */}
                <div className="absolute inset-x-0 bottom-4 sm:inset-x-auto sm:bottom-8 sm:left-12 flex flex-col sm:flex-row items-center sm:items-end gap-3 sm:gap-8 z-20 w-full sm:w-auto px-4 sm:px-0">
                    <div className="relative group shrink-0">
                        <div className="w-24 h-24 sm:w-40 sm:h-40 rounded-full border-[6px] sm:border-[10px] border-white/20 dark:border-slate-800/20 backdrop-blur-md shadow-2xl overflow-hidden bg-white/10 ring-4 sm:ring-8 ring-white/5">
                            <img src={admin.avatar} alt="Profile" className="w-full h-full object-cover" />
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleAvatarChange}
                            className="hidden"
                            accept="image/*"
                        />
                        <button
                            onClick={() => fileInputRef.current.click()}
                            className="absolute bottom-0 right-0 sm:bottom-2 sm:right-2 p-2 sm:p-3 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100 transform translate-y-1 group-hover:translate-y-0 border border-white/30"
                        >
                            <Camera className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                        </button>
                    </div>
                    <div className="pb-0 sm:pb-4 min-w-0 w-full flex flex-col items-center sm:items-start text-center sm:text-left">
                        <h1 className="text-3xl sm:text-4xl font-black text-white flex items-center justify-center sm:justify-start gap-2 sm:gap-3 tracking-tighter uppercase drop-shadow-lg break-words sm:break-normal">
                            <span className="truncate">{admin.name}</span>
                            <BadgeCheck className="text-white fill-white/20 shrink-0 w-7 h-7 sm:w-8 sm:h-8" />
                        </h1>
                        <p className="text-white/70 font-extrabold tracking-[0.15em] sm:tracking-[0.3em] uppercase text-[10px] sm:text-xs flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 mt-1 sm:mt-1.5 pl-0 sm:pl-1">
                            <Shield className="text-white/60 shrink-0 w-3 h-3 sm:w-[14px] sm:h-[14px]" />
                            <span className="truncate">{admin.designation}</span>
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-6">
                {/* Left Column - Stats/Shortcuts */}
                <div className="space-y-6">
                    <div className="glass-card p-6 rounded-3xl space-y-6">
                        <div className="space-y-4">
                            <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-3">Contact Info</h3>
                            <div className="flex items-center gap-4 text-slate-600 dark:text-slate-400">
                                <div className="w-10 h-10 shrink-0 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600">
                                    <Mail size={18} />
                                </div>
                                <div className="text-sm font-bold truncate flex-1 min-w-0">{admin.email}</div>
                            </div>
                            <div className="flex items-center gap-4 text-slate-600 dark:text-slate-400">
                                <div className="w-10 h-10 shrink-0 rounded-xl bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center text-purple-600">
                                    <Phone size={18} />
                                </div>
                                <div className="text-sm font-bold truncate flex-1 min-w-0">{admin.phone}</div>
                            </div>
                            <div className="flex items-center gap-4 text-slate-600 dark:text-slate-400">
                                <div className="w-10 h-10 shrink-0 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                                    <MapPin size={18} />
                                </div>
                                <div className="text-sm font-bold truncate flex-1 min-w-0">Mumbai, India</div>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card p-6 rounded-3xl space-y-4">
                        <div className="flex items-center justify-between group pt-2">
                            <div className="space-y-0.5">
                                <div className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">2FA Status</div>
                                <div className="text-[10px] font-bold text-slate-400">
                                    {admin.two_factor_enabled ? 'Active protection' : 'Account vulnerable'}
                                </div>
                            </div>
                            <button 
                                onClick={handleToggle2FA}
                                disabled={loading}
                                className={`relative inline-flex h-6 w-12 items-center rounded-full transition-all duration-300 focus:outline-none shadow-inner ${admin.two_factor_enabled ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`}
                            >
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-300 ${admin.two_factor_enabled ? 'translate-x-7' : 'translate-x-1'}`} />
                            </button>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="text-xs font-bold text-slate-500">Access Key</div>
                            <div className="text-[10px] font-mono select-all cursor-copy">KAL-******-7890</div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Edit Forms */}
                <div className="lg:col-span-2 space-y-8">
                    {/* General Information */}
                    <div className="glass-card p-8 rounded-3xl">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-xl font-black text-slate-900 dark:text-white">General Information</h2>
                                <p className="text-sm text-slate-500 font-medium">Update your public profile details</p>
                            </div>
                            {!isEditing && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="px-6 py-2 bg-[#222] text-white rounded-xl text-sm font-bold hover:bg-indigo-600 transition-all flex items-center gap-2"
                                >
                                    Edit Profile
                                </button>
                            )}
                        </div>

                        <form onSubmit={handleUpdateProfile} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="text"
                                            readOnly={!isEditing}
                                            value={admin.name}
                                            onChange={(e) => setAdmin({ ...admin, name: e.target.value })}
                                            className={`w-full pl-12 pr-4 py-3 ${isEditing ? 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500/20' : 'bg-slate-50 dark:bg-slate-900 border-transparent'} border rounded-2xl outline-none transition-all text-sm font-bold text-slate-900 dark:text-white`}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="email"
                                            readOnly={!isEditing}
                                            value={admin.email}
                                            onChange={(e) => setAdmin({ ...admin, email: e.target.value })}
                                            className={`w-full pl-12 pr-4 py-3 ${isEditing ? 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500/20' : 'bg-slate-50 dark:bg-slate-900 border-transparent'} border rounded-2xl outline-none transition-all text-sm font-bold text-slate-900 dark:text-white`}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="text"
                                            readOnly={!isEditing}
                                            value={admin.phone}
                                            onChange={(e) => setAdmin({ ...admin, phone: e.target.value })}
                                            className={`w-full pl-12 pr-4 py-3 ${isEditing ? 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500/20' : 'bg-slate-50 dark:bg-slate-900 border-transparent'} border rounded-2xl outline-none transition-all text-sm font-bold text-slate-900 dark:text-white`}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Designation</label>
                                    <div className="relative">
                                        <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="text"
                                            readOnly={!isEditing}
                                            value={admin.designation}
                                            onChange={(e) => setAdmin({ ...admin, designation: e.target.value })}
                                            className={`w-full pl-12 pr-4 py-3 ${isEditing ? 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500/20' : 'bg-slate-50 dark:bg-slate-900 border-transparent'} border rounded-2xl outline-none transition-all text-sm font-bold text-slate-900 dark:text-white`}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Bio / Description</label>
                                <textarea
                                    rows="3"
                                    readOnly={!isEditing}
                                    value={admin.bio}
                                    onChange={(e) => setAdmin({ ...admin, bio: e.target.value })}
                                    className={`w-full p-4 ${isEditing ? 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500/20' : 'bg-slate-50 dark:bg-slate-900 border-transparent'} border rounded-2xl outline-none transition-all text-sm font-medium text-slate-700 dark:text-slate-300`}
                                ></textarea>
                            </div>

                            {isEditing && (
                                <div className="flex items-center gap-4 pt-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-8 py-3 bg-indigo-600 text-white rounded-2xl text-sm font-bold hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/20"
                                    >
                                        <Save size={18} /> {loading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        className="px-8 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>

                    {/* Password Change */}
                    <div className="glass-card p-8 rounded-3xl">
                        <div className="mb-8">
                            <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                                <Lock size={20} className="text-indigo-600" />
                                Change Password
                            </h2>
                            <p className="text-sm text-slate-500 font-medium tracking-tight">Ensure your account is using a long, random password to stay secure.</p>
                        </div>

                        <form onSubmit={handleChangePassword} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Current Password</label>
                                    <div className="relative">
                                        <input
                                            type={showPasswords.current ? "text" : "password"}
                                            required
                                            value={passwords.current}
                                            onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                                            className="w-full px-4 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-bold text-slate-900 dark:text-white"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
                                        >
                                            {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest">New Password</label>
                                    <div className="relative">
                                        <input
                                            type={showPasswords.new ? "text" : "password"}
                                            required
                                            value={passwords.new}
                                            onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                                            className="w-full px-4 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-bold text-slate-900 dark:text-white"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
                                        >
                                            {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Confirm Password</label>
                                    <div className="relative">
                                        <input
                                            type={showPasswords.confirm ? "text" : "password"}
                                            required
                                            value={passwords.confirm}
                                            onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                                            className="w-full px-4 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-bold text-slate-900 dark:text-white"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
                                        >
                                            {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="flex pt-2">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-8 py-3 bg-[#222] text-white rounded-2xl text-sm font-bold hover:bg-black transition-all flex items-center gap-2 shadow-xl"
                                >
                                    {loading ? 'Processing...' : 'Update Password'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;

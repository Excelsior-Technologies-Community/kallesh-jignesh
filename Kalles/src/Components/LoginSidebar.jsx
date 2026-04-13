import React from 'react';
import { X, Mail, Lock, Eye, EyeOff, LogIn, ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../Context/CartContext';
import { useWishlist } from '../Context/WishlistContext';


const LoginSidebar = ({ isOpen, onClose, onSwitchToRegister, onLogin }) => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [showPassword, setShowPassword] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState('');
    const [focusedField, setFocusedField] = React.useState('');
    const navigate = useNavigate();
    const { reloadCart } = useCart();
    const { reloadWishlist } = useWishlist();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            // Store token and user data
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            // Reload cart and wishlist items for the new user
            reloadCart();
            reloadWishlist();
            
            // Also store in sessionStorage for current tab session
            sessionStorage.setItem('token', data.token);
            sessionStorage.setItem('user', JSON.stringify(data.user));

            if (onLogin) {
                onLogin(data.user);
            }

            // Close sidebar and reset form
            onClose();
            setEmail('');
            setPassword('');

            // Redirection logic
            if (data.isAdmin) {
                alert(`Welcome back Admin, ${data.user.name}!`);
                navigate('/admin/dashboard'); 
            } else {
                alert(`Welcome back, ${data.user.name}!`);
                navigate('/'); // New user/regular user goes to home
            }


        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[5000] transition-all duration-400 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={onClose}
            />

            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 right-0 w-[420px] max-w-full bg-white z-[5001] transform transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    } flex flex-col`}
                style={{ boxShadow: '-20px 0 60px rgba(0,0,0,0.15)' }}
            >
                {/* Header with gradient accent */}
                <div className="relative">
                    <div className="absolute top-0 left-0 right-0 h-1" style={{ background: 'linear-gradient(90deg, #43D1F0, #667eea, #764ba2)' }}></div>
                    <div className="flex items-center justify-between px-7 py-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #43D1F0, #667eea)' }}>
                                <LogIn size={18} className="text-white" />
                            </div>
                            <div>
                                <h2 className="text-[15px] font-bold tracking-wide text-[#1a1a2e] uppercase">
                                    Welcome Back
                                </h2>
                                <p className="text-[11px] text-gray-400 font-medium mt-0.5">Sign in to your account</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-9 h-9 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition-all duration-200 hover:rotate-90"
                        >
                            <X size={18} strokeWidth={2} className="text-gray-400" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 px-7 py-8 overflow-y-auto">
                    {/* Decorative illustration */}
                    <div className="flex justify-center mb-8">
                        <div className="relative">
                            <div className="w-20 h-20 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(67,209,240,0.1), rgba(102,126,234,0.1))' }}>
                                <Sparkles size={32} style={{ color: '#667eea' }} />
                            </div>
                            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #43D1F0, #667eea)' }}>
                                <span className="text-white text-[8px] font-bold">✦</span>
                            </div>
                        </div>
                    </div>

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        {error && (
                            <div className="flex items-center gap-3 p-4 rounded-xl border" style={{ background: 'rgba(239,68,68,0.04)', borderColor: 'rgba(239,68,68,0.15)' }}>
                                <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                                    <span className="text-red-500 text-sm">!</span>
                                </div>
                                <p className="text-[13px] text-red-500 font-medium">{error}</p>
                            </div>
                        )}

                        {/* Email Field */}
                        <div className="space-y-2">
                            <label className="text-[12px] text-gray-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                                <Mail size={12} />
                                Email Address
                            </label>
                            <div className={`relative rounded-xl border-2 transition-all duration-300 ${focusedField === 'email' ? 'border-[#667eea] shadow-[0_0_0_3px_rgba(102,126,234,0.1)]' : 'border-gray-100 hover:border-gray-200'}`}>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    disabled={loading}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onFocus={() => setFocusedField('email')}
                                    onBlur={() => setFocusedField('')}
                                    placeholder="Enter your email"
                                    className="w-full h-[52px] px-4 bg-transparent rounded-xl focus:outline-none text-[14px] text-[#1a1a2e] placeholder:text-gray-300"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <label className="text-[12px] text-gray-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                                <Lock size={12} />
                                Password
                            </label>
                            <div className={`relative rounded-xl border-2 transition-all duration-300 ${focusedField === 'password' ? 'border-[#667eea] shadow-[0_0_0_3px_rgba(102,126,234,0.1)]' : 'border-gray-100 hover:border-gray-200'}`}>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onFocus={() => setFocusedField('password')}
                                    onBlur={() => setFocusedField('')}
                                    placeholder="Enter your password"
                                    className="w-full h-[52px] px-4 pr-12 bg-transparent rounded-xl focus:outline-none text-[14px] text-[#1a1a2e] placeholder:text-gray-300"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-[#667eea] transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Forgot Password */}
                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={() => {
                                    onClose();
                                    navigate('/forgot-password');
                                }}
                                className="text-[12px] font-semibold hover:text-[#667eea] transition-colors bg-transparent border-none p-0"
                                style={{ color: '#667eea' }}
                            >
                                Forgot password?
                            </button>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`group w-full h-[52px] text-white text-[13px] font-bold uppercase tracking-widest rounded-xl transition-all duration-300 mt-2 flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-lg hover:-translate-y-0.5'}`}
                            style={{ background: loading ? '#999' : 'linear-gradient(135deg, #43D1F0, #667eea)' }}
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                                </>
                            )}
                        </button>

                        {/* Divider */}
                        <div className="flex items-center gap-4 my-4">
                            <div className="flex-1 h-px bg-gray-100"></div>
                            <span className="text-[11px] text-gray-300 font-semibold uppercase tracking-wider">or</span>
                            <div className="flex-1 h-px bg-gray-100"></div>
                        </div>

                        {/* Create Account */}
                        <div className="text-center">
                            <button
                                type="button"
                                onClick={onSwitchToRegister}
                                className="group w-full h-[48px] rounded-xl border-2 border-gray-100 hover:border-[#667eea] bg-transparent text-[13px] font-bold text-gray-500 hover:text-[#667eea] uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                Create New Account
                                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                            </button>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="px-7 py-4 border-t border-gray-50">
                    <p className="text-[11px] text-gray-300 text-center font-medium">
                        Secure login powered by Kalles · 256-bit SSL encryption
                    </p>
                </div>
            </div>
        </>
    );
};

export default LoginSidebar;

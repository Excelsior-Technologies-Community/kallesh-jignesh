import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Lock, Eye, EyeOff, ShieldCheck, ArrowRight, AlertCircle, Sparkles } from "lucide-react";

const ResetPassword = () => {
    const [formData, setFormData] = useState({
        newPassword: "",
        confirmPassword: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [focusedField, setFocusedField] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    // Get email and OTP from query params (passed from VerifyOtp)
    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get("email");
    const otp = queryParams.get("otp");
    const type = queryParams.get("type") || "user";

    useEffect(() => {
        if (!email || !otp) {
            navigate("/forgot-password");
        }
    }, [email, otp, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError("");
    };

    const getPasswordStrength = () => {
        const pwd = formData.newPassword;
        if (!pwd) return { width: '0%', color: '#e5e7eb', label: '' };
        if (pwd.length < 4) return { width: '25%', color: '#ef4444', label: 'Weak' };
        if (pwd.length < 6) return { width: '50%', color: '#f59e0b', label: 'Fair' };
        if (pwd.length < 8) return { width: '75%', color: '#43D1F0', label: 'Good' };
        return { width: '100%', color: '#10b981', label: 'Strong' };
    };

    const pwdStrength = getPasswordStrength();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.newPassword !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);
        setError("");
        setMessage("");

        try {
            const response = await axios.post("http://localhost:5000/api/auth/reset-password", {
                email,
                otp,
                newPassword: formData.newPassword,
                type: type
            });
            setMessage(response.data.message);
            
            // Redirect to login
            setTimeout(() => {
                navigate(type === 'admin' ? '/admin/login' : '/');
            }, 3000);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to reset password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#1a1c23] flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Brand Logo */}
                <div className="flex justify-center mb-8">
                    <img
                        src="https://kalles-5.myshopify.com/cdn/shop/files/kalles.svg?v=1717404087&width=190"
                        alt="Kalles Logo"
                        className="h-10 dark:invert"
                    />
                </div>

                {/* Reset Password Card */}
                <div className="bg-white dark:bg-[#24262d] rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800 relative">
                    <div className="absolute top-0 left-0 right-0 h-1.5" style={{ background: 'linear-gradient(90deg, #10b981, #667eea)' }}></div>
                    
                    <div className="p-8">
                        <div className="mb-8 text-center">
                            <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/10 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                                <ShieldCheck size={32} />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Secure Account</h2>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                Create a strong new password to protect <br />
                                <span className="font-semibold text-gray-800 dark:text-gray-200">{email}</span>
                            </p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-xl flex items-center gap-3 text-red-600 dark:text-red-400 text-[13px] font-medium animate-shake">
                                <AlertCircle size={18} />
                                <span>{error}</span>
                            </div>
                        )}

                        {message && (
                            <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/20 rounded-xl flex items-center gap-3 text-emerald-600 dark:text-emerald-400 text-[13px] font-medium">
                                <Sparkles size={18} />
                                <span>{message}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* New Password */}
                            <div className="space-y-2">
                                <label className="text-[12px] text-gray-400 font-semibold uppercase tracking-wider flex items-center gap-2">
                                    <Lock size={12} />
                                    New Password
                                </label>
                                <div className={`relative rounded-xl border-2 transition-all duration-300 ${focusedField === 'newPassword' ? 'border-[#667eea] shadow-[0_0_0_4px_rgba(102,126,234,0.1)]' : 'border-gray-50 dark:border-gray-800 hover:border-gray-100 dark:hover:border-gray-700'}`}>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="newPassword"
                                        required
                                        value={formData.newPassword}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedField('newPassword')}
                                        onBlur={() => setFocusedField('')}
                                        placeholder="Min. 6 characters"
                                        className="w-full h-12 px-4 pr-12 bg-transparent rounded-xl focus:outline-none text-[14px] text-gray-700 dark:text-white placeholder:text-gray-300"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-[#667eea] transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {/* Strength Meter */}
                                {formData.newPassword && (
                                    <div className="pt-1.5 space-y-1">
                                        <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full transition-all duration-500 ease-out"
                                                style={{ width: pwdStrength.width, backgroundColor: pwdStrength.color }}
                                            ></div>
                                        </div>
                                        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                                            <span style={{ color: pwdStrength.color }}>{pwdStrength.label}</span>
                                            <span className="text-gray-400">Security Grade</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-2">
                                <label className="text-[12px] text-gray-400 font-semibold uppercase tracking-wider flex items-center gap-2">
                                    <ShieldCheck size={12} />
                                    Confirm Password
                                </label>
                                <div className={`relative rounded-xl border-2 transition-all duration-300 ${focusedField === 'confirmPassword' ? 'border-[#667eea] shadow-[0_0_0_4px_rgba(102,126,234,0.1)]' : 'border-gray-50 dark:border-gray-800 hover:border-gray-100 dark:hover:border-gray-700'}`}>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="confirmPassword"
                                        required
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedField('confirmPassword')}
                                        onBlur={() => setFocusedField('')}
                                        placeholder="Repeat new password"
                                        className="w-full h-12 px-4 bg-transparent rounded-xl focus:outline-none text-[14px] text-gray-700 dark:text-white placeholder:text-gray-300"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !formData.newPassword}
                                className={`w-full py-4 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 group ${loading || !formData.newPassword ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-xl hover:-translate-y-0.5 active:scale-95'}`}
                                style={{ 
                                    background: loading || !formData.newPassword ? '#999' : 'linear-gradient(135deg, #43D1F0, #667eea)',
                                    boxShadow: loading || !formData.newPassword ? 'none' : '0 10px 20px rgba(67, 209, 240, 0.2)'
                                }}
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Update Password
                                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;

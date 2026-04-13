import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Mail, ArrowRight, AlertCircle, Sparkles, LogIn, ChevronLeft } from "lucide-react";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [focusedField, setFocusedField] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    
    // Get account type (user/admin) from query params
    const queryParams = new URLSearchParams(location.search);
    const accountType = queryParams.get("type") || "user";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");

        try {
            const response = await axios.post("http://localhost:5000/api/auth/forgot-password", { email });
            setMessage(response.data.message);
            
            // Redirect to verify OTP page with reset mode and type
            setTimeout(() => {
                navigate(`/verify-otp?email=${encodeURIComponent(email)}&mode=reset&type=${accountType}`);
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to send reset OTP");
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

                {/* Forgot Password Card */}
                <div className="bg-white dark:bg-[#24262d] rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800 relative">
                    <div className="absolute top-0 left-0 right-0 h-1.5" style={{ background: 'linear-gradient(90deg, #43D1F0, #667eea)' }}></div>
                    
                    <div className="p-8">
                        <div className="mb-8 text-center">
                            <div className="w-16 h-16 bg-[#43D1F0]/10 text-[#43D1F0] rounded-2xl flex items-center justify-center mx-auto mb-4 transform rotate-6 hover:rotate-0 transition-transform duration-300">
                                <Sparkles size={32} />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Forgot Password?</h2>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                Enter your email address and we'll send you an OTP to reset your password.
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

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[12px] text-gray-400 font-semibold uppercase tracking-wider flex items-center gap-2">
                                    <Mail size={12} />
                                    Email Address
                                </label>
                                <div className={`relative rounded-xl border-2 transition-all duration-300 ${focusedField ? 'border-[#43D1F0] shadow-[0_0_0_4px_rgba(67,209,240,0.1)]' : 'border-gray-50 dark:border-gray-800 hover:border-gray-100 dark:hover:border-gray-700'}`}>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        onFocus={() => setFocusedField(true)}
                                        onBlur={() => setFocusedField(false)}
                                        placeholder="Enter your email"
                                        className="w-full h-12 px-4 bg-transparent rounded-xl focus:outline-none text-[14px] text-gray-700 dark:text-white placeholder:text-gray-300"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-4 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 group ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-xl hover:-translate-y-0.5 active:scale-95'}`}
                                style={{ 
                                    background: loading ? '#999' : 'linear-gradient(135deg, #43D1F0, #667eea)',
                                    boxShadow: loading ? 'none' : '0 10px 20px rgba(67, 209, 240, 0.2)'
                                }}
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Send Reset OTP
                                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-8 text-center">
                            <button
                                onClick={() => navigate(-1)}
                                className="inline-flex items-center gap-2 text-gray-400 hover:text-[#43D1F0] font-medium text-sm transition-all group"
                            >
                                <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                                Back to Login
                            </button>
                        </div>
                    </div>
                </div>

                <p className="mt-8 text-center text-[12px] text-gray-400 font-medium">
                    New to Kalles? <button onClick={() => navigate("/")} className="text-[#43D1F0] hover:underline">Create an account</button>
                </p>
            </div>
        </div>
    );
};

export default ForgotPassword;

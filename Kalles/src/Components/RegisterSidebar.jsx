import { X, Eye, EyeOff } from 'lucide-react';
import React from 'react';
import { useCart } from '../Context/CartContext';
import { useWishlist } from '../Context/WishlistContext';

const RegisterSidebar = ({ isOpen, onClose, onSwitchToLogin, onLogin }) => {
    const { clearCart } = useCart();
    const { clearWishlist } = useWishlist();
    const [formData, setFormData] = React.useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState('');
    const [showPassword, setShowPassword] = React.useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: `${formData.firstName} ${formData.lastName}`.trim(),
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            if (data.otpSent) {
                clearCart();
                clearWishlist();
                onClose();
                window.location.href = `/verify-otp?email=${encodeURIComponent(formData.email)}`;
                return;
            }

            clearCart();
            clearWishlist();
            setFormData({ firstName: '', lastName: '', email: '', password: '' });
            onClose();
            alert('Registration completed! Please log in.');
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
                className={`fixed inset-0 bg-black/50 z-[5000] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={onClose}
            />

            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 right-0 w-[400px] max-w-full bg-white z-[5001] transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    } flex flex-col shadow-2xl`}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                    <h2 className="text-[14px] font-bold tracking-widest text-[#222] uppercase">
                        CREATE ACCOUNT
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-[#222] hover:text-[#43D1F0] transition-colors p-1"
                    >
                        <X size={24} strokeWidth={1.5} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 px-8 py-10 overflow-y-auto">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="p-3 bg-red-50 text-red-500 text-sm rounded-md border border-red-100">
                                {error}
                            </div>
                        )}

                        {/* First Name Field */}
                        <div className="space-y-2">
                            <label className="text-[13px] text-gray-500 font-medium">
                                First name
                            </label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="w-full h-12 px-4 border border-gray-200 rounded-md focus:outline-none focus:border-[#43D1F0] transition-colors text-[14px]"
                            />
                        </div>

                        {/* Last Name Field */}
                        <div className="space-y-2">
                            <label className="text-[13px] text-gray-500 font-medium">
                                Last name
                            </label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="w-full h-12 px-4 border border-gray-200 rounded-md focus:outline-none focus:border-[#43D1F0] transition-colors text-[14px]"
                            />
                        </div>

                        {/* Email Field */}
                        <div className="space-y-2">
                            <label className="text-[13px] text-gray-500 font-medium">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full h-12 px-4 border border-gray-200 rounded-md focus:outline-none focus:border-[#43D1F0] transition-colors text-[14px]"
                            />
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <label className="text-[13px] text-gray-500 font-medium">
                                Password <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full h-12 px-4 border border-gray-200 rounded-md focus:outline-none focus:border-[#43D1F0] transition-colors text-[14px]"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#43D1F0] transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full h-12 bg-[#43D1F0] text-white text-[13px] font-bold uppercase tracking-widest rounded-full hover:bg-[#222] transition-colors mt-4 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Registering...' : 'Register'}
                        </button>

                        {/* Switch to Login */}
                        <div className="text-center mt-6">
                            <button
                                type="button"
                                onClick={onSwitchToLogin}
                                className="text-[13px] text-gray-400 hover:text-[#43D1F0] transition-colors underline decoration-dotted bg-transparent border-none cursor-pointer"
                            >
                                Already have an account? Login here
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default RegisterSidebar;

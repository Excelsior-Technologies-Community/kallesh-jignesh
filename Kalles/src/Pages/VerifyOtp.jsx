import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { ShieldCheck, Mail, ArrowRight, AlertCircle, RefreshCcw } from "lucide-react";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Get email from query params
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email");

  const mode = queryParams.get("mode"); // 'reset' or null (login)
  const type = queryParams.get("type") || "user"; // 'user' or 'admin'

  useEffect(() => {
    if (!email) {
      navigate("/");
    }
  }, [email, navigate]);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/api/auth/verify-otp", {
        email,
        otp,
      });

      const data = response.data;

      if (mode === "reset") {
        // Redirect to reset password page with email, otp and type
        navigate(`/reset-password?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}&type=${encodeURIComponent(type)}`);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      alert("Verification Successful!");
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError("");
    try {
      await axios.post("http://localhost:5000/api/auth/resend-otp", { email });
      alert("A new OTP has been sent to your email!");
    } catch (err) {
      setError(err.response?.data?.message || "Error resending OTP");
    } finally {
      setResending(false);
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

        {/* Verification Card */}
        <div className="bg-white dark:bg-[#24262d] rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-800">
          <div className="mb-8 text-center">
            <div className="w-16 h-16 bg-[#43D1F0]/10 text-[#43D1F0] rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Two-Step Verification</h2>
            <p className="text-gray-500 dark:text-gray-400">
              We've sent a 6-digit code to <br />
              <span className="font-semibold text-gray-800 dark:text-gray-200">{email}</span>
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-xl flex items-center gap-3 text-red-600 dark:text-red-400 text-sm">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleVerify} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Verification Code</label>
              <div className="relative group">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  className="w-full text-center text-3xl tracking-[1em] py-4 bg-gray-50 dark:bg-[#1a1c23] border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-[#43D1F0]/20 focus:border-[#43D1F0] dark:text-white transition-all font-mono"
                  disabled={loading}
                  autoFocus
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className={`w-full py-4 bg-[#43D1F0] hover:bg-[#3bb8d4] text-white font-bold rounded-xl shadow-lg shadow-[#43D1F0]/20 transition-all flex items-center justify-center gap-2 group ${loading || otp.length !== 6 ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Verify & Log In
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
              Didn't receive the code?
            </p>
            <button
              onMouseDown={handleResend}
              disabled={resending}
              className="inline-flex items-center gap-2 text-[#43D1F0] hover:text-[#3bb8d4] font-medium transition-colors disabled:opacity-50"
            >
              <RefreshCcw size={16} className={resending ? "animate-spin" : ""} />
              Resend Code
            </button>
          </div>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="mt-8 w-full text-center text-gray-500 dark:text-gray-400 text-sm hover:text-[#43D1F0] transition-colors"
        >
          ← Back to Login
        </button>
      </div>
    </div>
  );
};

export default VerifyOtp;

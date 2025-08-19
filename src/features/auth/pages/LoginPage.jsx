import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, Building, User, Globe } from "lucide-react";
import { login } from "../services/authService";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "", remember: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await login(form);
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-blue-50 via-indigo-50 to-green-100 flex items-center justify-center p-4 overflow-hidden">
      {/* Background SVG Patterns */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating geometric shapes */}
        <svg className="absolute top-16 left-16 w-24 h-24 text-blue-200 opacity-50" viewBox="0 0 100 100" fill="currentColor">
          <circle cx="50" cy="50" r="40" className="animate-pulse"/>
        </svg>
        <svg className="absolute top-1/3 right-20 w-20 h-20 text-green-200 opacity-40" viewBox="0 0 100 100" fill="currentColor">
          <polygon points="50,10 85,75 15,75" className="animate-bounce"/>
        </svg>
        <svg className="absolute bottom-24 left-1/3 w-28 h-28 text-purple-200 opacity-30" viewBox="0 0 100 100" fill="currentColor">
          <rect x="20" y="20" width="60" height="60" rx="10" className="animate-spin" style={{animationDuration: '10s'}}/>
        </svg>
        {/* Grid pattern background */}
        <svg className="absolute inset-0 w-full h-full opacity-5" viewBox="0 0 100 100">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" className="text-gray-400"/>
        </svg>
        {/* Decorative dots */}
        <div className="absolute top-1/4 left-24">
          <div className="w-3 h-3 bg-blue-300 rounded-full animate-ping"></div>
        </div>
        <div className="absolute top-2/3 right-40">
          <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
        </div>
        <div className="absolute bottom-1/4 left-2/5">
          <div className="w-3 h-3 bg-purple-300 rounded-full animate-bounce"></div>
        </div>
        {/* Abstract flowing shapes */}
        <svg className="absolute top-0 right-0 w-80 h-80 opacity-10" viewBox="0 0 400 400">
          <path d="M100,200 Q200,100 300,200 Q200,300 100,200 Z" fill="url(#gradient1)"/>
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6"/>
              <stop offset="50%" stopColor="#8B5CF6"/>
              <stop offset="100%" stopColor="#10B981"/>
            </linearGradient>
          </defs>
        </svg>
        <svg className="absolute bottom-0 left-0 w-72 h-72 opacity-10" viewBox="0 0 300 300">
          <path d="M50,150 Q150,50 250,150 Q150,250 50,150 Z" fill="url(#gradient2)"/>
          <defs>
            <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981"/>
              <stop offset="50%" stopColor="#3B82F6"/>
              <stop offset="100%" stopColor="#F59E0B"/>
            </linearGradient>
          </defs>
        </svg>
        {/* Floating icons */}
        <div className="absolute top-32 right-1/4 text-blue-200 opacity-25">
          <Building className="w-10 h-10 animate-float" style={{animation: 'float 7s ease-in-out infinite'}}/>
        </div>
        <div className="absolute bottom-40 right-24 text-green-200 opacity-25">
          <Globe className="w-8 h-8 animate-float" style={{animation: 'float 5s ease-in-out infinite 1.5s'}}/>
        </div>
        <div className="absolute top-1/2 left-20 text-purple-200 opacity-25">
          <User className="w-9 h-9 animate-float" style={{animation: 'float 6s ease-in-out infinite 0.5s'}}/>
        </div>
        {/* Additional decorative elements */}
        <div className="absolute top-20 left-1/2 w-32 h-32 bg-gradient-to-r from-green-200/20 to-blue-200/20 rounded-full blur-2xl"></div>
        <div className="absolute bottom-32 right-1/3 w-40 h-40 bg-gradient-to-r from-purple-200/20 to-green-200/20 rounded-full blur-3xl"></div>
      </div>

      {/* Main login container */}
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl w-full max-w-sm border border-white/20 relative z-10">
        {/* Glassmorphism overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 rounded-2xl"></div>
        <div className="relative z-10 p-6">
          {/* Header with icon */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-green-600 rounded-xl mx-auto mb-3 flex items-center justify-center shadow-md">
              <Lock className="w-6 h-6 text-white"/>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Welcome Back</h2>
            <p className="text-gray-600 text-xs">Login to your account</p>
          </div>
          {/* Error Alert */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg mb-4 shadow-sm text-sm">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            </div>
          )}
          <div className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white/50 backdrop-blur-sm"
                    required
                  />
                </div>
              </div>
              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-xs font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white/50 backdrop-blur-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              {/* Remember me & Forgot password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center text-xs text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    name="remember"
                    checked={form.remember}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Remember me
                </label>
                <a href="#" className="text-xs text-green-600 hover:text-green-500 font-medium">
                  Forgot password?
                </a>
              </div>
              {/* Login button */}
              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg transition-all duration-200 font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-500"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center text-sm">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Signing in...
                  </span>
                ) : (
                  "Login"
                )}
              </button>
            </form>
          </div>
          {/* Divider */}
          <div className="my-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white text-gray-500">or</span>
            </div>
          </div>
          {/* Register link */}
          <p className="text-center text-xs text-gray-600 mt-6">
            Don't have an account?{" "}
            <a href="/register" className="text-green-600 hover:text-green-500 font-medium">
              Register
            </a>
          </p>
        </div>
      </div>
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
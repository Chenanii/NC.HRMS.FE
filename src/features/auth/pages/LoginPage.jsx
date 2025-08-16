import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, Building, User, Globe } from "lucide-react";

// Simulated auth service function
const login = async (form) => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  if (form.email === "test@example.com" && form.password === "password123") {
    return { token: "fake-jwt-token", user: { name: "John Doe" } };
  }
  throw new Error("Invalid credentials");
};

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "", remember: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Please enter both email and password");
      return;
    }

    setLoading(true);

    try {
      const data = await login(form);
      console.log("Login successful:", data);
      // localStorage.setItem("token", data.token); // Commented out for demo
      alert("Login successful! Redirecting to dashboard...");
      // window.location.href = "/dashboard";
    } catch (err) {
      setError(err.message || "Something went wrong");
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
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md border border-white/20 relative z-10">
        {/* Glassmorphism overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 rounded-3xl"></div>
        
        <div className="relative z-10 p-8">
          {/* Header with icon */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
              <Lock className="w-8 h-8 text-white"/>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-600 text-sm">Sign in to your account</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 shadow-sm">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            </div>
          )}

          <div className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  id="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="w-full pl-11 pr-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  className="w-full pl-11 pr-12 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember me & Forgot password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center text-sm text-gray-600 cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={form.remember}
                    onChange={(e) => handleChange("remember", e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded border-2 transition-all duration-200 ${
                    form.remember 
                      ? 'bg-gradient-to-r from-green-500 to-blue-500 border-green-500' 
                      : 'bg-white border-gray-300 hover:border-gray-400'
                  }`}>
                    {form.remember && (
                      <svg className="w-3 h-3 text-white absolute top-0.5 left-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="ml-2">Remember me</span>
              </label>
              <a href="#" className="text-sm text-transparent bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text hover:from-green-500 hover:to-blue-500 font-medium transition-all duration-200">
                Forgot password?
              </a>
            </div>

            {/* Login button */}
            <button
              type="submit"
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-3 rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </div>

          {/* Divider */}
          <div className="my-8 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">or</span>
            </div>
          </div>

          {/* Social login buttons
          <div className="space-y-3">
            <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white/50 hover:bg-white/80 transition-all duration-200 hover:shadow-md">
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
          </div> */}

          {/* Sign up link */}
          <p className="text-center text-sm text-gray-600 mt-8">
            Don't have an account?{" "}
            <a href="/register" className="text-transparent bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text hover:from-green-500 hover:to-blue-500 font-medium transition-all duration-200">
              Sign up
            </a>
          </p>

          {/* Demo credentials hint */}
          {/* <div className="mt-6 p-3 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-200/50">
            <p className="text-xs text-gray-600 text-center">
              <strong>Demo:</strong> Use test@example.com / password123
            </p>
          </div> */}
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
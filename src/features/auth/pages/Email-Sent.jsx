import React, { useState, useEffect } from 'react';
import { Mail, Clock, RefreshCw, Check, ArrowLeft, Building, User, Globe } from 'lucide-react';

const EmailSentPage = ({ 
  email = "user@example.com", 
  companyName = "Your Company",
  subdomain = "your-company",
  onResendEmail,
  onBackToLogin 
}) => {
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  // Cooldown timer for resend button
  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleResendEmail = async () => {
    if (resendCooldown > 0 || isResending) return;

    setIsResending(true);
    
    try {
      if (onResendEmail) {
        await onResendEmail(email);
      }
      setShowSuccess(true);
      setResendCooldown(60); // 60 second cooldown
      
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to resend email:', error);
    } finally {
      setIsResending(false);
    }
  };

  const handleBackToLogin = () => {
    if (onBackToLogin) {
      onBackToLogin();
    } else {
      window.location.href = '/login';
    }
  };

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-blue-50 via-indigo-50 to-green-100 flex items-center justify-center p-4 overflow-hidden">
      {/* Background SVG Patterns - Same as registration */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating geometric shapes */}
        <svg className="absolute top-10 left-10 w-20 h-20 text-blue-200 opacity-60" viewBox="0 0 100 100" fill="currentColor">
          <circle cx="50" cy="50" r="40" className="animate-pulse"/>
        </svg>
        
        <svg className="absolute top-1/4 right-16 w-16 h-16 text-green-200 opacity-50" viewBox="0 0 100 100" fill="currentColor">
          <polygon points="50,10 85,75 15,75" className="animate-bounce"/>
        </svg>
        
        <svg className="absolute bottom-20 left-1/4 w-24 h-24 text-purple-200 opacity-40" viewBox="0 0 100 100" fill="currentColor">
          <rect x="20" y="20" width="60" height="60" rx="10" className="animate-spin" style={{animationDuration: '8s'}}/>
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
        <div className="absolute top-1/3 left-20">
          <div className="w-2 h-2 bg-blue-300 rounded-full animate-ping"></div>
        </div>
        <div className="absolute top-2/3 right-32">
          <div className="w-3 h-3 bg-green-300 rounded-full animate-pulse"></div>
        </div>
        <div className="absolute bottom-1/3 left-1/3">
          <div className="w-2 h-2 bg-purple-300 rounded-full animate-bounce"></div>
        </div>

        {/* Abstract flowing shapes */}
        <svg className="absolute top-0 right-0 w-96 h-96 text-gradient opacity-10" viewBox="0 0 400 400">
          <path d="M100,200 Q200,100 300,200 Q200,300 100,200 Z" fill="url(#gradient1)"/>
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6"/>
              <stop offset="50%" stopColor="#8B5CF6"/>
              <stop offset="100%" stopColor="#10B981"/>
            </linearGradient>
          </defs>
        </svg>

        <svg className="absolute bottom-0 left-0 w-80 h-80 text-gradient opacity-10" viewBox="0 0 300 300">
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
        <div className="absolute top-20 right-1/4 text-blue-200 opacity-30">
          <Building className="w-8 h-8 animate-float" style={{animation: 'float 6s ease-in-out infinite'}}/>
        </div>
        <div className="absolute bottom-32 right-20 text-green-200 opacity-30">
          <Globe className="w-6 h-6 animate-float" style={{animation: 'float 4s ease-in-out infinite 1s'}}/>
        </div>
        <div className="absolute top-1/2 left-16 text-purple-200 opacity-30">
          <User className="w-7 h-7 animate-float" style={{animation: 'float 5s ease-in-out infinite 2s'}}/>
        </div>
      </div>

      {/* Main content container */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md border border-white/20 relative z-10">
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 rounded-3xl"></div>

        <div className="relative z-10">
            {/* Success notification */}
            {showSuccess && (
            <div className="absolute top-4 left-4 right-4 bg-green-50 border border-green-200 rounded-lg p-3 flex items-center animate-slide-down z-20 text-sm text-green-700">
                <Check className="w-4 h-4 text-green-600 mr-2" />
                Confirmation email resent successfully!
            </div>
            )}

            {/* Header */}
            <div className="text-center p-6 pb-4">
            <div className="w-12 h-12 bg-green-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg animate-pulse">
                <Mail className="w-6 h-6 text-white"/>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Check Your Email</h1>
            <p className="text-sm text-gray-600">We've sent a confirmation link to verify your account</p>
            </div>

            {/* Email info card */}
            <div className="px-6 pb-6 space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-4 border border-blue-100 text-center">
                <p className="text-sm text-gray-700">Confirmation email sent to:</p>
                <p className="font-semibold text-gray-900 break-all">{email}</p>
            </div>

            {/* Notice */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start">
                <Clock className="w-5 h-5 text-amber-600 mr-2 mt-0.5" />
                <div className="text-sm text-amber-700">
                <p className="font-medium text-amber-800">Important</p>
                <p>The confirmation link will expire in 24 hours. Check spam if not found.</p>
                </div>
            </div>

            {/* Buttons */}
            <div className="space-y-3">
                <button
                onClick={handleResendEmail}
                disabled={isResending || resendCooldown > 0}
                className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white text-sm rounded-xl shadow-lg transition-all disabled:opacity-50"
                >
                {isResending ? (
                    <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Resending...
                    </>
                ) : resendCooldown > 0 ? (
                    <>
                    <Clock className="w-4 h-4 mr-2" />
                    Resend in {resendCooldown}s
                    </>
                ) : (
                    <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Resend Email
                    </>
                )}
                </button>

                <button
                onClick={handleBackToLogin}
                className="w-full flex items-center justify-center px-4 py-3 text-gray-600 hover:text-gray-800 text-sm border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
                >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Login
                </button>
            </div>
            </div>

            {/* Footer */}
            <div className="text-center p-4 pt-0 border-t border-gray-100/50 text-xs text-gray-600">
            Need help?{" "}
            <a href="/support" className="text-blue-600 hover:text-blue-700 font-medium">Contact Support</a>
            </div>
        </div>
        </div>


      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        @keyframes slide-down {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default EmailSentPage;
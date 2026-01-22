import React, { useState, useEffect } from 'react';
import { Mail, Clock, RefreshCw, Check, ArrowLeft, Building, User, Globe } from 'lucide-react';
import { apiClient } from '../../utilits/apiClient';

const EmailSentPage = () => {
  const [email, setEmail] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get('email');
    const storedEmail = localStorage.getItem('registration_email');
    
    setEmail(emailParam || storedEmail || 'user@example.com');
    
    if (storedEmail) {
      localStorage.removeItem('registration_email');
    }
  }, []);

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
    if (resendCooldown > 0 || isResending || !email) return;

    setIsResending(true);
    setShowError(false);
    setErrorMessage('');
    
    try {
      const res = await apiClient.post('/api/Auth/resend-confirmation', { email });
      const data = res.data;

      if (!data?.isError) {
        setShowSuccess(true);
        setResendCooldown(60);
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        throw new Error(data.message || 'Failed to resend confirmation email');
      }
    } catch (error) {
      setErrorMessage(error.message || 'Failed to resend email. Please try again.');
      setShowError(true);
      setTimeout(() => setShowError(false), 5000);
    } finally {
      setIsResending(false);
    }
  };

  const handleBackToLogin = () => {
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-blue-50 via-indigo-50 to-green-100 flex items-center justify-center p-4 overflow-hidden">
      {/* Background SVG Patterns */}
      <div className="absolute inset-0 overflow-hidden">
        <svg className="absolute top-10 left-10 w-20 h-20 text-blue-200 opacity-60" viewBox="0 0 100 100" fill="currentColor">
          <circle cx="50" cy="50" r="40" className="animate-pulse"/>
        </svg>
        
        <svg className="absolute top-1/4 right-16 w-16 h-16 text-green-200 opacity-50" viewBox="0 0 100 100" fill="currentColor">
          <polygon points="50,10 85,75 15,75" className="animate-bounce"/>
        </svg>
        
        <svg className="absolute bottom-20 left-1/4 w-24 h-24 text-purple-200 opacity-40" viewBox="0 0 100 100" fill="currentColor">
          <rect x="20" y="20" width="60" height="60" rx="10" className="animate-spin" style={{animationDuration: '8s'}}/>
        </svg>

        <svg className="absolute inset-0 w-full h-full opacity-5" viewBox="0 0 100 100">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" className="text-gray-400"/>
        </svg>

        <div className="absolute top-1/3 left-20">
          <div className="w-2 h-2 bg-blue-300 rounded-full animate-ping"></div>
        </div>
        <div className="absolute top-2/3 right-32">
          <div className="w-3 h-3 bg-green-300 rounded-full animate-pulse"></div>
        </div>
        <div className="absolute bottom-1/3 left-1/3">
          <div className="w-2 h-2 bg-purple-300 rounded-full animate-bounce"></div>
        </div>

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
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 rounded-3xl"></div>

        <div className="relative z-10">
          {/* Success notification */}
          {showSuccess && (
            <div className="absolute top-4 left-4 right-4 bg-green-50 border border-green-200 rounded-lg p-3 flex items-center animate-slide-down z-20 text-sm text-green-700 shadow-lg">
              <Check className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
              Confirmation email resent successfully!
            </div>
          )}

          {/* Error notification */}
          {showError && (
            <div className="absolute top-4 left-4 right-4 bg-red-50 border border-red-200 rounded-lg p-3 flex items-start animate-slide-down z-20 text-sm text-red-700 shadow-lg">
              <div className="w-4 h-4 rounded-full bg-red-200 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                <span className="text-red-700 text-xs font-bold">!</span>
              </div>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Header */}
          <div className="text-center p-6 pb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg animate-pulse">
              <Mail className="w-8 h-8 text-white"/>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Check Your Email</h1>
            <p className="text-sm text-gray-600">We've sent a confirmation link to verify your account</p>
          </div>

          {/* Email info card */}
          <div className="px-6 pb-6 space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-4 border border-blue-100">
              <p className="text-xs text-gray-600 mb-1 text-center">Confirmation email sent to:</p>
              <p className="font-semibold text-gray-900 break-all text-center text-sm">{email}</p>
            </div>

            {/* Notice */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start">
              <Clock className="w-5 h-5 text-amber-600 mr-3 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-800">
                <p className="font-medium text-amber-900 mb-1">Important</p>
                <p>The confirmation link will expire in 24 hours. If you don't see the email, check your spam folder.</p>
              </div>
            </div>

            {/* Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleResendEmail}
                disabled={isResending || resendCooldown > 0}
                className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-sm font-medium rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 disabled:transform-none"
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
                    Resend Confirmation Email
                  </>
                )}
              </button>

              <button
                onClick={handleBackToLogin}
                className="w-full flex items-center justify-center px-4 py-3 text-gray-700 hover:text-gray-900 text-sm font-medium border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all transform hover:scale-105"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Login
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center p-6 pt-4 border-t border-gray-100/50">
            <p className="text-xs text-gray-600">
              Need help?{" "}
              <a href="/support" className="text-green-600 hover:text-green-700 font-medium transition-colors underline">
                Contact Support
              </a>
            </p>
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
import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Loader, Mail, ArrowRight, Building, User, Globe, AlertTriangle } from 'lucide-react';

const EmailConfirmPage = () => {
  const [confirmationState, setConfirmationState] = useState('loading'); // 'loading', 'success', 'error', 'invalid'
  const [errorMessage, setErrorMessage] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [firstName, setFirstName] = useState('');

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        // Get URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get('userId');
        const token = urlParams.get('token');

        // Validate required parameters
        if (!userId || !token) {
          setConfirmationState('invalid');
          setErrorMessage('Invalid confirmation link. Missing required parameters.');
          return;
        }

        const API_BASE_URL = "https://nthaka.com/hrms/api/Auth";

        // API call for email confirmation
        const response = await fetch(`${API_BASE_URL}/confirm-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: userId,
            token: decodeURIComponent(token)
          })
        });

        if (response.ok) {
          const result = await response.json();
          
          // Check if the response indicates an error
          if (result.isError) {
            setConfirmationState('error');
            setErrorMessage(result.message || 'Email confirmation failed.');
          } else {
            // Success case
            setConfirmationState('success');
            
            // Extract user information from the result if available
            if (result.result) {
              setUserEmail(result.result.email || 'your email');
              setFirstName(result.result.firstName || '');
            } else {
              setUserEmail('your email');
            }
          }
        } else {
          // Handle HTTP errors
          const errorData = await response.json();
          setConfirmationState('error');
          
          if (response.status === 400) {
            setErrorMessage(errorData.message || 'Invalid or expired confirmation link.');
          } else if (response.status === 500) {
            setErrorMessage(errorData.message || 'An error occurred while confirming email.');
          } else {
            setErrorMessage('An unexpected error occurred. Please try again later.');
          }
        }
      } catch (error) {
        console.error('Email confirmation error:', error);
        setConfirmationState('error');
        setErrorMessage('Network error. Please check your connection and try again.');
      }
    };

    // Add a small delay for better UX
    const timer = setTimeout(() => {
      confirmEmail();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleProceedToLogin = () => {
    window.location.href = '/login';
  };

  const handleResendConfirmation = () => {
    // In a real application, this would trigger a resend API call
    window.location.href = '/resend-confirmation';
  };

  const renderContent = () => {
    switch (confirmationState) {
      case 'loading':
        return (
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-blue-600 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-lg">
              <Loader className="w-8 h-8 text-white animate-spin"/>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Confirming Your Email</h1>
            <p className="text-gray-600 mb-6">Please wait while we verify your email address...</p>
            <div className="flex justify-center">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        );

      case 'success':
        return (
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-green-600 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-lg animate-bounce-once">
              <CheckCircle className="w-8 h-8 text-white"/>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Email Confirmed Successfully!</h1>
            <p className="text-gray-600 mb-6">
              {firstName && `Welcome ${firstName}! `}Your email address has been verified and your account is now active.
            </p>
            
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-4 border border-green-100 mb-6">
              <div className="flex items-center justify-center mb-2">
                <Mail className="w-5 h-5 text-green-600 mr-2"/>
                <span className="text-sm font-medium text-gray-700">Verified Email:</span>
              </div>
              <p className="font-semibold text-gray-900 break-all">{userEmail}</p>
            </div>

            <button
              onClick={handleProceedToLogin}
              className="w-full flex items-center justify-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-xl shadow-lg transition-all transform hover:scale-105"
            >
              Continue to Login
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        );

      case 'error':
        return (
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-red-600 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-lg">
              <XCircle className="w-8 h-8 text-white"/>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Confirmation Failed</h1>
            <p className="text-gray-600 mb-6">We couldn't confirm your email address.</p>
            
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-red-600 mr-2 mt-0.5 flex-shrink-0"/>
                <div className="text-left">
                  <p className="font-medium text-red-800 mb-1">Error Details:</p>
                  <p className="text-sm text-red-700">{errorMessage}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleResendConfirmation}
                className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl shadow-lg transition-all"
              >
                <Mail className="w-4 h-4 mr-2" />
                Request New Confirmation
              </button>
              
              <button
                onClick={handleProceedToLogin}
                className="w-full flex items-center justify-center px-4 py-3 text-gray-600 hover:text-gray-800 text-sm border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
              >
                Back to Login
              </button>
            </div>
          </div>
        );

      case 'invalid':
        return (
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-amber-600 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-lg">
              <AlertTriangle className="w-8 h-8 text-white"/>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Link</h1>
            <p className="text-gray-600 mb-6">This confirmation link is invalid or malformed.</p>
            
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-amber-700">
                Please check that you've copied the complete link from your email, or request a new confirmation email.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleResendConfirmation}
                className="w-full flex items-center justify-center px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded-xl shadow-lg transition-all"
              >
                <Mail className="w-4 h-4 mr-2" />
                Request New Confirmation
              </button>
              
              <button
                onClick={handleProceedToLogin}
                className="w-full flex items-center justify-center px-4 py-3 text-gray-600 hover:text-gray-800 text-sm border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
              >
                Back to Login
              </button>
            </div>
          </div>
        );

      default:
        return null;
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
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnuse">
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
          {renderContent()}

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
        @keyframes bounce-once {
          0%, 20%, 53%, 80%, 100% {
            animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
            transform: translate3d(0,0,0);
          }
          40%, 43% {
            animation-timing-function: cubic-bezier(0.755, 0.050, 0.855, 0.060);
            transform: translate3d(0, -10px, 0);
          }
          70% {
            animation-timing-function: cubic-bezier(0.755, 0.050, 0.855, 0.060);
            transform: translate3d(0, -5px, 0);
          }
          90% {
            transform: translate3d(0,-2px,0);
          }
        }
        .animate-bounce-once {
          animation: bounce-once 1s ease-out;
        }
      `}</style>
    </div>
  );
};

export default EmailConfirmPage;
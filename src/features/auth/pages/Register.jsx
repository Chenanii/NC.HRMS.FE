import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Eye, EyeOff, Building, User, Mail, Briefcase, Globe, Check, X, Loader2, ChevronRight, ChevronLeft } from 'lucide-react';
import { registerUser, registerWithGoogle, checkSubdomainAvailability } from "../services/authService"; 

const RegistrationForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    companyName: '',
    subdomain: '',
    jobTitle: ''
  });
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [isGoogleSignUp, setIsGoogleSignUp] = useState(false);
  const [googleCredential, setGoogleCredential] = useState(null);
  const [subdomainCheck, setSubdomainCheck] = useState({
    isChecking: false,
    isAvailable: null,
    lastChecked: ''
  });
  const googleButtonRef = useRef(null);

  const steps = [
    { id: 1, title: 'Personal Info', fields: ['firstName', 'lastName', 'email'] },
    { id: 2, title: 'Company Setup', fields: ['companyName', 'subdomain', 'jobTitle'] },
    { id: 3, title: 'Security', fields: ['password'] }
  ];

  // Decode Google JWT to extract user info
  const decodeGoogleJWT = (credential) => {
    try {
      const base64Url = credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding Google JWT:', error);
      return null;
    }
  };

  const handleGoogleSignUp = useCallback(async (response) => {
    setGoogleLoading(true);
    setFeedback({ type: "", message: "" });
    
    try {
      const credential = response.credential;
      const decodedToken = decodeGoogleJWT(credential);
      
      if (decodedToken) {
        const fullName = decodedToken.name || '';
        const nameParts = fullName.trim().split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';
        
        setFormData(prev => ({
          ...prev,
          email: decodedToken.email || '',
          firstName: firstName,
          lastName: lastName,
        }));
        
        setGoogleCredential(credential);
        setIsGoogleSignUp(true);
        
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.email;
          delete newErrors.firstName;
          delete newErrors.lastName;
          delete newErrors.password; 
          return newErrors;
        });
        
        if (firstName && decodedToken.email) {
          setCurrentStep(2);
          setFeedback({ type: "success", message: "Successfully signed in with Google!" });
        }
      }
    } catch (error) {
      console.error('Google sign-up error:', error);
      setFeedback({ type: "error", message: "Failed to process Google account. Please try again." });
      setIsGoogleSignUp(false);
      setGoogleCredential(null);
    } finally {
      setGoogleLoading(false);
    }
  }, []);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google && googleButtonRef.current) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID",
          callback: handleGoogleSignUp,
          auto_select: false,
        });

        window.google.accounts.id.renderButton(
          googleButtonRef.current,
          {
            theme: "outline",
            size: "large",
            width: googleButtonRef.current.offsetWidth,
            text: "signup_with",
            locale: "en",
          }
        );
      }
    };
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [handleGoogleSignUp]);

  const debouncedCheckSubdomain = useCallback(
    (() => {
      let timeout;
      return (subdomain) => {
        clearTimeout(timeout);
        timeout = setTimeout(async () => {
          if (subdomain && subdomain.length >= 3 && /^[a-zA-Z0-9-]+$/.test(subdomain)) {
            setSubdomainCheck(prev => ({ ...prev, isChecking: true }));
            try {
              const isAvailable = await checkSubdomainAvailability(subdomain);
              setSubdomainCheck({
                isChecking: false,
                isAvailable,
                lastChecked: subdomain
              });
            } catch (error) {
              console.error('Subdomain check error:', error);
              setSubdomainCheck(prev => ({ ...prev, isChecking: false }));
            }
          } else {
            setSubdomainCheck({
              isChecking: false,
              isAvailable: null,
              lastChecked: ''
            });
          }
        }, 500);
      };
    })(),
    []
  );

  useEffect(() => {
    if (formData.subdomain) {
      debouncedCheckSubdomain(formData.subdomain);
    }
  }, [formData.subdomain, debouncedCheckSubdomain]);

  const validateStep = (step) => {
    const newErrors = {};
    const currentFields = steps.find(s => s.id === step)?.fields || [];

    currentFields.forEach(field => {
      if (field === 'email') {
        if (!formData.email.trim()) {
          newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = 'Please enter a valid email';
        }
      } else if (field === 'password') {
        if (!isGoogleSignUp) {
          if (!formData.password.trim()) {
            newErrors.password = 'Password is required';
          } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
          }
        }
      } else if (field === 'firstName') {
        if (!formData.firstName.trim()) {
          newErrors.firstName = 'First name is required';
        }
      } else if (field === 'lastName') {
        if (!formData.lastName.trim()) {
          newErrors.lastName = 'Last name is required';
        }
      } else if (field === 'companyName') {
        if (!formData.companyName.trim()) {
          newErrors.companyName = 'Company name is required';
        }
      } else if (field === 'subdomain') {
        if (!formData.subdomain.trim()) {
          newErrors.subdomain = 'Subdomain is required';
        } else if (!/^[a-zA-Z0-9-]+$/.test(formData.subdomain)) {
          newErrors.subdomain = 'Only letters, numbers, and hyphens allowed';
        } else if (formData.subdomain.length < 3) {
          newErrors.subdomain = 'Must be at least 3 characters';
        } else if (subdomainCheck.lastChecked === formData.subdomain && subdomainCheck.isAvailable === false) {
          newErrors.subdomain = 'This Workspace name is already taken';
        } else if (subdomainCheck.isChecking || (formData.subdomain !== subdomainCheck.lastChecked && formData.subdomain.length >= 3)) {
          newErrors.subdomain = 'Checking availability...';
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
      setFeedback({ type: "", message: "" });
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setFeedback({ type: "", message: "" });
  };

  const handleSubmit = async () => {
    // For Google sign-up, we're on step 2 (company setup) when submitting
    // For regular sign-up, we're on step 3 (security)
    if (!validateStep(currentStep)) return;

    setIsLoading(true);
    setFeedback({ type: "", message: "" });

    try {
      let result;
      
      if (isGoogleSignUp && googleCredential) {
        const registrationData = {
          credential: googleCredential,
          companyName: formData.companyName,
          subdomain: formData.subdomain,
          jobTitle: formData.jobTitle || '',
        };
        result = await registerWithGoogle(googleCredential, registrationData);
      } else {
        result = await registerUser({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          companyName: formData.companyName,
          subdomain: formData.subdomain,
          jobTitle: formData.jobTitle || '',
        });
      }
      
      setFeedback({ 
        type: "success", 
        message: isGoogleSignUp 
          ? "Account created successfully with Google!" 
          : "Registration successful! Check your email to verify your account."
      });

      setTimeout(() => {
      if (isGoogleSignUp) {
        let requestResponse = result.requestResponse;

        localStorage.setItem("nc_hrms_token", requestResponse.result.token);
        localStorage.setItem("nc_hrms_permissions", JSON.stringify(requestResponse.result.permissions));
        localStorage.setItem("nc_hrms_user", JSON.stringify(requestResponse.result.user));

        window.location.href = "/dashboard";
      } else {
        localStorage.setItem('registration_email', formData.email);
        window.location.href = `/email-sent?email=${encodeURIComponent(formData.email)}`;
       }
      }, 1500);

    } catch (error) {
      console.error("Registration failed:", error);

      const errorMsg = error?.response?.data?.message 
        || error.message 
        || "Registration failed. Please try again.";
      
      setFeedback({ type: "error", message: errorMsg });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    disabled={isGoogleSignUp}
                    className={`w-full pl-9 pr-3 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                      errors.firstName ? 'border-red-500' : 'border-gray-300'
                    } ${isGoogleSignUp ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                    placeholder="John"
                  />
                </div>
                {errors.firstName && <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>}
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    disabled={isGoogleSignUp}
                    className={`w-full pl-9 pr-3 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                      errors.lastName ? 'border-red-500' : 'border-gray-300'
                    } ${isGoogleSignUp ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                    placeholder="Doe"
                  />
                </div>
                {errors.lastName && <p className="mt-1 text-xs text-red-600">{errors.lastName}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isGoogleSignUp}
                  className={`w-full pl-9 pr-3 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  } ${isGoogleSignUp ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                  placeholder="john@company.com"
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
              {isGoogleSignUp && (
                <p className="mt-1 text-xs text-green-600 flex items-center">
                  <Check className="w-3 h-3 mr-1" />
                  Pre-filled from Google account
                </p>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
                Company Name *
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className={`w-full pl-9 pr-3 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                    errors.companyName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Your Company Inc."
                />
              </div>
              {errors.companyName && <p className="mt-1 text-xs text-red-600">{errors.companyName}</p>}
            </div>

            <div>
              <label htmlFor="subdomain" className="block text-sm font-medium text-gray-700 mb-1">
                Workspace Name *
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  id="subdomain"
                  name="subdomain"
                  value={formData.subdomain}
                  onChange={handleInputChange}
                  className={`w-full pl-9 pr-10 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                    errors.subdomain 
                      ? 'border-red-500' 
                      : subdomainCheck.isAvailable === true && subdomainCheck.lastChecked === formData.subdomain
                      ? 'border-green-500'
                      : 'border-gray-300'
                  }`}
                  placeholder="your-company"
                />
                
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {subdomainCheck.isChecking ? (
                    <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
                  ) : subdomainCheck.isAvailable === true && subdomainCheck.lastChecked === formData.subdomain ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : subdomainCheck.isAvailable === false && subdomainCheck.lastChecked === formData.subdomain ? (
                    <X className="w-4 h-4 text-red-500" />
                  ) : null}
                </div>
              </div>
              
              <p className="mt-1 text-xs text-gray-500">
                www.nexacircuit-hrms.com/{formData.subdomain || 'your-company'}
              </p>
              
              {subdomainCheck.lastChecked === formData.subdomain && formData.subdomain && (
                <p className={`text-xs flex items-center mt-1 ${
                  subdomainCheck.isAvailable === true 
                    ? 'text-green-600' 
                    : subdomainCheck.isAvailable === false 
                    ? 'text-red-600' 
                    : 'text-gray-500'
                }`}>
                  {subdomainCheck.isAvailable === true ? (
                    <>
                      <Check className="w-3 h-3 mr-1" />
                      Available
                    </>
                  ) : subdomainCheck.isAvailable === false ? (
                    <>
                      <X className="w-3 h-3 mr-1" />
                      Already taken
                    </>
                  ) : null}
                </p>
              )}
              
              {subdomainCheck.isAvailable === false && subdomainCheck.lastChecked === formData.subdomain && (
                <div className="mt-2">
                  <p className="text-xs text-gray-600 mb-1">Try these:</p>
                  <div className="flex flex-wrap gap-1">
                    {[
                      `${formData.subdomain}-app`,
                      `${formData.subdomain}-co`,
                      `${formData.subdomain}hq`
                    ].map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, subdomain: suggestion }))}
                        className="px-2 py-1 text-xs bg-green-50 text-green-700 rounded hover:bg-green-100 transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {errors.subdomain && <p className="mt-1 text-xs text-red-600">{errors.subdomain}</p>}
            </div>

            <div>
              <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-1">
                Job Title <span className="text-gray-400">(optional)</span>
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  id="jobTitle"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleInputChange}
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  placeholder="CEO, Developer, etc."
                />
              </div>
            </div>
          </div>
        );

      case 3:
        // Skip password step if using Google sign-up
        if (isGoogleSignUp) {
          return (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-700">
                <div className="flex items-center">
                  <Check className="w-5 h-5 mr-2 text-green-600" />
                  <p>You're signing up with Google. No password needed!</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 text-center">
                Review your information and click "Create Account" to complete registration.
              </p>
            </div>
          );
        }
        
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full pl-3 pr-10 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
              <p className="mt-1 text-xs text-gray-500">Must be at least 8 characters long</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600">
              <h4 className="font-medium mb-2">Password should include:</h4>
              <ul className="space-y-1">
                <li className="flex items-center">
                  <div className={`w-1.5 h-1.5 rounded-full mr-2 ${formData.password.length >= 8 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  At least 8 characters
                </li>
                <li className="flex items-center">
                  <div className={`w-1.5 h-1.5 rounded-full mr-2 ${/[A-Z]/.test(formData.password) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  One uppercase letter
                </li>
                <li className="flex items-center">
                  <div className={`w-1.5 h-1.5 rounded-full mr-2 ${/\d/.test(formData.password) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  One number
                </li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const totalSteps = isGoogleSignUp ? 2 : 3;
  const visibleSteps = isGoogleSignUp ? steps.filter(s => s.id !== 3) : steps;

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-blue-50 via-indigo-50 to-green-100 flex items-center justify-center p-4 overflow-hidden">
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

      <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md border border-white/20 relative z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 rounded-3xl"></div>
        
        <div className="relative z-10">
          <div className="text-center p-6 pb-4">
            <div className="w-16 h-16 bg-green-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
              <User className="w-8 h-8 text-white"/>
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-1">Create Your Account</h1>
            <p className="text-sm text-gray-600">Step {currentStep} of {totalSteps}</p>
          </div>

          {currentStep === 1 && !isGoogleSignUp && (
            <div className="px-6 pb-4">
              <div ref={googleButtonRef} className="w-full flex justify-center mb-4"></div>
              {googleLoading && (
                <div className="text-center mb-2">
                  <span className="flex items-center justify-center text-sm text-gray-600">
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing Google account...
                  </span>
                </div>
              )}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-3 bg-white text-gray-500">or continue with email</span>
                </div>
              </div>
            </div>
          )}

          <div className="px-6 pb-4">
            <div className="flex items-center justify-between mb-2">
              {visibleSteps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300 ${
                    step.id < currentStep 
                      ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg' 
                      : step.id === currentStep 
                      ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg animate-pulse' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {step.id < currentStep ? <Check className="w-4 h-4" /> : index + 1}
                  </div>
                  {index < visibleSteps.length - 1 && (
                    <div className={`w-8 h-1 mx-2 rounded-full transition-all duration-500 ${
                      step.id < currentStep ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gray-200'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-600">
              {visibleSteps.map((step) => (
                <span key={step.id} className={step.id === currentStep ? 'font-medium text-green-600' : ''}>
                  {step.title}
                </span>
              ))}
            </div>
          </div>

          {feedback.message && (
            <div className="px-6 pb-4">
              <div
                className={`px-4 py-2 rounded-lg text-sm flex items-center ${
                  feedback.type === "success"
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {feedback.type === "success" ? (
                  <Check className="w-4 h-4 mr-2 text-green-600 flex-shrink-0" />
                ) : (
                  <X className="w-4 h-4 mr-2 text-red-600 flex-shrink-0" />
                )}
                <span>{feedback.message}</span>
              </div>
            </div>
          )}

          <div className="px-6 pb-6">
            <div className="transition-all duration-300 ease-in-out">
              {renderStepContent()}
            </div>

            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="flex items-center px-4 py-2 text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:bg-gray-50 rounded-lg"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back
              </button>

              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-sm rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white text-sm rounded-lg focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </span>
                  ) : (
                    'Create Account'
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="text-center p-4 pt-0 border-t border-gray-100/50">
            <p className="text-xs text-gray-600">
              Already have an account?{' '}
              <a href="/login" className="text-green-600 hover:text-green-700 font-medium transition-all duration-200">
                Login
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
      `}</style>
    </div>
  );
};

export default RegistrationForm;
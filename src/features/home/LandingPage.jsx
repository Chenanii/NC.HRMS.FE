import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ChevronDown, Star, Users, Shield, Zap, ArrowUp, Menu, X, Play, Check } from "lucide-react";
import logo from "../../assets/images/logo.png";
import logowhite from "../../assets/images/logo-white.png";
import { Link, useLocation  } from "react-router-dom";

export default function EnhancedNcHrmsLanding() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const { scrollY } = useScroll();
  const scrollProgress = useTransform(scrollY, [0, 1000], [0, 100]);

  useEffect(() => {
    function onScroll() {
      const scrolled = window.scrollY;
      setIsSticky(scrolled > 20);
      setShowBackToTop(scrolled > 500);
    }
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);


  const faqs = [
    {
      question: "How quickly can we get started with NC.HRMS?",
      answer: "You can be up and running in under 30 minutes! Our express setup wizard guides you through adding employees, setting up basic policies, and configuring your first payroll run."
    },
    {
      question: "Can NC.HRMS handle Malawian payroll requirements?",
      answer: "Yes! NC.HRMS is built for the Malawian market with support for PAYE calculations, pension contributions, and local labor law compliance."
    },
    {
      question: "What happens to my data if I cancel?",
      answer: "You own your data completely. You can export all employee records, payroll history, and reports at any time. We provide a 30-day grace period to download your data after cancellation."
    },
    {
      question: "Do you provide training and onboarding support?",
      answer: "Yes! Every Pro plan includes personalized onboarding, video training sessions, and 24/7 priority support. Our team will ensure your HR team is confident using the platform."
    }
  ];

  const stats = [
    { value: "15hrs", label: "Average Time Saved/Month" },
    { value: "99.9%", label: "Uptime Guarantee" }
  ];

  const [currentNotification, setCurrentNotification] = useState(0);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 antialiased overflow-x-hidden">
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-600 to-blue-600 origin-left z-50"
        style={{ scaleX: scrollProgress, transformOrigin: "0%" }}
      />

  
      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-40 bg-green-700 text-white p-3 rounded-full shadow-lg hover:bg-green-800 transition-colors"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Navbar */}
      <header
        className={`fixed w-full z-50 transition-all duration-300 py-4 ${
          isSticky ? "bg-white/95 backdrop-blur-md shadow-lg" : "bg-transparent"
        }`}>
        <div className="container mx-auto px-4 flex items-center justify-between">
          <motion.a 
            href="#home" 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
                <img src={logo} alt="NC.HRMS" className="h-12 w-auto" />
           </motion.a>

          <div className="flex-1 flex items-center justify-center gap-8">
            <nav className="hidden lg:flex items-center gap-1">
              {["Home", "Services", "Features", "Pricing", "Contact"].map((item) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="px-4 py-2 text-green-800 hover:text-green-700 rounded-lg hover:bg-green-50 transition-all"
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
                >
                  {item}
                </motion.a>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="hidden sm:inline-flex items-center gap-2 rounded-lg px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-medium shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Login
            </Link>
            
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-md border"
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white/95 backdrop-blur-md border-t shadow-lg"
            >
              <div className="container mx-auto px-4 py-4 flex flex-col gap-1">
                {["Home", "Services", "Features", "Pricing", "Contact"].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="py-3 px-2 text-green-800 hover:text-green-700 hover:bg-green-50 rounded-md transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item}
                  </a>
                ))}
                
                <div className="border-t border-gray-200 my-2"></div>
                
                <div className="pt-2">
                  <a 
                    href="#"
                    className="flex items-center justify-center gap-2 rounded-lg px-6 py-3 bg-green-700 text-white font-semibold hover:bg-green-800 transition-colors shadow-md"
                  >
                    Login to Your Account
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="pt-15">
        {/* Hero */}
        <section id="home" className="relative overflow-hidden bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 py-20">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute top-10 right-10 w-64 h-64 bg-gradient-to-br from-green-200/30 to-blue-200/30 rounded-full blur-3xl"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute bottom-10 left-10 w-80 h-80 bg-gradient-to-br from-purple-200/30 to-green-200/30 rounded-full blur-3xl"
            />
          </div>

          <motion.div 
            className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div className="py-12" variants={itemVariants}>
              <motion.span 
                className="inline-flex items-center bg-gradient-to-r from-green-100 to-blue-100 text-green-700 rounded-full px-4 py-2 text-sm font-medium shadow-sm"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                HR Tools • OnBoarding • Payroll • Leave • Analytics
              </motion.span>

              <motion.h4
                className="mt-2 text-4xl md:text-6xl font-extrabold leading-tight bg-gradient-to-r from-slate-900 via-green-700 to-blue-700 bg-clip-text text-transparent"
                variants={itemVariants}
              >
                Streamline your people operations with NC.HRMS
              </motion.h4>

              <motion.p 
                className="mt-5 text-lg text-slate-600 max-w-xl leading-relaxed"
                variants={itemVariants}
              >
                Centralize employee records, automate payroll & leave, and get real-time analytics - all in one
                modern HR platform built for growing teams.
              </motion.p>

              <motion.div 
                className="mt-8 flex flex-wrap gap-4 items-center"
                variants={itemVariants}
              >
                <Link 
                  to="register" 
                  className="inline-flex items-center gap-2 rounded-xl px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold shadow-lg hover:shadow-xl hover:text-white"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play className="w-4 h-4" />
                  Start Free Trial
                </Link>
                <motion.a 
                  href="#features" 
                  className="inline-flex items-center gap-2 px-8 py-4 border-2 border-green-600 rounded-xl text-green-800 hover:bg-green-50 font-semibold"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Explore Features
                </motion.a>
              </motion.div>

              {/* Stats */}
              <motion.div 
                className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6"
                variants={containerVariants}
              >
                {stats.map((stat, i) => (
                  <motion.div key={i} className="text-center" variants={itemVariants}>
                    <div className="text-2xl md:text-3xl font-bold text-green-700">{stat.value}</div>
                    <div className="text-sm text-slate-600">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div className="relative" variants={itemVariants}>
              <motion.div
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 max-h-[560px] border border-white/20"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 10,
                  duration: 0.6,
                }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="space-y-6">
                  <motion.div
                    className="h-6 bg-gradient-to-r from-green-300 to-blue-300 rounded-lg w-3/4"
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  />
                  <motion.div
                    className="h-40 bg-gradient-to-r from-green-100 via-blue-100 to-purple-100 rounded-xl shadow-inner"
                    animate={{ y: [0, -8, 0] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  />
                  <div className="grid grid-cols-3 gap-4">
                    {Array(3)
                      .fill(0)
                      .map((_, i) => (
                        <motion.div
                          key={i}
                          className="h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg shadow-sm"
                          animate={{ y: [0, -12, 0] }}
                          transition={{
                            repeat: Infinity,
                            duration: 2 + i * 0.5,
                            ease: "easeInOut",
                            delay: i * 0.3,
                          }}
                        />
                      ))}
                  </div>
                  <div className="space-y-3">
                    <motion.div
                      className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg w-1/2"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    />
                    <motion.div
                      className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg w-2/3"
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ repeat: Infinity, duration: 2.5 }}
                    />
                  </div>
                </div>
              </motion.div>

              {/* Floating Elements */}
              <motion.div 
                className="absolute -top-6 right-8 hidden xl:block"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 }}
              >
                <motion.div 
                  className="flex items-center gap-3 p-4 rounded-2xl bg-white/90 backdrop-blur-sm shadow-xl border border-white/20"
                  whileHover={{ scale: 1.05 }}
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                >
                  <div className="rounded-full bg-gradient-to-r from-green-600 to-green-700 h-12 w-12 flex items-center justify-center text-white font-bold">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div className="text-sm">
                    <div className="font-semibold">Express Setup</div>
                    <div className="text-xs text-slate-500">Ready in 30 minutes</div>
                  </div>
                </motion.div>
              </motion.div>

              <motion.div 
                className="absolute bottom-12 left-8 hidden xl:block"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 }}
              >
                <motion.div 
                  className="flex items-center gap-3 p-4 rounded-2xl bg-white/90 backdrop-blur-sm shadow-xl border border-white/20"
                  whileHover={{ scale: 1.05 }}
                  animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 2.5, delay: 1 }}
                >
                  <div className="rounded-full bg-gradient-to-r from-blue-600 to-purple-600 h-12 w-12 flex items-center justify-center text-white font-bold">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div className="text-sm">
                    <div className="font-semibold">24/7 Support</div>
                    <div className="text-xs text-slate-500">Always here to help</div>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </section>

        {/* Services */}
        <motion.section 
          id="services" 
          className="py-20 bg-white"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="container mx-auto px-4 text-center max-w-3xl mb-16">
            <motion.span 
              className="text-sm text-green-700 uppercase font-semibold tracking-wider"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Services
            </motion.span>
            <motion.h2 
              className="text-4xl md:text-5xl font-bold mt-4 bg-gradient-to-r from-slate-900 to-green-700 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
            >
              Everything your HR team needs
            </motion.h2>
            <motion.p 
              className="text-slate-600 mt-4 text-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
            >
              Employee lifecycle management, payroll automation, leave & attendance, performance, and analytics.
            </motion.p>
          </div>

          <motion.div 
            className="container mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              { title: 'Employee Management', desc: 'Central employee directory, profiles & documents', icon: <Users className="w-8 h-8" />, color: 'from-blue-500 to-blue-600' },
              { title: 'Payroll & Benefits', desc: 'Automated payroll runs, taxes & benefit management', icon: '💳', color: 'from-green-500 to-green-600' },
              { title: 'Leave Management', desc: 'Requests, approvals and accruals', icon: '🌴', color: 'from-purple-500 to-purple-600' },
              { title: 'Recruitment', desc: 'Job boards, applicants & interview scheduling', icon: '🧭', color: 'from-indigo-500 to-indigo-600' },
              { title: 'Analytics', desc: 'People analytics, retention & headcount trends', icon: '📊', color: 'from-teal-500 to-teal-600' },
              { title: 'Integrations', desc: 'APIs, SSO, accounting & calendar sync', icon: '🔗', color: 'from-cyan-500 to-cyan-600' }
            ].map((s, i) => (
              <motion.div 
                key={s.title} 
                className="group bg-white p-8 rounded-2xl shadow-lg border border-slate-100 hover:shadow-2xl transition-all duration-300 hover:border-green-200"
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <div className={`mx-auto w-16 h-16 flex items-center justify-center rounded-2xl bg-gradient-to-r ${s.color} group-hover:scale-110 transition-transform duration-300`}>
                  {typeof s.icon === 'string' ? (
                    <span className="text-2xl">{s.icon}</span>
                  ) : (
                    <div className="text-white">{s.icon}</div>
                  )}
                </div>
                <h3 className="mt-6 font-bold text-xl group-hover:text-green-700 transition-colors">{s.title}</h3>
                <p className="mt-3 text-slate-600 leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>



        {/* Features */}
        <motion.section 
          id="features" 
          className="py-20 bg-white"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="bg-gradient-to-br from-green-100 via-blue-100 to-purple-100 rounded-2xl shadow-2xl w-full h-[400px] flex items-center justify-center relative overflow-hidden">
                <motion.div 
                  className="text-8xl text-green-600"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 4,
                    ease: "easeInOut"
                  }}
                >
                  ⚡
                </motion.div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <span className="text-sm text-green-700 uppercase font-semibold tracking-wider">Focused on people</span>
              <h2 className="text-4xl md:text-5xl font-bold mt-4 bg-gradient-to-r from-slate-900 to-green-700 bg-clip-text text-transparent">
                Our approach to HR - modern, secure, human
              </h2>
              <p className="mt-6 text-lg text-slate-600 leading-relaxed">
                Our HRMS is built to reduce manual HR work and help people teams do more strategic work: hiring, developing and retaining talent.
              </p>

              <div className="mt-8 space-y-6">
                {[
                  { icon: <Check className="w-6 h-6" />, title: "Secure & Compliant", desc: "GDPR-ready data handling and role-based access control." },
                  { icon: "⚙️", title: "Highly Customizable", desc: "Configure workflows, approval chains and custom fields to match your processes." },
                  { icon: "📡", title: "Real-time Insights", desc: "People analytics and exportable reports for leadership." }
                ].map((feature, i) => (
                  <motion.div 
                    key={i}
                    className="flex gap-4 group"
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * i, duration: 0.6 }}
                    viewport={{ once: true }}
                    whileHover={{ x: 10 }}
                  >
                    <div className="w-14 h-14 rounded-2xl border-2 border-green-100 flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 group-hover:border-green-300 transition-all">
                      {typeof feature.icon === 'string' ? (
                        <span className="text-xl">{feature.icon}</span>
                      ) : (
                        <div className="text-green-600">{feature.icon}</div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg group-hover:text-green-700 transition-colors">{feature.title}</h4>
                      <p className="text-slate-600 leading-relaxed mt-1">{feature.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* FAQ Section */}
        <motion.section 
          className="py-20 bg-gradient-to-br from-slate-50 to-green-50"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center mb-16">
              <motion.span 
                className="text-sm text-green-700 uppercase font-semibold tracking-wider"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                FAQ
              </motion.span>
              <motion.h2 
                className="text-4xl md:text-5xl font-bold mt-4 bg-gradient-to-r from-slate-900 to-green-700 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                viewport={{ once: true }}
              >
                Frequently Asked Questions
              </motion.h2>
              <motion.p 
                className="text-lg text-slate-600 mt-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
              >
                Everything you need to know about NC.HRMS
              </motion.p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <motion.div 
                  key={i}
                  className="bg-white rounded-2xl shadow-lg border border-white/50 overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
                  viewport={{ once: true }}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-green-50 transition-colors"
                  >
                    <span className="font-semibold text-lg text-slate-900">{faq.question}</span>
                    <motion.div
                      animate={{ rotate: openFaq === i ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="w-6 h-6 text-green-600" />
                    </motion.div>
                  </button>
                  
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-8 pb-6 text-slate-600 leading-relaxed">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Pricing Section */}
        <motion.section 
          id="pricing" 
          className="py-20 bg-white"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <motion.span 
                className="text-sm text-green-700 uppercase font-semibold tracking-wider"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                Pricing
              </motion.span>
              <motion.h2 
                className="text-4xl md:text-5xl font-bold mt-4 bg-gradient-to-r from-slate-900 to-green-700 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                viewport={{ once: true }}
              >
                Simple pricing for everyone
              </motion.h2>
              <motion.p 
                className="text-lg text-slate-600 mt-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
              >
                Start for free, upgrade when you're ready for more features.
              </motion.p>
            </div>

            <motion.div 
              className="grid md:grid-cols-2 gap-10 max-w-3xl mx-auto"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {/* Free Plan */}
              <motion.div 
                className="bg-white rounded-2xl shadow-xl border-2 border-slate-200 p-8 hover:shadow-2xl transition-all duration-300"
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <div className="text-center">
                  <h3 className="text-3xl font-bold text-slate-900">Free</h3>
                  <p className="text-slate-600 mt-2">Perfect to get started</p>
                  <div className="mt-6">
                    <span className="text-5xl font-bold text-slate-900">$0</span>
                    <span className="text-slate-600">/month</span>
                  </div>
                  <div className="text-2xl font-semibold text-slate-700 mt-2">
                    MWK 0<span className="text-slate-600 text-base">/month</span>
                  </div>
                  <p className="text-sm text-slate-500 mt-2">Free for 7 days</p>
                </div>

                <ul className="mt-8 space-y-4">
                  {[
                    "Up to 2 employees",
                    "Employee directory", 
                    "Basic leave management",
                    "Time tracking",
                    "Email support"
                  ].map((feature, i) => (
                    <motion.li 
                      key={i}
                      className="flex items-center gap-3"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * i }}
                      viewport={{ once: true }}
                    >
                      <Check className="w-5 h-5 text-green-600" />
                      <span className="text-slate-700">{feature}</span>
                    </motion.li>
                  ))}
                </ul>

                <motion.button 
                  className="w-full mt-8 px-6 py-4 border-2 border-green-700 text-green-700 rounded-xl font-semibold hover:bg-green-50 transition-all text-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Get Started Free
                </motion.button>
              </motion.div>

              {/* Pro Plan */}
              <motion.div 
                className="bg-white rounded-2xl shadow-2xl border-2 border-green-600 p-8 relative hover:shadow-3xl transition-all duration-300"
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                    Recommended
                  </span>
                </div>
                
                <div className="text-center">
                  <h3 className="text-3xl font-bold text-slate-900">Pro</h3>
                  <p className="text-slate-600 mt-2">Everything you need to scale</p>
                  <div className="mt-6">
                    <span className="text-5xl font-bold text-slate-900">$12</span>
                    <span className="text-slate-600">/month</span>
                  </div>
                  <div className="text-2xl font-semibold text-slate-700 mt-2">
                    MWK 20,400<span className="text-slate-600 text-base">/month</span>
                  </div>
                  <p className="text-sm text-slate-500 mt-2">Billed monthly</p>
                </div>

                <ul className="mt-8 space-y-4">
                  {[
                    "Unlimited employees",
                    "Everything in Free",
                    "Payroll management",
                    "Performance reviews",
                    "Advanced analytics",
                    "Priority support"
                  ].map((feature, i) => (
                    <motion.li 
                      key={i}
                      className="flex items-center gap-3"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * i }}
                      viewport={{ once: true }}
                    >
                      <Check className="w-5 h-5 text-green-600" />
                      <span className="text-slate-700">{feature}</span>
                    </motion.li>
                  ))}
                </ul>

                <motion.button 
                  className="w-full mt-8 px-6 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold hover:shadow-lg transition-all text-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Start 14-Day Trial
                </motion.button>
              </motion.div>
            </motion.div>

            <motion.div 
              className="text-center mt-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
            >
              <p className="text-slate-600 mb-4">No credit card required for free plan or trial. Cancel anytime.</p>
            </motion.div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section 
          className="py-20 bg-gradient-to-br from-green-600 via-green-700 to-blue-700 text-white relative overflow-hidden"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{backgroundImage: `radial-gradient(circle at 25% 25%, white 2px, transparent 2px), radial-gradient(circle at 75% 75%, white 2px, transparent 2px)`, backgroundSize: '50px 50px'}}></div>
          </div>
          
          <div className="container mx-auto px-4 text-center relative z-10">
            <motion.h3 
              className="text-4xl md:text-5xl font-bold mb-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Ready to transform your HR operations?
            </motion.h3>
            <motion.p 
              className="text-xl text-green-100 mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
            >
              Start a free trial or request a demo with our sales team.
            </motion.p>
            <motion.div 
              className="flex items-center justify-center gap-4 flex-wrap"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Link 
                to="register" 
                className="px-8 py-4 bg-white text-green-700 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Free Trial
              </Link>
              <motion.a 
                href="#" 
                className="px-8 py-4 border-2 border-white rounded-xl text-white hover:bg-white hover:text-green-700 font-semibold transition-all"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Request Demo
              </motion.a>
            </motion.div>
          </div>
        </motion.section>
<footer id="contact" className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white py-20 overflow-hidden">
          {/* Architectural Grid Background */}
          <div className="absolute inset-0 opacity-5">
            <div className="grid grid-cols-12 h-full">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="border-r border-white/10"></div>
              ))}
            </div>
          </div>
          
          {/* Geometric Accent Elements */}
          <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-blue-400/20"></div>
          <div className="absolute bottom-0 right-0 w-48 h-48 border-r-2 border-b-2 border-blue-400/15"></div>
          <div className="absolute top-1/2 left-1/4 w-1 h-24 bg-gradient-to-b from-blue-400/30 to-transparent transform -translate-y-1/2"></div>
          
          <motion.div 
            className="relative container mx-auto px-6 grid lg:grid-cols-3 gap-12 max-w-7xl"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <motion.div 
                className="flex items-center gap-4 mb-6 group"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-400/20 blur-xl rounded-full group-hover:bg-blue-400/30 transition-all duration-300"></div>
                  <img src={logowhite} alt="NC.HRMS" className="relative h-14 w-auto filter drop-shadow-lg" />
                </div>
                <div className="border-l-2 border-blue-400/40 pl-4">
                  <span className="font-bold text-2xl tracking-wide">HRMS</span>
                  <div className="text-xs text-blue-400 font-medium tracking-wider">NEXA CIRCUIT</div>
                </div>
              </motion.div>
              
              <div className="relative">
                <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400/50 to-blue-600/20 rounded-full"></div>
                <p className="text-slate-300 max-w-sm leading-relaxed text-base pl-4">
                  NC.HRMS helps teams automate HR operations so they can focus on what matters most.
                </p>
              </div>
              
              {/* Architectural Detail Line */}
              <div className="mt-8 flex items-center gap-4">
                <div className="w-12 h-px bg-gradient-to-r from-blue-400 to-transparent"></div>
                <div className="w-2 h-2 bg-blue-400/60 rotate-45"></div>
                <div className="w-6 h-px bg-gradient-to-r from-blue-400/60 to-transparent"></div>
              </div>
            </div>
            
            {/* Spacer Column */}
            <div className="hidden lg:block"></div>
            
            {/* Contact Section */}
            <div className="lg:col-span-1">
              <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 relative overflow-hidden">
                {/* Card Accent */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400/10 to-transparent rounded-bl-2xl"></div>
                
                <h4 className="font-bold mb-6 text-xl text-white relative">
                  Get in touch
                  <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-blue-400"></div>
                </h4>
                
                <div className="space-y-5">
                  <motion.div 
                    className="group flex items-center gap-4"
                    whileHover={{ x: 8 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="w-10 h-10 bg-slate-700/50 rounded-lg flex items-center justify-center group-hover:bg-blue-400/20 transition-colors duration-300">
                      <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <a href="mailto:hello@nchrms.example" className="text-slate-400 hover:text-white transition-colors duration-300 font-medium">
                      hello@nexa-circuit.com
                    </a>
                  </motion.div>
                  
                  <motion.div 
                    className="group flex items-center gap-4"
                    whileHover={{ x: 8 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="w-10 h-10 bg-slate-700/50 rounded-lg flex items-center justify-center group-hover:bg-blue-400/20 transition-colors duration-300">
                      <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <a href="tel:+265998351834" className="text-slate-400 hover:text-white transition-colors duration-300 font-medium">
                      +265 998 351 834
                    </a>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Architectural Footer Bar */}
          <motion.div 
            className="relative mt-16 pt-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
            <div className="container mx-auto px-6 max-w-7xl">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-slate-500 font-medium">
                  © {new Date().getFullYear()} NC.HRMS. All rights reserved.
                </div>
                <div className="flex items-center gap-2 text-slate-600 text-sm">
                  <span>Built with precision</span>
                  <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                  <span>Designed for the future</span>
                </div>
              </div>
            </div>
          </motion.div>
        </footer>
      </main>
    </div>
  );
}
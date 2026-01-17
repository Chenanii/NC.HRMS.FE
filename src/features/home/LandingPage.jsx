import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { 
  ChevronDown, Users, Shield, Zap, ArrowUp, Menu, X, 
  Play, Check, Sparkles, TrendingUp, Heart, 
  Clock, Award, Globe, ArrowRight, Phone, Mail
} from "lucide-react";
import logo from "../../assets/images/logo-tx.png";
import logowhite from "../../assets/images/logo-white.png";
import { Link } from "react-router-dom";

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
      question: "How quickly can we get started?",
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

  const features = [
    {
      icon: <Users className="w-6 h-6" />,
      title: "Employee Management",
      description: "Central employee directory with profiles, documents, and organizational charts all in one place."
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Payroll Automation",
      description: "Automated payroll runs, tax calculations, and benefit management that saves hours every month."
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Leave & Attendance",
      description: "Streamlined leave requests, approvals, and attendance tracking with real-time visibility."
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Performance Reviews",
      description: "Conduct meaningful performance reviews and track employee growth over time."
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Analytics & Insights",
      description: "Powerful people analytics and exportable reports to help you make data-driven decisions."
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure & Compliant",
      description: "GDPR-ready data handling, role-based access control, and compliance with local regulations."
    }
  ];

  const stats = [
    { value: "15hrs", label: "Saved per month", icon: <Clock className="w-5 h-5" /> },
    { value: "99.9%", label: "Uptime guarantee", icon: <Shield className="w-5 h-5" /> },
    { value: "24/7", label: "Support available", icon: <Heart className="w-5 h-5" /> },
    { value: "30min", label: "Setup time", icon: <Zap className="w-5 h-5" /> }
  ];

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
        className="fixed top-0 left-0 right-0 h-1 origin-left z-50"
        style={{ scaleX: scrollProgress, transformOrigin: "0%", backgroundColor: "#15803d" }}
      />
  
      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-40 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110"
            style={{ backgroundColor: "#15803d" }}
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Navbar */}
      <header
        className={`fixed w-full z-50 transition-all duration-300 ${
          isSticky ? "bg-white/95 backdrop-blur-md shadow-md py-3" : "bg-transparent py-4"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <motion.a 
            href="#home" 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <img src={logo} alt="NC.HRMS" className="h-6 sm:h-8 w-auto" />
           </motion.a>

            <nav className="hidden lg:flex items-center gap-1">
            {["Features", "Pricing", "FAQ", "Contact"].map((item) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                className="px-4 py-2 text-slate-700 rounded-lg hover:bg-slate-50 transition-all font-medium"
                onMouseEnter={(e) => e.currentTarget.style.color = "#15803d"}
                onMouseLeave={(e) => e.currentTarget.style.color = ""}
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
                >
                  {item}
                </motion.a>
              ))}
            </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="hidden sm:inline-flex items-center gap-2 rounded-lg px-6 py-2.5 text-white font-semibold shadow-md hover:shadow-lg transition-all"
              style={{ backgroundColor: "#15803d" }}
            >
              Sign In
            </Link>
            
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
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
              <div className="container mx-auto px-4 py-4 flex flex-col gap-2">
                {["Features", "Pricing", "FAQ", "Contact"].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="py-3 px-4 text-slate-700 hover:bg-slate-50 rounded-lg transition-colors font-medium"
                    onMouseEnter={(e) => e.currentTarget.style.color = "#15803d"}
                    onMouseLeave={(e) => e.currentTarget.style.color = ""}
                    onClick={() => setMobileOpen(false)}
                  >
                    {item}
                  </a>
                ))}
                <div className="border-t border-slate-200 my-2"></div>
                  <Link
                  to="/login"
                  className="flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-white font-semibold hover:shadow-lg transition-all"
                  style={{ backgroundColor: "#15803d" }}
                  onClick={() => setMobileOpen(false)}
                  >
                  Sign In
                  </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main>
      <section 
  id="home"
  className="relative min-h-screen flex items-center justify-between overflow-hidden bg-white pt-20 pb-32"
>

  {/* LEFT TEXT CONTENT */}
  <motion.div 
    className="container px-4 sm:px-6 lg:px-12 max-w-3xl flex flex-col gap-6 relative z-10"
    variants={containerVariants}
    initial="hidden"
    animate="visible"
  >
    <motion.h3
      className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight"
      variants={itemVariants}
    >
      <span style={{ color: "#15803d" }}>HR Made Simple,</span>
      <br />
      <span className="text-slate-800">People Made Priority</span>
    </motion.h3>

    <motion.p 
      className="text-xl sm:text-2xl text-slate-600 leading-relaxed max-w-xl"
      variants={itemVariants}
    >
      Streamline your HR operations with an all-in-one platform designed to help you focus on what matters most your people.
    </motion.p>

    {/* CTA BUTTONS */}
    <motion.div 
      className="flex flex-wrap items-center gap-4"
      variants={itemVariants}
    >
      <Link 
        to="/register" 
        className="group inline-flex items-center gap-3 rounded-lg px-8 py-4 text-white font-semibold text-lg shadow-md hover:shadow-lg transition-all"
        style={{ backgroundColor: "#15803d" }}
      >
        <Play className="w-5 h-5" />
        Start Free Trial
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </Link>

      <motion.a 
        href="#features" 
        className="inline-flex items-center gap-2 px-8 py-4 border-2 border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-semibold text-lg transition-all"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        See How It Works
      </motion.a>
    </motion.div>

    {/* STATS */}
    <motion.div 
      className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-lg"
      variants={containerVariants}
    >
      {stats.map((stat,i)=>(
        <motion.div 
          key={i}
          className="bg-slate-50 rounded-lg p-5 border border-slate-200"
          variants={itemVariants}
        >
          <div className="mb-2 flex items-center gap-2" style={{ color: "#15803d" }}>
            {stat.icon}
          </div>
          <div className="text-2xl font-bold">{stat.value}</div>
          <div className="text-sm text-slate-600 font-medium">{stat.label}</div>
        </motion.div>
      ))}
    </motion.div>
  </motion.div>


  {/* RIGHT BACKGROUND SVG */}
  <div className="absolute right-0 top-0 w-[50%] h-full pointer-events-none flex items-center justify-center opacity-90">
    <svg width="100%" height="100%" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
      <circle cx="400" cy="350" r="320" fill="#15803d" fillOpacity="0.08"/>
      <circle cx="480" cy="300" r="200" fill="#15803d" fillOpacity="0.12"/>
    </svg>
  </div>


  {/* SCROLL ICON */}
  <motion.div
    className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
    animate={{ y: [0, 10, 0] }}
    transition={{ repeat: Infinity, duration: 2 }}
  >
    <ChevronDown className="w-6 h-6 text-slate-400" />
  </motion.div>

</section>

        {/* Features Section */}
        <section 
          id="features" 
          className="py-24 bg-white"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div 
              className="text-center max-w-3xl mx-auto mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: "#15803d" }}>
                Everything You Need
              </span>
              <h2 className="text-4xl sm:text-5xl font-bold text-slate-800 mb-6">
                Powerful features for modern teams
              </h2>
              <p className="text-xl text-slate-600">
                All the tools you need to manage your workforce efficiently, all in one beautiful platform.
              </p>
              </motion.div>

              <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {features.map((feature, i) => (
                <motion.div 
                  key={i}
                  className="group bg-white p-8 rounded-lg border border-slate-200 hover:border-slate-300 transition-all"
                  variants={itemVariants}
                  whileHover={{ y: -2 }}
                >
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center text-white mb-6" style={{ backgroundColor: "#15803d" }}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Pricing Section */}
        <section 
          id="pricing" 
          className="py-24 bg-slate-50"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="text-center max-w-3xl mx-auto mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: "#15803d" }}>
                Simple Pricing
              </span>
              <h2 className="text-4xl sm:text-5xl font-bold text-slate-800 mb-6">
                Choose the plan that works for you
              </h2>
              <p className="text-xl text-slate-600">
                Start free, upgrade when you're ready. No credit card required.
              </p>
            </motion.div>

          <motion.div 
              className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
              {/* Free Plan */}
              <motion.div 
                className="bg-white rounded-lg border border-slate-200 p-8 transition-all"
                variants={itemVariants}
                whileHover={{ y: -4 }}
              >
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">Free</h3>
                  <p className="text-slate-600 mb-6">Perfect to get started</p>
                  <div className="mb-2">
                    <span className="text-5xl font-bold text-slate-800">$0</span>
                    <span className="text-slate-600">/month</span>
                  </div>
                  <p className="text-sm text-slate-500">Free forever</p>
                </div>

                <ul className="space-y-4 mb-8">
                  {[
                    "Up to 2 employees",
                    "Employee directory",
                    "Basic leave management",
                    "Time tracking",
                    "Email support"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#15803d", opacity: 0.1 }}>
                        <Check className="w-3 h-3" style={{ color: "#15803d" }} />
                      </div>
                      <span className="text-slate-700">{item}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/register"
                  className="block w-full text-center px-6 py-4 border-2 rounded-lg font-semibold hover:bg-slate-50 transition-all"
                  style={{ borderColor: "#15803d", color: "#15803d" }}
                >
                  Get Started Free
                </Link>
            </motion.div>
            
              {/* Pro Plan */}
            <motion.div
                className="rounded-lg border-2 p-8 relative transition-all text-white"
                style={{ backgroundColor: "#15803d", borderColor: "#15803d" }}
                variants={itemVariants}
                whileHover={{ y: -4 }}
              >
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-white px-6 py-2 rounded-full text-sm font-bold shadow-md" style={{ color: "#15803d" }}>
                    Most Popular
                  </span>
                </div>
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">Pro</h3>
                  <p className="text-white/90 mb-6">Everything you need to scale</p>
                  <div className="mb-2">
                    <span className="text-5xl font-bold">$12</span>
                    <span className="text-white/80">/month</span>
                  </div>
                  <p className="text-sm text-white/80">Billed monthly</p>
                </div>

                <ul className="space-y-4 mb-8">
                  {[
                    "Unlimited employees",
                    "Everything in Free",
                    "Payroll management",
                    "Performance reviews",
                    "Advanced analytics",
                    "Priority support"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-white/30 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3" />
                      </div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/register"
                  className="block w-full text-center px-6 py-4 bg-white rounded-lg font-semibold hover:bg-slate-50 transition-all shadow-md"
                  style={{ color: "#15803d" }}
                >
                  Start 14-Day Trial
                </Link>
                  </motion.div>
            </motion.div>
          </div>
        </section>

        {/* FAQ Section */}
        <section 
          id="faq" 
          className="py-24 bg-white"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: "#15803d" }}>
                Got Questions?
              </span>
              <h2 className="text-4xl sm:text-5xl font-bold text-slate-800 mb-6">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-slate-600">
                Everything you need to know about NC.HRMS
              </p>
            </motion.div>

            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <motion.div 
                  key={i}
                  className="bg-slate-50 rounded-2xl shadow-md border border-slate-100 overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * i }}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-slate-100 transition-colors"
                  >
                    <span className="font-semibold text-lg text-slate-800 pr-4">{faq.question}</span>
                    <motion.div
                      animate={{ rotate: openFaq === i ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex-shrink-0"
                    >
                      <ChevronDown className="w-5 h-5" style={{ color: "#15803d" }} />
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
                        <div className="px-6 pb-5 text-slate-600 leading-relaxed">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 text-white relative overflow-hidden" style={{ backgroundColor: "#15803d" }}>
          <motion.div 
            className="container mx-auto px-4 sm:px-6 lg:px-8 text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            >
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              Ready to transform your HR operations?
            </h2>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
              Join hundreds of companies already using NC.HRMS to streamline their HR processes and focus on what matters most.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link 
                to="/register" 
                className="inline-flex items-center gap-2 px-8 py-4 bg-white rounded-lg font-semibold text-lg shadow-md hover:shadow-lg transition-all"
                style={{ color: "#15803d" }}
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </Link>
              <motion.a 
                href="#contact" 
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white rounded-lg text-white hover:bg-white font-semibold text-lg transition-all"
                onMouseEnter={(e) => e.currentTarget.style.color = "#15803d"}
                onMouseLeave={(e) => e.currentTarget.style.color = "white"}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Contact Sales
              </motion.a>
            </div>
          </motion.div>
        </section>

        {/* Footer */}
        <footer id="contact" className="bg-slate-900 text-white py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
              {/* Brand */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <img src={logowhite} alt="NC.HRMS" className="h-10 w-auto" />
                  <div>
                    <div className="font-bold text-xl">NC.HRMS</div>
                    <div className="text-sm text-slate-400">Nexa Circuit</div>
                </div>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Helping teams automate HR operations so they can focus on what matters most their people.
                </p>
              </div>
              
              {/* Quick Links */}
              <div>
                <h4 className="font-bold text-lg mb-6">Quick Links</h4>
                <ul className="space-y-3">
                  {["Features", "Pricing", "FAQ", "Contact"].map((link) => (
                    <li key={link}>
                      <a 
                        href={`#${link.toLowerCase()}`}
                        className="text-slate-400 hover:text-white transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
            </div>
            
              {/* Contact */}
              <div>
                <h4 className="font-bold text-lg mb-6">Get in Touch</h4>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3 text-slate-400">
                    <Mail className="w-5 h-5" style={{ color: "#15803d" }} />
                    <a href="mailto:hello@nexa-circuit.com" className="hover:text-white transition-colors">
                      hello@nexa-circuit.com
                    </a>
                  </li>
                  <li className="flex items-center gap-3 text-slate-400">
                    <Phone className="w-5 h-5" style={{ color: "#15803d" }} />
                    <a href="tel:+265998351834" className="hover:text-white transition-colors">
                      +265 998 351 834
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-slate-500 text-sm">
                  © {new Date().getFullYear()} NC.HRMS. All rights reserved.
                </p>
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                  <span>Built with</span>
                  <Heart className="w-4 h-4" style={{ color: "#15803d", fill: "#15803d" }} />
                  <span>in Malawi</span>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

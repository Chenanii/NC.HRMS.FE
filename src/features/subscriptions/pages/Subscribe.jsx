import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { ShieldCheck, CreditCard, Smartphone, Info, Loader2 } from "lucide-react";
import paypalLogo from '../../../assets/images/paypal.png';
import airtelLogo from '../../../assets/images/airtel money.png';
import {
  getSubscriptionPlans,
  initiatePayPalPayment,
  initiateAirtelMoneyPayment,
} from "../services/subscriptionsService";

// ─── Plan pill ────────────────────────────────────────────────────────────────

function PlanPill({ plan, selected, onSelect }) {
  const active = selected?.id === plan.id;
  return (
    <div
      onClick={() => onSelect(plan)}
      className={`flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-all duration-150
        ${active
          ? "border-[1.5px] border-[#1a7a4a] bg-[#f6fcf9]"
          : "border border-gray-200 bg-white hover:border-[#1a7a4a]"
        }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-4 h-4 rounded-full border-[1.5px] flex items-center justify-center flex-shrink-0 transition-all duration-150
            ${active ? "border-[#1a7a4a] bg-[#1a7a4a]" : "border-gray-300"}`}
        >
          {active && <span className="w-1.5 h-1.5 rounded-full bg-white block" />}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">{plan.name}</p>
          <p className="text-xs text-gray-400 mt-0.5">{plan.description || "Billed monthly"}</p>
        </div>
      </div>
      <div className="text-right">
        <span className="text-sm font-semibold text-[#1a7a4a]">${plan.price}</span>
        <span className="text-xs text-gray-400">/mo</span>
      </div>
    </div>
  );
}

// ─── Method accordion item ────────────────────────────────────────────────────

function MethodCard({ method, active, onToggle, children }) {
  const logos = {
    paypal: { bg: "bg-[#FFFFFF]", src: paypalLogo, alt: 'PayPal' },
    airtel: { bg: "bg-[#FFFFFF]", src: airtelLogo, alt: 'Airtel Money' },
  };
  const names = {
    paypal: { title: "PayPal", sub: "Redirect to PayPal to complete payment" },
    airtel: { title: "Airtel Money", sub: "Pay via Airtel mobile money" },
  };
  const logo = logos[method];
  const meta = names[method];

  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <div
        className="flex items-center gap-3 px-4 py-3.5 cursor-pointer select-none"
        onClick={onToggle}
      >
        <div className={`w-13 h-11 rounded-xl ${logo.bg} flex items-center justify-center flex-shrink-0 p-1`}>
          {logo.src ? (
            <img src={logo.src} alt={logo.alt} className="w-full h-full object-contain" />
          ) : (
            <span className="text-base font-bold">{logo.label}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900">{meta.title}</p>
          <p className="text-xs text-gray-400 mt-0.5 truncate">{meta.sub}</p>
        </div>
        <div className={`w-[18px] h-[18px] rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-150
          ${active ? "bg-[#1a7a4a] border-[#1a7a4a] border" : "border border-gray-300"}`}>
          {active && <span className="text-white" style={{ fontSize: 10 }}>✓</span>}
        </div>
      </div>

      {active && (
        <div className="px-4 pb-4 flex flex-col gap-3">
          {children}
        </div>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function Subscribe() {
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [activeMethod, setActiveMethod] = useState("paypal");
  const [phone, setPhone] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => { fetchPlans(); }, []);

  const fetchPlans = async () => {
    try {
      const data = await getSubscriptionPlans();
      const list = Array.isArray(data) ? data
        : Array.isArray(data?.items) ? data.items
        : Array.isArray(data?.result) ? data.result
        : Array.isArray(data?.data) ? data.data
        : [];
      setPlans(list);
      if (list.length > 0) setSelectedPlan(list[0]);
    } catch {
      toast.error("Failed to load plans");
    }
  };

  const handlePayPal = async () => {
    if (!selectedPlan) return toast.error("Select a plan");
    setProcessing(true);
    try {
      const res = await initiatePayPalPayment(selectedPlan.id, selectedPlan.price);
      if (res?.approvalUrl) {
        window.open(res.approvalUrl, "_blank");
        toast.success("Redirecting to PayPal…");
      } else {
        toast.error("Unable to start PayPal payment");
      }
    } catch (err) {
      toast.error(err?.message || "PayPal initiation failed");
    } finally {
      setProcessing(false);
    }
  };

  const handleAirtel = async () => {
    if (!selectedPlan) return toast.error("Select a plan");
    if (!phone.trim()) return toast.error("Enter your Airtel Money number");
    setProcessing(true);
    try {
      const res = await initiateAirtelMoneyPayment(selectedPlan.id, selectedPlan.price, phone);
      if (res?.transactionId) {
        toast.success("Payment initiated — check your phone to complete.");
      } else {
        toast.error("Unable to start Airtel Money payment");
      }
    } catch (err) {
      toast.error(err?.message || "Airtel initiation failed");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-md flex flex-col gap-3">

        {/* ── Header ── */}
        <div className="mb-1">
          <h1 className="text-xl font-semibold text-gray-900">Subscribe to NC.HRMS</h1>
          <p className="text-sm text-gray-400 mt-1">Select a plan and complete payment to get started.</p>
        </div>

        {/* ── Plan selector ── */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Select plan</p>
          <div className="flex flex-col gap-2">
            {plans.length === 0 ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="w-5 h-5 text-[#1a7a4a] animate-spin" />
              </div>
            ) : (
              plans.map((plan) => (
                <PlanPill
                  key={plan.id}
                  plan={plan}
                  selected={selectedPlan}
                  onSelect={setSelectedPlan}
                />
              ))
            )}
          </div>
        </div>

        {/* ── Summary bar ── */}
        {selectedPlan && (
          <div className="bg-[#f6fcf9] border border-[#c8e9d8] rounded-xl px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-xs text-[#3b7a5c]">Selected plan</p>
              <p className="text-sm font-semibold text-[#145c37] mt-0.5">{selectedPlan.name}</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-semibold text-[#1a7a4a]">${selectedPlan.price}</p>
              <p className="text-xs text-[#3b7a5c]">per month</p>
            </div>
          </div>
        )}

        {/* ── Payment methods ── */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-4 pt-4 pb-2">Payment method</p>

          {/* PayPal */}
          <MethodCard
            method="paypal"
            active={activeMethod === "paypal"}
            onToggle={() => setActiveMethod("paypal")}
          >
            <div className="flex items-start gap-2 bg-blue-50 rounded-xl px-3 py-2.5 text-xs text-blue-700 leading-relaxed">
              <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
              You'll be redirected to PayPal to complete payment securely. No card details are stored here.
            </div>
            <button
              onClick={handlePayPal}
              disabled={processing || !selectedPlan}
              className="w-full flex items-center justify-center gap-2 bg-[#003087] hover:bg-[#002570] active:bg-[#001d5c] text-white text-sm font-semibold py-3 rounded-xl transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing
                ? <Loader2 className="w-4 h-4 animate-spin" />
                : <CreditCard className="w-4 h-4" />
              }
              {processing ? "Connecting…" : "Continue to PayPal"}
            </button>
          </MethodCard>

          {/* Airtel Money */}
          <MethodCard
            method="airtel"
            active={activeMethod === "airtel"}
            onToggle={() => setActiveMethod("airtel")}
          >
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-gray-400">Airtel Money number</label>
              <div className="flex">
                <span className="px-3 py-2.5 border border-r-0 border-gray-200 rounded-l-xl text-sm bg-gray-100 text-gray-500 whitespace-nowrap">
                  +265
                </span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="099 123 4567"
                  className="flex-1 border border-gray-200 rounded-r-xl px-3 py-2.5 text-sm text-gray-900 bg-gray-50 focus:outline-none focus:border-[#1a7a4a] transition-colors"
                />
              </div>
            </div>
            <button
              onClick={handleAirtel}
              disabled={processing || !selectedPlan}
              className="w-full flex items-center justify-center gap-2 bg-[#e40000] hover:bg-[#c40000] active:bg-[#a30000] text-white text-sm font-semibold py-3 rounded-xl transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing
                ? <Loader2 className="w-4 h-4 animate-spin" />
                : <Smartphone className="w-4 h-4" />
              }
              {processing ? "Initiating…" : "Pay with Airtel Money"}
            </button>
          </MethodCard>
        </div>

        {/* ── Secure note ── */}
        <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400 pb-2">
          <ShieldCheck className="w-3.5 h-3.5 text-[#1a7a4a]" />
          Payments are 256-bit SSL encrypted and secure
        </div>

      </div>
    </div>
  );
}